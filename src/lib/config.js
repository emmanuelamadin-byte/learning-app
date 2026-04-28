const defaults = {
  appName: "Learn Tracker",
  supabaseUrl: "",
  supabaseAnonKey: "",
  adminEmails: ["owner@example.com"],
  defaultWeeklyGoal: 20,
  demoMode: false,
};

export const APP_CONFIG = Object.freeze({
  ...defaults,
  ...(window.APP_CONFIG || {}),
});

export const SUPABASE_ENABLED = Boolean(
  APP_CONFIG.supabaseUrl && APP_CONFIG.supabaseAnonKey,
);

export const DEMO_MODE = Boolean(APP_CONFIG.demoMode) || !SUPABASE_ENABLED;

export const STORAGE_KEYS = Object.freeze({
  demoState: "learn-tracker.demo-state.v1",
  demoCurrentUser: "learn-tracker.demo-current-user.v1",
  cache: "learn-tracker.cache.v1",
  queue: "learn-tracker.pending-sessions.v1",
  notificationSettings: "learn-tracker.notification-settings.v1",
  installDismissed: "learn-tracker.install-dismissed.v1",
  streakCelebrations: "learn-tracker.goal-celebrations.v1",
});
