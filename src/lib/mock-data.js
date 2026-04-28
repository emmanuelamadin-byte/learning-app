import { addDays, isoDay, uid } from "./utils.js";

function isoAtDayOffset(dayOffset, hour, minute = 0) {
  const date = addDays(new Date(), dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function buildSession(userId, dayOffset, hour, hours, learned, challenges = "") {
  const loggedAt = isoAtDayOffset(dayOffset, hour);
  return {
    id: uid(),
    clientId: uid(),
    userId,
    learned,
    hours,
    challenges,
    loggedAt,
    sessionDay: isoDay(loggedAt),
    createdAt: loggedAt,
    updatedAt: loggedAt,
  };
}

export function createSeedData() {
  const profiles = [
    {
      id: "demo-ada",
      name: "Ada Nwosu",
      email: "owner@example.com",
      password: "demo1234",
      photoUrl: "",
      weeklyGoal: 24,
      createdAt: addDays(new Date(), -45).toISOString(),
      onboardingCompletedAt: addDays(new Date(), -45).toISOString(),
      notificationsEnabled: true,
      reminderTime: "19:00",
      telegramHandle: "@adanwosu",
      isAdmin: true,
    },
    {
      id: "demo-priya",
      name: "Priya Raman",
      email: "priya@example.com",
      password: "demo1234",
      photoUrl: "",
      weeklyGoal: 18,
      createdAt: addDays(new Date(), -30).toISOString(),
      onboardingCompletedAt: addDays(new Date(), -30).toISOString(),
      notificationsEnabled: true,
      reminderTime: "20:30",
      telegramHandle: "",
      isAdmin: false,
    },
    {
      id: "demo-jonah",
      name: "Jonah Reeves",
      email: "jonah@example.com",
      password: "demo1234",
      photoUrl: "",
      weeklyGoal: 20,
      createdAt: addDays(new Date(), -25).toISOString(),
      onboardingCompletedAt: addDays(new Date(), -25).toISOString(),
      notificationsEnabled: false,
      reminderTime: "18:00",
      telegramHandle: "",
      isAdmin: false,
    },
    {
      id: "demo-tobi",
      name: "Tobi Akin",
      email: "tobi@example.com",
      password: "demo1234",
      photoUrl: "",
      weeklyGoal: 16,
      createdAt: addDays(new Date(), -18).toISOString(),
      onboardingCompletedAt: addDays(new Date(), -18).toISOString(),
      notificationsEnabled: true,
      reminderTime: "21:00",
      telegramHandle: "@tobiwritescode",
      isAdmin: false,
    },
    {
      id: "demo-elena",
      name: "Elena Torres",
      email: "elena@example.com",
      password: "demo1234",
      photoUrl: "",
      weeklyGoal: 22,
      createdAt: addDays(new Date(), -12).toISOString(),
      onboardingCompletedAt: addDays(new Date(), -12).toISOString(),
      notificationsEnabled: false,
      reminderTime: "17:30",
      telegramHandle: "",
      isAdmin: false,
    },
  ];

  const sessions = [
    buildSession("demo-ada", -8, 21, 2.5, "Refactored a Postgres query planner module", "Index selection was slower than expected."),
    buildSession("demo-ada", -6, 20, 3.0, "Studied distributed systems failure modes", "Had to re-read consensus edge cases."),
    buildSession("demo-ada", -4, 19, 2.0, "Reviewed TypeScript compiler internals"),
    buildSession("demo-ada", -3, 20, 3.5, "Built Supabase RLS policies for a side project"),
    buildSession("demo-ada", -2, 19, 2.0, "Practiced architecture interview scenarios"),
    buildSession("demo-ada", -1, 20, 2.5, "Deep-dived on React rendering patterns"),
    buildSession("demo-priya", -6, 18, 1.5, "Revised linear algebra proofs"),
    buildSession("demo-priya", -5, 18, 2.0, "Worked through probability problem sets"),
    buildSession("demo-priya", -3, 18, 1.0, "Studied neural network optimization"),
    buildSession("demo-priya", -1, 18, 2.5, "Implemented a mini transformer from scratch"),
    buildSession("demo-jonah", -7, 22, 1.0, "Practiced speaking drills for Spanish"),
    buildSession("demo-jonah", -4, 22, 1.0, "Read Spanish news articles aloud"),
    buildSession("demo-jonah", -2, 22, 2.0, "Reviewed irregular past tense verbs"),
    buildSession("demo-tobi", -5, 17, 2.5, "Learned about product-led onboarding loops"),
    buildSession("demo-tobi", -4, 17, 2.0, "Analyzed user retention case studies"),
    buildSession("demo-tobi", -3, 17, 1.0, "Sketched growth experiments for a SaaS app"),
    buildSession("demo-tobi", -2, 17, 2.5, "Studied storytelling frameworks for product launches"),
    buildSession("demo-elena", -6, 16, 3.0, "Prepared for a data structures assessment"),
    buildSession("demo-elena", -2, 16, 2.0, "Solved binary tree and graph traversal problems"),
    buildSession("demo-elena", -1, 16, 1.5, "Learned dynamic programming patterns"),
  ];

  const reactions = [
    { id: uid(), sessionId: sessions[5].id, userId: "demo-priya", emoji: "🔥" },
    { id: uid(), sessionId: sessions[15].id, userId: "demo-ada", emoji: "👏" },
    { id: uid(), sessionId: sessions[9].id, userId: "demo-elena", emoji: "💡" },
  ];

  const announcements = [
    {
      id: uid(),
      body: "Weekly focus sprint: post your biggest learning win before Sunday evening.",
      createdAt: addDays(new Date(), -1).toISOString(),
      authorId: "demo-ada",
      active: true,
    },
  ];

  return {
    profiles,
    sessions,
    reactions,
    announcements,
    currentUserId: "demo-ada",
  };
}
