import {
  addDays,
  formatShortDate,
  groupBy,
  isoDay,
  parseDateValue,
  roundHours,
  startOfDay,
  sum,
} from "./utils.js";

export function startOfWeek(value = new Date()) {
  const date = startOfDay(value);
  date.setDate(date.getDate() - date.getDay());
  return date;
}

export function endOfWeek(value = new Date()) {
  return addDays(startOfWeek(value), 6);
}

export function withinRange(day, start, end) {
  const value = startOfDay(parseDateValue(day));
  return value >= startOfDay(start) && value <= startOfDay(end);
}

export function dayTotals(sessions) {
  const grouped = groupBy(sessions, (session) => session.sessionDay || isoDay(session.loggedAt));
  return Object.fromEntries(
    Object.entries(grouped).map(([day, daySessions]) => [
      day,
      roundHours(sum(daySessions.map((session) => Number(session.hours) || 0))),
    ]),
  );
}

export function calculateStreaks(sessions) {
  const totals = dayTotals(sessions);
  const qualifyingDays = Object.entries(totals)
    .filter(([, hours]) => hours >= 0.5)
    .map(([day]) => day)
    .sort();

  let longestStreak = 0;
  let runningLongest = 0;
  let previousDay = null;

  qualifyingDays.forEach((day) => {
    if (!previousDay) {
      runningLongest = 1;
    } else {
      const prev = parseDateValue(previousDay);
      const next = addDays(prev, 1);
      runningLongest = isoDay(next) === day ? runningLongest + 1 : 1;
    }
    previousDay = day;
    longestStreak = Math.max(longestStreak, runningLongest);
  });

  const today = isoDay(new Date());
  const yesterday = isoDay(addDays(new Date(), -1));
  const anchor = totals[today] >= 0.5 ? today : totals[yesterday] >= 0.5 ? yesterday : null;

  let currentStreak = 0;
  let cursor = anchor ? parseDateValue(anchor) : null;
  while (cursor && totals[isoDay(cursor)] >= 0.5) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  const sevenDayTracker = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(new Date(), index - 6);
    const day = isoDay(date);
    return {
      day,
      label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date).slice(0, 1),
      hit: (totals[day] || 0) >= 0.5,
      hours: totals[day] || 0,
    };
  });

  const streakAtRisk = (totals[today] || 0) < 0.5;

  return { currentStreak, longestStreak, sevenDayTracker, streakAtRisk };
}

function resolveStreakMetrics(profileId, sessions, userStreaks = []) {
  const fallback = calculateStreaks(sessions);
  const matched = userStreaks.find((row) => row.userId === profileId);

  if (!matched) {
    return fallback;
  }

  return {
    ...fallback,
    currentStreak: Number(matched.currentStreak ?? fallback.currentStreak ?? 0),
    longestStreak: Number(matched.longestStreak ?? fallback.longestStreak ?? 0),
    lastActive: matched.lastActive || null,
    streakUpdatedAt: matched.updatedAt || null,
  };
}

export function buildWeeklyBars(sessions, reference = new Date()) {
  const weekStart = startOfWeek(reference);
  const totals = dayTotals(sessions);

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(weekStart, index);
    const key = isoDay(day);
    return {
      day: key,
      label: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(day).slice(0, 3),
      value: totals[key] || 0,
      isToday: key === isoDay(new Date()),
    };
  });
}

export function sumWeeklyHours(sessions, reference = new Date()) {
  const start = startOfWeek(reference);
  const end = endOfWeek(reference);
  return roundHours(
    sum(
      sessions
        .filter((session) => withinRange(session.sessionDay || session.loggedAt, start, end))
        .map((session) => Number(session.hours) || 0),
    ),
  );
}

export function sumLastWeekHours(sessions, reference = new Date()) {
  const currentWeekStart = startOfWeek(reference);
  const previousWeekEnd = addDays(currentWeekStart, -1);
  const previousWeekStart = addDays(currentWeekStart, -7);

  return roundHours(
    sum(
      sessions
        .filter((session) =>
          withinRange(session.sessionDay || session.loggedAt, previousWeekStart, previousWeekEnd),
        )
        .map((session) => Number(session.hours) || 0),
    ),
  );
}

export function resolveLevel(totalHours) {
  if (totalHours >= 200) {
    return "Advanced";
  }
  if (totalHours >= 50) {
    return "Intermediate";
  }
  return "Beginner";
}

export function deriveBadges(profile, profileSessions, allProfiles, allSessions, metrics) {
  const weeklyHours = sumWeeklyHours(profileSessions);
  const currentStreak = metrics?.currentStreak ?? calculateStreaks(profileSessions).currentStreak;
  const totalHours =
    metrics?.totalHours ?? roundHours(sum(profileSessions.map((session) => Number(session.hours) || 0)));

  const weeklyChampionId = allProfiles
    .map((candidate) => ({
      id: candidate.id,
      weeklyHours: sumWeeklyHours(allSessions.filter((session) => session.userId === candidate.id)),
    }))
    .sort((a, b) => b.weeklyHours - a.weeklyHours)[0]?.id;

  const isWeeklyChampion = weeklyChampionId === profile.id && weeklyHours > 0;

  return [
    {
      id: "first-session",
      label: "First Session Logged",
      emoji: "🟢",
      earned: profileSessions.length > 0,
    },
    {
      id: "seven-day-streak",
      label: "7-Day Streak",
      emoji: "🔥",
      earned: currentStreak >= 7,
    },
    {
      id: "hundred-hours",
      label: "100 Hours Completed",
      emoji: "💯",
      earned: totalHours >= 100,
    },
    {
      id: "weekly-champion",
      label: "Weekly Champion",
      emoji: "🏆",
      earned: isWeeklyChampion,
    },
    {
      id: "goal-crusher",
      label: "Weekly Goal Reached",
      emoji: "✨",
      earned: weeklyHours >= (profile.weeklyGoal || 20),
    },
  ];
}

export function deriveUserMetrics(profile, allSessions, allProfiles, userStreaks = []) {
  const sessions = allSessions.filter((session) => session.userId === profile.id);
  const totalHours = roundHours(sum(sessions.map((session) => Number(session.hours) || 0)));
  const weeklyHours = sumWeeklyHours(sessions);
  const lastWeekHours = sumLastWeekHours(sessions);
  const activeDays = Object.keys(dayTotals(sessions)).length;
  const streaks = resolveStreakMetrics(profile.id, sessions, userStreaks);
  const weeklyGoal = Number(profile.weeklyGoal) || 20;
  const remainingHours = Math.max(weeklyGoal - weeklyHours, 0);
  const progressPercent = weeklyGoal > 0 ? Math.min((weeklyHours / weeklyGoal) * 100, 100) : 0;
  const bestDayEntry = Object.entries(dayTotals(sessions)).sort((a, b) => b[1] - a[1])[0];
  const comparison = weeklyHours - lastWeekHours;

  const badges = deriveBadges(profile, sessions, allProfiles, allSessions, {
    currentStreak: streaks.currentStreak,
    totalHours,
  });

  const insights = [];
  if (weeklyHours >= weeklyGoal) {
    insights.push("You are ahead of your goal 🔥");
  } else {
    insights.push(`You need ${remainingHours.toFixed(1)} more hours to hit your target.`);
  }

  if (comparison > 0) {
    insights.push(`You are up ${comparison.toFixed(1)}h versus last week.`);
  } else if (comparison < 0) {
    insights.push(`You are down ${Math.abs(comparison).toFixed(1)}h versus last week.`);
  } else {
    insights.push("You are matching last week’s pace exactly.");
  }

  if (bestDayEntry) {
    insights.push(`Best day: ${formatShortDate(bestDayEntry[0])} at ${bestDayEntry[1].toFixed(1)}h.`);
  }

  return {
    totalHours,
    weeklyHours,
    lastWeekHours,
    weeklyGoal,
    remainingHours,
    progressPercent,
    progressRatio: weeklyGoal > 0 ? weeklyHours / weeklyGoal : 0,
    goalReached: weeklyHours >= weeklyGoal,
    activeDays,
    level: resolveLevel(totalHours),
    bestDay: bestDayEntry
      ? { day: bestDayEntry[0], hours: bestDayEntry[1] }
      : null,
    weeklyBars: buildWeeklyBars(sessions),
    badges,
    insights,
    ...streaks,
  };
}

export function buildLeaderboard(profiles, sessions, mode = "weekly", userStreaks = []) {
  return profiles
    .map((profile) => {
      const metrics = deriveUserMetrics(profile, sessions, profiles, userStreaks);
      const value =
        mode === "streak"
          ? metrics.currentStreak
          : mode === "total"
            ? metrics.totalHours
            : metrics.weeklyHours;

      return {
        id: profile.id,
        name: profile.name,
        photoUrl: profile.photoUrl,
        weeklyGoal: profile.weeklyGoal,
        value,
        metrics,
      };
    })
    .sort((a, b) => b.value - a.value || b.metrics.totalHours - a.metrics.totalHours);
}

export function computeOwnerAnalytics(profiles, sessions) {
  const today = isoDay(new Date());
  const activeToday = new Set(
    sessions
      .filter((session) => (session.sessionDay || isoDay(session.loggedAt)) === today)
      .map((session) => session.userId),
  ).size;

  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());

  const weeklyActiveUsers = new Set(
    sessions
      .filter((session) =>
        withinRange(session.sessionDay || session.loggedAt, currentWeekStart, currentWeekEnd),
      )
      .map((session) => session.userId),
  ).size;

  const weeklyRetention = profiles.length
    ? Math.round((weeklyActiveUsers / profiles.length) * 100)
    : 0;

  const averageHours = profiles.length
    ? roundHours(sum(sessions.map((session) => Number(session.hours) || 0)) / profiles.length)
    : 0;

  return {
    dailyActiveUsers: activeToday,
    weeklyRetention,
    averageHours,
  };
}
