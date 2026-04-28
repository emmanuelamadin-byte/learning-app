import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG, DEMO_MODE, STORAGE_KEYS, SUPABASE_ENABLED } from "./config.js";
import { createSeedData } from "./mock-data.js";
import {
  byNewest,
  deferredDelay,
  readFileAsDataUrl,
  roundHours,
  stripUndefined,
  uid,
} from "./utils.js";

const AVATAR_BUCKET = "avatars";
const SUBMIT_WINDOW_MS = 10_000;
const MAX_SESSIONS_PER_WINDOW = 8;

const supabase = SUPABASE_ENABLED
  ? createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

function parse(json, fallback) {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
}

function loadDemoState() {
  const saved = parse(localStorage.getItem(STORAGE_KEYS.demoState), null);
  const state = saved || createSeedData();
  localStorage.setItem(STORAGE_KEYS.demoState, JSON.stringify(state));
  if (!localStorage.getItem(STORAGE_KEYS.demoCurrentUser)) {
    localStorage.setItem(STORAGE_KEYS.demoCurrentUser, state.currentUserId);
  }
  return state;
}

function saveDemoState(state) {
  localStorage.setItem(STORAGE_KEYS.demoState, JSON.stringify(state));
}

function loadCache() {
  return parse(localStorage.getItem(STORAGE_KEYS.cache), {
    currentUserId: null,
    profiles: [],
    sessions: [],
    reactions: [],
    announcements: [],
    userStreaks: [],
  });
}

function saveCache(snapshot) {
  localStorage.setItem(
    STORAGE_KEYS.cache,
    JSON.stringify({
      currentUserId: snapshot.currentUserId,
      profiles: snapshot.profiles,
      sessions: snapshot.sessions,
      reactions: snapshot.reactions,
      announcements: snapshot.announcements,
      userStreaks: snapshot.userStreaks || [],
    }),
  );
}

function loadQueue() {
  return parse(localStorage.getItem(STORAGE_KEYS.queue), []);
}

function saveQueue(queue) {
  localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue));
}

function normalizeProfile(record) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    photoUrl: record.photo_url || record.photoUrl || "",
    weeklyGoal: record.weekly_goal ?? record.weeklyGoal ?? 20,
    createdAt: record.created_at || record.createdAt,
    onboardingCompletedAt:
      record.onboarding_completed_at || record.onboardingCompletedAt || null,
    notificationsEnabled:
      record.notifications_enabled ?? record.notificationsEnabled ?? false,
    reminderTime: record.reminder_time || record.reminderTime || "19:00",
    telegramHandle: record.telegram_handle || record.telegramHandle || "",
    isAdmin: Boolean(record.is_admin ?? record.isAdmin),
    password: record.password,
  };
}

function normalizeSession(record) {
  return {
    id: record.id,
    clientId: record.client_id || record.clientId || uid(),
    userId: record.user_id || record.userId,
    learned: record.learned,
    hours: Number(record.hours),
    challenges: record.challenges || "",
    loggedAt: record.logged_at || record.loggedAt,
    sessionDay: record.session_day || record.sessionDay,
    createdAt: record.created_at || record.createdAt || record.logged_at || record.loggedAt,
    updatedAt: record.updated_at || record.updatedAt || record.logged_at || record.loggedAt,
    syncStatus: record.syncStatus || "synced",
  };
}

function normalizeReaction(record) {
  return {
    id: record.id,
    sessionId: record.session_id || record.sessionId,
    userId: record.user_id || record.userId,
    emoji: record.emoji,
  };
}

function normalizeAnnouncement(record) {
  return {
    id: record.id,
    body: record.body,
    createdAt: record.created_at || record.createdAt,
    authorId: record.author_id || record.authorId,
    active: record.active ?? true,
  };
}

function normalizeUserStreak(record) {
  return {
    userId: record.user_id || record.userId,
    currentStreak: Number(record.current_streak ?? record.currentStreak ?? 0),
    longestStreak: Number(record.longest_streak ?? record.longestStreak ?? 0),
    lastActive: record.last_active || record.lastActive || null,
    updatedAt: record.updated_at || record.updatedAt || null,
  };
}

function toProfileRow(profile) {
  return stripUndefined({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    photo_url: profile.photoUrl,
    weekly_goal: profile.weeklyGoal,
    onboarding_completed_at: profile.onboardingCompletedAt,
    notifications_enabled: profile.notificationsEnabled,
    reminder_time: profile.reminderTime,
    telegram_handle: profile.telegramHandle,
    is_admin: profile.isAdmin,
  });
}

function toSessionRow(session) {
  return {
    id: session.id.startsWith("local-") ? undefined : session.id,
    client_id: session.clientId,
    user_id: session.userId,
    learned: session.learned,
    hours: roundHours(session.hours),
    challenges: session.challenges || "",
    logged_at: session.loggedAt,
    session_day: session.sessionDay,
  };
}

function getCurrentDemoUserId() {
  return localStorage.getItem(STORAGE_KEYS.demoCurrentUser) || loadDemoState().currentUserId;
}

function setCurrentDemoUserId(id) {
  localStorage.setItem(STORAGE_KEYS.demoCurrentUser, id);
}

async function uploadAvatar(file, userId) {
  if (!file) {
    return "";
  }

  if (DEMO_MODE || !supabase) {
    return readFileAsDataUrl(file);
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    return readFileAsDataUrl(file);
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function refreshUserStreaks(userId) {
  if (DEMO_MODE || !supabase || !userId) {
    return;
  }

  const { error } = await supabase.rpc("refresh_user_streaks", { p_user_id: userId });
  if (error) {
    console.error("refresh_user_streaks failed:", error);
  }
}

function enforceLocalRateLimit(userId) {
  const key = `learn-tracker.submit-rate.${userId}`;
  const previous = parse(localStorage.getItem(key), []);
  const windowStart = Date.now() - SUBMIT_WINDOW_MS;
  const filtered = previous.filter((value) => value > windowStart);

  if (filtered.length >= MAX_SESSIONS_PER_WINDOW) {
    throw new Error("You are logging too fast. Please wait a few seconds.");
  }

  filtered.push(Date.now());
  localStorage.setItem(key, JSON.stringify(filtered));
}

function mergeQueuedSessions(snapshot) {
  const queued = loadQueue();
  if (!queued.length) {
    return snapshot;
  }

  const existingClientIds = new Set(snapshot.sessions.map((session) => session.clientId));
  const optimisticSessions = queued
    .filter((entry) => !existingClientIds.has(entry.clientId))
    .map((entry) => ({ ...entry, syncStatus: "queued" }));

  return {
    ...snapshot,
    sessions: byNewest([...optimisticSessions, ...snapshot.sessions], "loggedAt"),
  };
}

async function fetchSupabaseSnapshot() {
  const [
    authResult,
    profilesResult,
    sessionsResult,
    reactionsResult,
    announcementsResult,
    userStreaksResult,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("profiles").select("*").order("created_at", { ascending: true }),
    supabase.from("learning_sessions").select("*").order("logged_at", { ascending: false }),
    supabase.from("session_reactions").select("*"),
    supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("user_streaks").select("*"),
  ]);

  if (profilesResult.error) throw profilesResult.error;
  if (sessionsResult.error) throw sessionsResult.error;
  if (reactionsResult.error) throw reactionsResult.error;
  if (announcementsResult.error) throw announcementsResult.error;

  if (userStreaksResult.error) {
    console.error("user_streaks fetch failed:", userStreaksResult.error);
  }

  return {
    currentUserId: authResult.data.user?.id || null,
    profiles: (profilesResult.data || []).map(normalizeProfile),
    sessions: (sessionsResult.data || []).map(normalizeSession),
    reactions: (reactionsResult.data || []).map(normalizeReaction),
    announcements: (announcementsResult.data || []).map(normalizeAnnouncement),
    userStreaks: (userStreaksResult.data || []).map(normalizeUserStreak),
  };
}

async function flushQueuedSessions() {
  if (DEMO_MODE || !supabase || !navigator.onLine) {
    return [];
  }

  const queued = loadQueue();
  if (!queued.length) {
    return [];
  }

  for (const session of queued) {
    const { error } = await supabase.from("learning_sessions").upsert(toSessionRow(session), {
      onConflict: "client_id",
    });

    if (error) {
      throw error;
    }

    await refreshUserStreaks(session.userId);
  }

  saveQueue([]);
  return queued;
}

export const dataClient = {
  mode: DEMO_MODE ? "demo" : "supabase",
  supabase,

  async init() {
    if (DEMO_MODE) {
      loadDemoState();
      return;
    }

    await deferredDelay(120);
  },

  async loadSnapshot() {
    if (DEMO_MODE) {
      const state = loadDemoState();
      const snapshot = {
        currentUserId: getCurrentDemoUserId(),
        profiles: state.profiles.map(normalizeProfile),
        sessions: byNewest(state.sessions.map(normalizeSession), "loggedAt"),
        reactions: state.reactions.map(normalizeReaction),
        announcements: byNewest(state.announcements.map(normalizeAnnouncement), "createdAt"),
        userStreaks: [],
      };

      return {
        ...snapshot,
        currentUser:
          snapshot.profiles.find((profile) => profile.id === snapshot.currentUserId) || null,
      };
    }

    if (navigator.onLine) {
      await flushQueuedSessions();
    }

    const snapshot = mergeQueuedSessions(await fetchSupabaseSnapshot());
    saveCache(snapshot);

    return {
      ...snapshot,
      currentUser:
        snapshot.profiles.find((profile) => profile.id === snapshot.currentUserId) || null,
    };
  },

  async signIn({ email, password }) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      const user = state.profiles.find(
        (profile) => profile.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user || user.password !== password) {
        throw new Error("Use one of the demo accounts with password demo1234.");
      }

      setCurrentDemoUserId(user.id);
      return normalizeProfile(user);
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async signUp({ name, email, password, weeklyGoal, photoFile }) {
    if (DEMO_MODE) {
      const state = loadDemoState();

      if (state.profiles.some((profile) => profile.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("That demo email already exists.");
      }

      const id = `demo-${uid()}`;
      const photoUrl = photoFile ? await uploadAvatar(photoFile, id) : "";
      const profile = normalizeProfile({
        id,
        name,
        email,
        password,
        photoUrl,
        weeklyGoal,
        createdAt: new Date().toISOString(),
        onboardingCompletedAt: null,
        notificationsEnabled: false,
        reminderTime: "19:00",
        telegramHandle: "",
        isAdmin: APP_CONFIG.adminEmails.includes(email.toLowerCase()),
      });

      state.profiles.push(profile);
      state.currentUserId = id;
      saveDemoState(state);
      setCurrentDemoUserId(id);
      return profile;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;

    const userId = data.user?.id;
    const photoUrl = photoFile && userId ? await uploadAvatar(photoFile, userId) : "";
    const profile = normalizeProfile({
      id: userId,
      name,
      email,
      photoUrl,
      weeklyGoal,
      createdAt: new Date().toISOString(),
      onboardingCompletedAt: null,
      notificationsEnabled: false,
      reminderTime: "19:00",
      telegramHandle: "",
      isAdmin: APP_CONFIG.adminEmails.includes(email.toLowerCase()),
    });

    const { error: profileError } = await supabase.from("profiles").upsert(toProfileRow(profile));
    if (profileError) throw profileError;

    return profile;
  },

  async signOut() {
    if (DEMO_MODE) {
      localStorage.removeItem(STORAGE_KEYS.demoCurrentUser);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email) {
    if (DEMO_MODE) {
      throw new Error("Password reset is not available in demo mode.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "#/reset-password",
    });

    if (error) throw error;
  },

  async signInWithGoogle() {
    if (DEMO_MODE) {
      throw new Error("Google Sign-In is not available in demo mode.");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  },

  async saveProfile(profileId, updates) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.profiles = state.profiles.map((profile) =>
        profile.id === profileId ? { ...profile, ...updates } : profile,
      );
      saveDemoState(state);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(toProfileRow({ id: profileId, ...updates }), { onConflict: "id" });

    if (error) throw error;
  },

  async completeOnboarding(profileId, updates) {
    return this.saveProfile(profileId, {
      ...updates,
      onboardingCompletedAt: new Date().toISOString(),
    });
  },

  async createSession(userId, payload) {
    enforceLocalRateLimit(userId);

    const session = normalizeSession({
      id: `local-${uid()}`,
      clientId: uid(),
      userId,
      learned: payload.learned.trim(),
      hours: Number(payload.hours),
      challenges: payload.challenges?.trim() || "",
      loggedAt: new Date().toISOString(),
      sessionDay: payload.sessionDay,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "queued",
    });

    if (DEMO_MODE) {
      const state = loadDemoState();
      state.sessions.unshift(session);
      saveDemoState(state);
      return { queued: false, session };
    }

    if (!navigator.onLine) {
      saveQueue([...loadQueue(), session]);
      return { queued: true, session };
    }

    const { data, error } = await supabase
      .from("learning_sessions")
      .insert(toSessionRow(session))
      .select()
      .single();

    if (error) {
      console.error("createSession failed:", error);
      throw error;
    }

    await refreshUserStreaks(userId);

    return { queued: false, session: normalizeSession(data) };
  },

  async updateSession(session, updates) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.sessions = state.sessions.map((item) =>
        item.id === session.id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
      );
      saveDemoState(state);
      return;
    }

    if (session.syncStatus === "queued" || session.id.startsWith("local-")) {
      throw new Error("This session has not synced yet, so it cannot be edited.");
    }

    const { error } = await supabase
      .from("learning_sessions")
      .update({
        learned: updates.learned,
        hours: updates.hours,
        challenges: updates.challenges,
        session_day: updates.sessionDay,
      })
      .eq("id", session.id);

    if (error) throw error;

    await refreshUserStreaks(session.userId);
  },

  async deleteSession(session) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.sessions = state.sessions.filter((item) => item.id !== session.id);
      state.reactions = state.reactions.filter((reaction) => reaction.sessionId !== session.id);
      saveDemoState(state);
      return;
    }

    if (session.syncStatus === "queued" || session.id.startsWith("local-")) {
      throw new Error("This session has not synced yet, so it cannot be deleted.");
    }

    const { error } = await supabase.from("learning_sessions").delete().eq("id", session.id);
    if (error) throw error;

    await refreshUserStreaks(session.userId);
  },

  async toggleReaction(userId, sessionId, emoji) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      const existing = state.reactions.find(
        (reaction) =>
          reaction.userId === userId &&
          reaction.sessionId === sessionId &&
          reaction.emoji === emoji,
      );

      state.reactions = existing
        ? state.reactions.filter((reaction) => reaction.id !== existing.id)
        : [...state.reactions, { id: uid(), userId, sessionId, emoji }];

      saveDemoState(state);
      return;
    }

    const { data: existing } = await supabase
      .from("session_reactions")
      .select("id")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .eq("emoji", emoji)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from("session_reactions").delete().eq("id", existing.id);
      if (error) throw error;
      return;
    }

    const { error } = await supabase.from("session_reactions").insert({
      user_id: userId,
      session_id: sessionId,
      emoji,
    });

    if (error) throw error;
  },

  async deleteSessionAsAdmin(sessionId) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.sessions = state.sessions.filter((session) => session.id !== sessionId);
      state.reactions = state.reactions.filter((reaction) => reaction.sessionId !== sessionId);
      saveDemoState(state);
      return;
    }

    const { data: sessionRow, error: lookupError } = await supabase
      .from("learning_sessions")
      .select("user_id")
      .eq("id", sessionId)
      .maybeSingle();

    if (lookupError) throw lookupError;

    const { error } = await supabase.from("learning_sessions").delete().eq("id", sessionId);
    if (error) throw error;

    await refreshUserStreaks(sessionRow?.user_id);
  },

  async removeUserAsAdmin(userId) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.profiles = state.profiles.filter((profile) => profile.id !== userId);
      state.sessions = state.sessions.filter((session) => session.userId !== userId);
      state.reactions = state.reactions.filter((reaction) => reaction.userId !== userId);
      saveDemoState(state);
      return;
    }

    const { error } = await supabase.functions.invoke("admin-remove-user", {
      body: { userId },
    });

    if (error) throw error;
  },

  async sendAnnouncement(authorId, body) {
    if (DEMO_MODE) {
      const state = loadDemoState();
      state.announcements.unshift({
        id: uid(),
        body,
        createdAt: new Date().toISOString(),
        authorId,
        active: true,
      });
      saveDemoState(state);
      return;
    }

    const { error } = await supabase.from("announcements").insert({
      body,
      author_id: authorId,
      active: true,
    });

    if (error) throw error;
  },

  onAuthStateChange(callback) {
    if (DEMO_MODE || !supabase) {
      return () => {};
    }

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return () => data.subscription.unsubscribe();
  },

  subscribeRealtime(callback) {
    if (DEMO_MODE || !supabase) {
      return () => {};
    }

    const channel = supabase
      .channel("learn-tracker-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        callback,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "learning_sessions" },
        callback,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_reactions" },
        callback,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        callback,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_streaks" },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support notifications.");
    }
    return Notification.requestPermission();
  },

  async flushQueue() {
    await flushQueuedSessions();
  },
};
