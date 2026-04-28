import React from "react";
import { dataClient } from "./lib/data-client.js";
import { APP_CONFIG, DEMO_MODE, STORAGE_KEYS } from "./lib/config.js";
import { html } from "./lib/html.js";
import { computeOwnerAnalytics, deriveUserMetrics, startOfWeek } from "./lib/metrics.js";
import { cn, isoDay, uid } from "./lib/utils.js";
import {
  AnnouncementBar,
  Avatar,
  ConfettiBurst,
  Modal,
  SkeletonCard,
  ToastStack,
} from "./components.js";

const DashboardView = React.lazy(() => import("./views/dashboard-view.js"));
const CommunityView = React.lazy(() => import("./views/community-view.js"));
const LeaderboardView = React.lazy(() => import("./views/leaderboard-view.js"));
const ProfileView = React.lazy(() => import("./views/profile-view.js"));
const AdminView = React.lazy(() => import("./views/admin-view.js"));

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [view = "dashboard", id = null] = hash.split("/");
  return { view: view || "dashboard", id };
}

function routeToHash(route) {
  return route.id ? `#/${route.view}/${route.id}` : `#/${route.view}`;
}

function makeSessionDraft(user) {
  return {
    learned: "",
    hours: 1,
    challenges: "",
    sessionDay: isoDay(new Date()),
    weeklyGoal: user?.weeklyGoal || APP_CONFIG.defaultWeeklyGoal,
  };
}

function makeAuthForm() {
  return {
    name: "",
    email: "",
    password: "",
    weeklyGoal: APP_CONFIG.defaultWeeklyGoal,
    photoFile: null,
    photoPreview: "",
  };
}

function buttonClass(variant = "primary") {
  if (variant === "ghost") {
    return "min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08]";
  }

  if (variant === "danger") {
    return "min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/15";
  }

  return "brand-gradient-bg min-h-12 rounded-2xl px-4 text-sm font-semibold transition hover:opacity-95";
}

function AuthScreen({
  authMode,
  setAuthMode,
  signInForm,
  setSignInForm,
  signUpForm,
  setSignUpForm,
  onSignIn,
  onSignUp,
  authBusy,
}) {
  return html`
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="hero-orb hero-orb--green left-[-3rem] top-[10rem] animate-floatSlow"></div>
      <div className="hero-orb hero-orb--blue right-[-3rem] top-[3rem] animate-floatSlow"></div>
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/55">
            Premium learning accountability
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-white md:text-7xl">
            Turn quiet intentions into
            <span className="gradient-text"> visible weekly momentum.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">
            Learn Tracker is built for study groups, disciplined solo learners, and teams who
            want public progress, sharp streaks, and clean feedback loops without the noise of a
            social network.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            ${[
              ["20h focus goal", "Default weekly target with visual pacing insights."],
              ["Public progress feed", "See each session from the people you learn beside."],
              ["Offline-first logging", "Keep recording sessions and sync once the internet returns."],
            ].map(
              ([title, detail]) => html`
                <div key=${title} className="glass-panel rounded-3xl p-5">
                  <div className="font-semibold text-white">${title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/58">${detail}</p>
                </div>
              `,
            )}
          </div>

          ${DEMO_MODE
            ? html`
                <div className="mt-6 glass-panel rounded-3xl border-accent/20 bg-gradient-to-r from-accent/10 to-accent2/10 p-4 text-sm text-white/70">
                  Demo mode is active. Use
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">owner@example.com</code>,
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">priya@example.com</code>,
                  or
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">jonah@example.com</code>
                  with password
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-white">demo1234</code>,
                  or register a new local demo account.
                </div>
              `
            : null}
        </section>

        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex rounded-2xl border border-white/8 bg-white/[0.03] p-1">
            ${[
              ["signin", "Sign in"],
              ["signup", "Create account"],
            ].map(
              ([mode, label]) => html`
                <button
                  key=${mode}
                  type="button"
                  onClick=${() => setAuthMode(mode)}
                  className=${cn(
                    "min-h-12 flex-1 rounded-2xl text-sm font-semibold transition",
                    authMode === mode
                      ? "bg-white text-slate-950"
                      : "text-white/55 hover:text-white/75",
                  )}
                >
                  ${label}
                </button>
              `,
            )}
          </div>

          ${authMode === "signin"
            ? html`
                <form className="mt-8 grid gap-4" onSubmit=${onSignIn}>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Email</span>
                    <input
                      type="email"
                      required
                      value=${signInForm.email}
                      onInput=${(event) =>
                        setSignInForm((current) => ({ ...current, email: event.target.value }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Password</span>
                    <input
                      type="password"
                      required
                      value=${signInForm.password}
                      onInput=${(event) =>
                        setSignInForm((current) => ({ ...current, password: event.target.value }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick=${() => {
                        const email = signInForm.email;
                        if (!email) return alert("Please enter your email first to reset your password.");
                        dataClient
                          .resetPassword(email)
                          .then(() => alert("Check your email for the reset link!"))
                          .catch((err) => alert("Error: " + err.message));
                      }}
                      className="text-xs text-white/45 hover:text-white/75 text-left mt-1"
                    >
                      Forgot password?
                    </button>
                  </label>
                  <button type="submit" disabled=${authBusy} className=${buttonClass()}>
                    ${authBusy ? "Signing you in..." : "Sign in"}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/30 text-sm">or</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    type="button"
                    onClick=${() => dataClient.signInWithGoogle()}
                    className="mt-1 w-full min-h-12 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google Logo" />
                    Sign in with Google
                  </button>
                </form>
              `
            : html`
                <form className="mt-8 grid gap-4" onSubmit=${onSignUp}>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Name</span>
                    <input
                      type="text"
                      required
                      value=${signUpForm.name}
                      onInput=${(event) =>
                        setSignUpForm((current) => ({ ...current, name: event.target.value }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Email</span>
                    <input
                      type="email"
                      required
                      value=${signUpForm.email}
                      onInput=${(event) =>
                        setSignUpForm((current) => ({ ...current, email: event.target.value }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Password</span>
                    <input
                      type="password"
                      required
                      minLength="8"
                      value=${signUpForm.password}
                      onInput=${(event) =>
                        setSignUpForm((current) => ({ ...current, password: event.target.value }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                      placeholder="At least 8 characters"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Weekly learning goal</span>
                    <input
                      type="number"
                      min="5"
                      step="1"
                      value=${signUpForm.weeklyGoal}
                      onInput=${(event) =>
                        setSignUpForm((current) => ({
                          ...current,
                          weeklyGoal: Number(event.target.value),
                        }))}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-white/62">Profile photo (optional)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange=${(event) => {
                        const file = event.target.files?.[0] || null;
                        const preview = file ? URL.createObjectURL(file) : "";
                        setSignUpForm((current) => ({ ...current, photoFile: file, photoPreview: preview }));
                      }}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75 file:mr-4 file:rounded-2xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  </label>
                  ${signUpForm.photoPreview
                    ? html`
                        <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                          <img
                            src=${signUpForm.photoPreview}
                            alt="Profile preview"
                            className="h-14 w-14 rounded-2xl object-cover"
                          />
                          <div className="text-sm text-white/62">Profile preview ready.</div>
                        </div>
                      `
                    : null}
                  <button type="submit" disabled=${authBusy} className=${buttonClass()}>
                    ${authBusy ? "Creating your account..." : "Create account"}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/30 text-sm">or</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    type="button"
                    onClick=${() => dataClient.signInWithGoogle()}
                    className="mt-1 w-full min-h-12 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google Logo" />
                    Sign up with Google
                  </button>
                </form>
              `}
        </section>
      </div>
    </main>
  `;
}

function OnboardingScreen({
  user,
  onboardingForm,
  setOnboardingForm,
  onComplete,
  onEnableNotifications,
  notificationPermission,
  installPromptReady,
  onInstall,
  busy,
}) {
  return html`
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="glass-panel rounded-[2rem] p-8">
            <span className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-accent">
              Welcome, ${user.name}
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold text-white md:text-5xl">
              Here is how accountability works.
            </h1>
            <div className="mt-6 grid gap-4">
              ${[
                ["Set a weekly target", "Start from 20 hours or tune it to your current season."],
                ["Log every day", "Each session captures what you learned, how long you studied, and what got in the way."],
                ["Stay visible", "Your group sees your progress ring, streaks, and recent sessions in real time."],
              ].map(
                ([title, detail]) => html`
                  <div key=${title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
                    <div className="font-semibold text-white">${title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/58">${detail}</div>
                  </div>
                `,
              )}
            </div>
          </section>

          <form className="glass-panel rounded-[2rem] p-8" onSubmit=${onComplete}>
            <div className="font-display text-2xl font-semibold text-white">Finish setup</div>
            <div className="mt-2 text-sm text-white/58">
              Your weekly goal is public inside the group feed and leaderboard.
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-white/62">Weekly learning goal</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value=${onboardingForm.weeklyGoal}
                  onInput=${(event) =>
                    setOnboardingForm((current) => ({
                      ...current,
                      weeklyGoal: Number(event.target.value),
                    }))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-white/62">Daily reminder time</span>
                <input
                  type="time"
                  value=${onboardingForm.reminderTime}
                  onInput=${(event) =>
                    setOnboardingForm((current) => ({ ...current, reminderTime: event.target.value }))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-white/62">Telegram handle (optional)</span>
                <input
                  type="text"
                  value=${onboardingForm.telegramHandle}
                  onInput=${(event) =>
                    setOnboardingForm((current) => ({ ...current, telegramHandle: event.target.value }))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
                  placeholder="@username"
                />
              </label>

              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white">Enable notifications</div>
                    <div className="mt-1 text-sm text-white/58">
                      ${notificationPermission === "granted"
                        ? "Browser notifications are enabled."
                        : "Permission helps with reminder nudges and streak warnings."}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick=${onEnableNotifications}
                    className=${buttonClass(notificationPermission === "granted" ? "ghost" : "primary")}
                  >
                    ${notificationPermission === "granted" ? "Enabled" : "Enable"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white">Add to home screen</div>
                    <div className="mt-1 text-sm text-white/58">
                      Install the PWA for a smoother mobile workflow and app-like launch.
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled=${!installPromptReady}
                    onClick=${onInstall}
                    className=${buttonClass(installPromptReady ? "primary" : "ghost")}
                  >
                    ${installPromptReady ? "Install app" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled=${busy} className=${cn("mt-6 w-full", buttonClass())}>
              ${busy ? "Saving..." : "Enter your workspace"}
            </button>
          </form>
        </div>
      </div>
    </main>
  `;
}

function AppShell({
  currentUser,
  route,
  onNavigate,
  onSignOut,
  online,
  pendingCount,
  children,
  announcement,
  announcementAuthor,
  busy,
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "community", label: "Feed" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "profile", label: "Profile", route: { view: "profile", id: currentUser.id } },
    ...(currentUser.isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];

  return html`
    <div className="min-h-screen px-4 pb-36 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-6 lg:px-10">
      <header className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-accent/18 to-accent2/18 font-display text-2xl font-bold text-white">
            LT
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-white">${APP_CONFIG.appName}</div>
            <div className="text-sm text-white/48">
              ${DEMO_MODE ? "Demo mode" : "Supabase live mode"} • ${online ? "Online" : "Offline"}
              ${pendingCount ? ` • ${pendingCount} queued` : ""}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          ${busy
            ? html`
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.26em] text-white/45">
                  Syncing
                </div>
              `
            : null}
          <${Avatar} profile=${currentUser} onClick=${() => onNavigate({ view: "profile", id: currentUser.id })} />
          <button type="button" onClick=${onSignOut} className=${buttonClass("ghost")}>
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-7xl">
        <${AnnouncementBar} announcement=${announcement} author=${announcementAuthor} />
      </div>

      <main className="mx-auto mt-6 max-w-7xl">
        ${children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-ink/90 px-2 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:bottom-4 md:left-1/2 md:w-[min(720px,calc(100vw-32px))] md:-translate-x-1/2 md:rounded-[2rem] md:border md:pb-3">
        <div className="mx-auto flex w-full max-w-3xl gap-1 sm:gap-2">
          ${navItems.map((item) => {
            const targetRoute = item.route || { view: item.id };
            const active =
              route.view === item.id ||
              (item.id === "profile" && route.view === "profile" && route.id === currentUser.id);
            return html`
              <button
                key=${item.id}
                type="button"
                onClick=${() => onNavigate(targetRoute)}
                className=${cn(
                  "flex-1 flex items-center justify-center min-h-12 rounded-[1rem] sm:rounded-2xl border border-white/8 px-1 sm:px-3 text-[11px] sm:text-sm font-semibold text-white/65 transition truncate",
                  active && "nav-pill-active text-white",
                )}
              >
                <span className="truncate">${item.label}</span>
              </button>
            `;
          })}
        </div>
      </nav>
    </div>
  `;
}

export function App() {
  const [snapshot, setSnapshot] = React.useState({
    profiles: [],
    sessions: [],
    reactions: [],
    announcements: [],
    userStreaks: [],
    currentUserId: null,
    currentUser: null,
  });
  const [booting, setBooting] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [authMode, setAuthMode] = React.useState("signin");
  const [signInForm, setSignInForm] = React.useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = React.useState(makeAuthForm());
  const [onboardingForm, setOnboardingForm] = React.useState({
    weeklyGoal: APP_CONFIG.defaultWeeklyGoal,
    reminderTime: "19:00",
    telegramHandle: "",
  });
  const [sessionDraft, setSessionDraft] = React.useState(makeSessionDraft());
  const [editingSession, setEditingSession] = React.useState(null);
  const [editDraft, setEditDraft] = React.useState(makeSessionDraft());
  const [deletingSession, setDeletingSession] = React.useState(null);
  const [route, setRoute] = React.useState(parseRoute());
  const [authBusy, setAuthBusy] = React.useState(false);
  const [modalBusy, setModalBusy] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const [installPromptEvent, setInstallPromptEvent] = React.useState(null);
  const [notificationPermission, setNotificationPermission] = React.useState(
    "Notification" in window ? Notification.permission : "denied",
  );
  const [online, setOnline] = React.useState(navigator.onLine);
  const [confettiActive, setConfettiActive] = React.useState(false);

  const profiles = snapshot.profiles;
  const sessions = snapshot.sessions;
  const reactions = snapshot.reactions;
  const userStreaks = snapshot.userStreaks || [];
  const currentUser = snapshot.currentUser;
  const profileLookup = Object.fromEntries(profiles.map((profile) => [profile.id, profile]));
  const currentMetrics = currentUser
    ? deriveUserMetrics(currentUser, sessions, profiles, userStreaks)
    : null;
  const ownerAnalytics = computeOwnerAnalytics(profiles, sessions);
  const latestAnnouncement = snapshot.announcements[0] || null;
  const queuedCount = sessions.filter((session) => session.syncStatus === "queued").length;

  const pushToast = React.useRef((title, message, type = "success") => {
    const id = uid();
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3800);
  });

  async function refresh(options = {}) {
    if (!options.quiet) {
      setRefreshing(true);
    }
    const nextSnapshot = await dataClient.loadSnapshot();
    setSnapshot(nextSnapshot);
    setBooting(false);
    setRefreshing(false);
  }

  React.useEffect(() => {
    let active = true;

    void (async () => {
      await dataClient.init();
      if (active) {
        await refresh();
      }
    })();

    const handleHashChange = () => setRoute(parseRoute());
    const handleOnline = async () => {
      setOnline(true);
      try {
        await dataClient.flushQueue();
        await refresh({ quiet: true });
        pushToast.current("Back online", "Queued sessions synced successfully.");
      } catch {
        pushToast.current("Still retrying", "Your queued sessions will sync when the connection stabilizes.", "error");
      }
    };
    const handleOffline = () => {
      setOnline(false);
      pushToast.current("Offline mode", "New sessions will queue and sync automatically.");
    };
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };

    const unsubscribeAuth = dataClient.onAuthStateChange(() => void refresh({ quiet: true }));
    const unsubscribeRealtime = dataClient.subscribeRealtime(() => void refresh({ quiet: true }));

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeRealtime();
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  React.useEffect(() => {
    if (!currentUser) {
      return;
    }

    setSessionDraft(makeSessionDraft(currentUser));
    setOnboardingForm({
      weeklyGoal: currentUser.weeklyGoal || APP_CONFIG.defaultWeeklyGoal,
      reminderTime: currentUser.reminderTime || "19:00",
      telegramHandle: currentUser.telegramHandle || "",
    });
  }, [currentUser?.id]);

  React.useEffect(() => {
    if (!currentUser || !currentMetrics) {
      return;
    }

    if (currentMetrics.weeklyHours < currentMetrics.weeklyGoal) {
      return;
    }

    const celebrationKey = `${currentUser.id}:${isoDay(startOfWeek(new Date()))}`;
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEYS.streakCelebrations) || "[]");
    if (seen.includes(celebrationKey)) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEYS.streakCelebrations,
      JSON.stringify([...seen, celebrationKey]),
    );
    setConfettiActive(true);
    pushToast.current("Goal reached", "You hit your weekly target. Keep the pace.");
    window.setTimeout(() => setConfettiActive(false), 2600);
  }, [currentUser?.id, currentMetrics?.weeklyHours, currentMetrics?.weeklyGoal]);

  function navigate(nextRoute) {
    React.startTransition(() => {
      window.location.hash = routeToHash(nextRoute);
      setRoute(nextRoute);
    });
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setAuthBusy(true);
    try {
      await dataClient.signIn(signInForm);
      await refresh({ quiet: true });
      pushToast.current("Welcome back", "Your learning workspace is ready.");
    } catch (error) {
      pushToast.current("Sign-in failed", error.message || "Something went wrong", "error");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setAuthBusy(true);
    try {
      await dataClient.signUp(signUpForm);
      setSignUpForm(makeAuthForm());
      await refresh({ quiet: true });
      pushToast.current("Account created", "Finish onboarding to personalize your weekly system.");
    } catch (error) {
      pushToast.current("Could not create account", error.message || "Something went wrong", "error");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleCompleteOnboarding(event) {
    event.preventDefault();
    if (!currentUser) return;
    setModalBusy(true);
    try {
      await dataClient.completeOnboarding(currentUser.id, {
        weeklyGoal: Number(onboardingForm.weeklyGoal) || APP_CONFIG.defaultWeeklyGoal,
        reminderTime: onboardingForm.reminderTime,
        telegramHandle: onboardingForm.telegramHandle,
        notificationsEnabled: notificationPermission === "granted",
      });
      await refresh({ quiet: true });
      pushToast.current("Workspace ready", "Your weekly goal and reminders were saved.");
    } catch (error) {
      pushToast.current("Could not finish setup", error.message || "Something went wrong", "error");
    } finally {
      setModalBusy(false);
    }
  }

  async function handleEnableNotifications() {
    try {
      const permission = await dataClient.requestNotificationPermission();
      setNotificationPermission(permission);
      if (currentUser) {
        await dataClient.saveProfile(currentUser.id, {
          notificationsEnabled: permission === "granted",
        });
        await refresh({ quiet: true });
      }
      pushToast.current(
        permission === "granted" ? "Notifications enabled" : "Permission not granted",
        permission === "granted"
          ? "Daily reminders can use browser permission now."
          : "You can enable notifications later in browser settings.",
        permission === "granted" ? "success" : "error",
      );
    } catch (error) {
      pushToast.current("Notifications unavailable", error.message || "Something went wrong", "error");
    }
  }

  async function handleInstallApp() {
    if (!installPromptEvent) {
      pushToast.current("Install unavailable", "Open this app in a supported browser to install it.", "error");
      return;
    }
    await installPromptEvent.prompt();
    setInstallPromptEvent(null);
  }

  async function handleSignOut() {
    try {
      await dataClient.signOut();
      setSnapshot({
        profiles: [],
        sessions: [],
        reactions: [],
        announcements: [],
        userStreaks: [],
        currentUserId: null,
        currentUser: null,
      });
      navigate({ view: "dashboard" });
    } catch (error) {
      pushToast.current("Could not sign out", error.message || "Something went wrong", "error");
    }
  }

  function validateSessionDraft(draft) {
    if (!draft.learned.trim()) {
      throw new Error("What you learned is required.");
    }
    if (Number(draft.hours) < 0.5) {
      throw new Error("Hours spent must be at least 0.5.");
    }
  }

  async function handleCreateSession(event) {
    event.preventDefault();
    if (!currentUser) return;
    try {
      validateSessionDraft(sessionDraft);
      setModalBusy(true);
      const result = await dataClient.createSession(currentUser.id, sessionDraft);
      setSessionDraft(makeSessionDraft(currentUser));
      await refresh({ quiet: true });
      pushToast.current(
        result.queued ? "Saved offline" : "Session logged successfully ✅",
        result.queued
          ? "Your session will sync automatically when the internet returns."
          : "Your progress is now visible to the group.",
      );
    } catch (error) {
      pushToast.current("Could not save session", error.message || "Something went wrong", "error");
    } finally {
      setModalBusy(false);
    }
  }

  function openEditSession(session) {
    setEditingSession(session);
    setEditDraft({
      learned: session.learned,
      hours: session.hours,
      challenges: session.challenges || "",
      sessionDay: session.sessionDay,
    });
  }

  async function handleSaveEdit(event) {
    event.preventDefault();
    if (!editingSession) return;
    try {
      validateSessionDraft(editDraft);
      setModalBusy(true);
      await dataClient.updateSession(editingSession, {
        learned: editDraft.learned.trim(),
        hours: Number(editDraft.hours),
        challenges: editDraft.challenges.trim(),
        sessionDay: editDraft.sessionDay,
      });
      setEditingSession(null);
      await refresh({ quiet: true });
      pushToast.current("Session updated", "Your changes are live.");
    } catch (error) {
      pushToast.current("Could not update session", error.message || "Something went wrong", "error");
    } finally {
      setModalBusy(false);
    }
  }

  async function handleDeleteSession() {
    if (!deletingSession) return;
    try {
      setModalBusy(true);
      await dataClient.deleteSession(deletingSession);
      setDeletingSession(null);
      await refresh({ quiet: true });
      pushToast.current("Session deleted", "The log entry has been removed.");
    } catch (error) {
      pushToast.current("Could not delete session", error.message || "Something went wrong", "error");
    } finally {
      setModalBusy(false);
    }
  }

  async function handleReactionToggle(sessionId, emoji) {
    if (!currentUser) return;
    try {
      await dataClient.toggleReaction(currentUser.id, sessionId, emoji);
      await refresh({ quiet: true });
    } catch (error) {
      pushToast.current("Reaction failed", error.message || "Something went wrong", "error");
    }
  }

  async function handleDeleteAsAdmin(sessionId) {
    if (!window.confirm("Delete this post from the shared feed?")) {
      return;
    }
    try {
      await dataClient.deleteSessionAsAdmin(sessionId);
      await refresh({ quiet: true });
      pushToast.current("Post removed", "The feed has been moderated.");
    } catch (error) {
      pushToast.current("Moderation failed", error.message || "Something went wrong", "error");
    }
  }

  async function handleRemoveUser(userId) {
    if (!window.confirm("Remove this user and their sessions?")) {
      return;
    }
    try {
      await dataClient.removeUserAsAdmin(userId);
      await refresh({ quiet: true });
      pushToast.current("User removed", "The member has been removed from the workspace.");
    } catch (error) {
      pushToast.current("Could not remove user", error.message || "Something went wrong", "error");
    }
  }

  async function handleSendAnnouncement(body) {
    if (!currentUser) return;
    try {
      await dataClient.sendAnnouncement(currentUser.id, body);
      await refresh({ quiet: true });
      pushToast.current("Announcement sent", "Everyone will see it at the top of the app.");
    } catch (error) {
      pushToast.current("Could not send announcement", error.message || "Something went wrong", "error");
    }
  }

  if (booting) {
    return html`
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <${SkeletonCard} className="h-80" />
            <${SkeletonCard} className="h-80" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <${SkeletonCard} className="h-56" />
            <${SkeletonCard} className="h-56" />
            <${SkeletonCard} className="h-56" />
          </div>
        </div>
      </div>
    `;
  }

  if (!currentUser) {
    return html`
      <${AuthScreen}
        authMode=${authMode}
        setAuthMode=${setAuthMode}
        signInForm=${signInForm}
        setSignInForm=${setSignInForm}
        signUpForm=${signUpForm}
        setSignUpForm=${setSignUpForm}
        onSignIn=${handleSignIn}
        onSignUp=${handleSignUp}
        authBusy=${authBusy}
      />
      <${ToastStack}
        toasts=${toasts}
        onDismiss=${(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    `;
  }

  if (!currentUser.onboardingCompletedAt) {
    return html`
      <${OnboardingScreen}
        user=${currentUser}
        onboardingForm=${onboardingForm}
        setOnboardingForm=${setOnboardingForm}
        onComplete=${handleCompleteOnboarding}
        onEnableNotifications=${handleEnableNotifications}
        notificationPermission=${notificationPermission}
        installPromptReady=${Boolean(installPromptEvent)}
        onInstall=${handleInstallApp}
        busy=${modalBusy}
      />
      <${ToastStack}
        toasts=${toasts}
        onDismiss=${(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    `;
  }

  const currentView =
    route.view === "community"
      ? CommunityView
      : route.view === "leaderboard"
        ? LeaderboardView
        : route.view === "profile"
          ? ProfileView
          : route.view === "admin"
            ? AdminView
            : DashboardView;

  const selectedProfile = route.view === "profile" ? profileLookup[route.id] : null;

  return html`
    <${ConfettiBurst} active=${confettiActive} />
    <${AppShell}
      currentUser=${currentUser}
      route=${route}
      onNavigate=${navigate}
      onSignOut=${handleSignOut}
      online=${online}
      pendingCount=${queuedCount}
      announcement=${latestAnnouncement}
      announcementAuthor=${latestAnnouncement ? profileLookup[latestAnnouncement.authorId] : null}
      busy=${refreshing}
    >
      <${React.Suspense}
        fallback=${html`
          <div className="grid gap-6 lg:grid-cols-2">
            <${SkeletonCard} className="h-64" />
            <${SkeletonCard} className="h-64" />
          </div>
        `}
      >
        <${currentView}
          route=${route}
          currentUser=${currentUser}
          currentMetrics=${currentMetrics}
          profiles=${profiles}
          sessions=${sessions}
          reactions=${reactions}
          userStreaks=${userStreaks}
          profileLookup=${profileLookup}
          ownerAnalytics=${ownerAnalytics}
          selectedProfile=${selectedProfile}
          sessionDraft=${sessionDraft}
          setSessionDraft=${setSessionDraft}
          onCreateSession=${handleCreateSession}
          onEditSession=${openEditSession}
          onDeleteSession=${(session) => setDeletingSession(session)}
          onProfileOpen=${(id) => navigate({ view: "profile", id })}
          onReactionToggle=${handleReactionToggle}
          onDeleteAsAdmin=${handleDeleteAsAdmin}
          onRemoveUser=${handleRemoveUser}
          onSendAnnouncement=${handleSendAnnouncement}
        />
      <//>
    </${AppShell}>

    <${Modal}
      open=${Boolean(editingSession)}
      title="Edit session"
      description="Adjust what you learned, the time spent, or the day it should count toward."
      onClose=${() => setEditingSession(null)}
      footer=${html`
        <button type="button" onClick=${() => setEditingSession(null)} className=${buttonClass("ghost")}>
          Cancel
        </button>
        <button type="submit" form="edit-session-form" className=${buttonClass()}>
          ${modalBusy ? "Saving..." : "Save changes"}
        </button>
      `}
    >
      <form id="edit-session-form" className="grid gap-4" onSubmit=${handleSaveEdit}>
        <label className="grid gap-2">
          <span className="text-sm text-white/62">What did you learn?</span>
          <textarea
            required
            rows="4"
            value=${editDraft.learned}
            onInput=${(event) => setEditDraft((current) => ({ ...current, learned: event.target.value }))}
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30"
          ></textarea>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/62">Hours spent</span>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value=${editDraft.hours}
            onInput=${(event) => setEditDraft((current) => ({ ...current, hours: Number(event.target.value) }))}
            className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/62">Count this toward</span>
          <select
            value=${editDraft.sessionDay}
            onChange=${(event) => setEditDraft((current) => ({ ...current, sessionDay: event.target.value }))}
            className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
          >
            <option value=${isoDay(new Date())}>Today</option>
            <option value=${isoDay(new Date(Date.now() - 86400000))}>Yesterday</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/62">Challenges faced</span>
          <textarea
            rows="3"
            value=${editDraft.challenges}
            onInput=${(event) => setEditDraft((current) => ({ ...current, challenges: event.target.value }))}
            className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30"
          ></textarea>
        </label>
      </form>
    </${Modal}>

    <${Modal}
      open=${Boolean(deletingSession)}
      title="Delete this session?"
      description="This removes the log entry from your history and the public feed."
      onClose=${() => setDeletingSession(null)}
      footer=${html`
        <button type="button" onClick=${() => setDeletingSession(null)} className=${buttonClass("ghost")}>
          Cancel
        </button>
        <button type="button" onClick=${handleDeleteSession} className=${buttonClass("danger")}>
          ${modalBusy ? "Deleting..." : "Delete session"}
        </button>
      `}
    >
      <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/65">
        ${deletingSession?.learned}
      </div>
    </${Modal}>

    <${ToastStack}
      toasts=${toasts}
      onDismiss=${(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
    />
  `;
}
