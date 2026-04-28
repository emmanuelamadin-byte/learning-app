import React from "react";
import {
  Avatar,
  BadgeGrid,
  EmptyState,
  ProgressRing,
  SessionHistory,
  StreakTracker,
} from "../components.js";
import { html } from "../lib/html.js";
import { deriveUserMetrics } from "../lib/metrics.js";
import { formatHours } from "../lib/utils.js";

export default function ProfileView({
  currentUser,
  selectedProfile,
  profiles,
  sessions,
  profileLookup,
  onEditSession,
  onDeleteSession,
  userStreaks = [],
}) {
  if (!selectedProfile) {
    return html`
      <${EmptyState}
        title="Profile not found"
        detail="The member you are looking for is missing from the current workspace."
      />
    `;
  }

  const profileMetrics = deriveUserMetrics(selectedProfile, sessions, profiles, userStreaks);
  const recentSessions = sessions
    .filter((session) => session.userId === selectedProfile.id)
    .slice(0, 8);

  const isSelf = currentUser.id === selectedProfile.id;

  return html`
    <div className="grid gap-4 sm:gap-6">
      <section className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <${Avatar} profile=${selectedProfile} size="lg" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.28em] text-white/45">
                  ${isSelf ? "Your profile" : "Public profile"}
                </div>
                <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white break-words">
                  ${selectedProfile.name}
                </h1>
                <div className="mt-2 text-sm sm:text-base leading-6 text-white/58">
                  ${profileMetrics.level} • ${formatHours(profileMetrics.totalHours)} total •
                  ${profileMetrics.currentStreak} day current streak
                </div>
              </div>
            </div>

            <div className="self-center lg:self-auto">
              <${ProgressRing}
                value=${profileMetrics.weeklyHours}
                goal=${profileMetrics.weeklyGoal}
                label="Weekly progress"
                compact=${true}
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            ${[
              ["Weekly hours", formatHours(profileMetrics.weeklyHours)],
              ["Current streak", `${profileMetrics.currentStreak} days`],
              ["Longest streak", `${profileMetrics.longestStreak} days`],
              ["Days active", `${profileMetrics.activeDays}`],
            ].map(
              ([label, value]) => html`
                <div key=${label} className="rounded-[1.5rem] sm:rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-white/45">
                    ${label}
                  </div>
                  <div className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white break-words">
                    ${value}
                  </div>
                </div>
              `,
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <${StreakTracker} tracker=${profileMetrics.sevenDayTracker} />
        <${BadgeGrid} badges=${profileMetrics.badges} />
      </section>

      <section>
        <div className="mb-4">
          <div className="text-xs uppercase tracking-[0.28em] text-white/45">Recent sessions</div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-white">
            ${isSelf ? "Your latest work" : `${selectedProfile.name.split(" ")[0]}'s latest work`}
          </h2>
        </div>

        <${SessionHistory}
          sessions=${recentSessions}
          profileLookup=${profileLookup}
          editable=${isSelf}
          onEdit=${onEditSession}
          onDelete=${onDeleteSession}
          emptyState=${html`
            <${EmptyState}
              title="No sessions logged yet"
              detail="Once this learner starts logging, their recent work will show up here."
            />
          `}
        />
      </section>
    </div>
  `;
}
