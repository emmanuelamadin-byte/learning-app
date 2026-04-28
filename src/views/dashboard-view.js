import React from "react";
import {
  BadgeGrid,
  EmptyState,
  MetricCard,
  ProgressRing,
  SessionHistory,
  StreakTracker,
  WeeklyBarChart,
} from "../components.js";
import { html } from "../lib/html.js";
import { formatHours, isoDay } from "../lib/utils.js";

export default function DashboardView({
  currentUser,
  currentMetrics,
  sessions,
  profileLookup,
  sessionDraft,
  setSessionDraft,
  onCreateSession,
  onEditSession,
  onDeleteSession,
}) {
  const [dateFilter, setDateFilter] = React.useState("");
  const [hoursFilter, setHoursFilter] = React.useState("");

  const mySessions = sessions.filter((session) => session.userId === currentUser.id);

  const filteredSessions = mySessions.filter((session) => {
    const matchesDate = !dateFilter || session.sessionDay === dateFilter;
    const matchesHours = !hoursFilter || Number(session.hours) >= Number(hoursFilter);
    return matchesDate && matchesHours;
  });

  return html`
    <div className="grid gap-6">
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-white">
        <div>User ID: ${currentUser.id}</div>
        <div>Total sessions loaded: ${sessions.length}</div>
        <div>My sessions loaded: ${mySessions.length}</div>
        <div>Weekly hours: ${currentMetrics.weeklyHours}</div>
        <div>Total hours: ${currentMetrics.totalHours}</div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="hero-orb hero-orb--green -left-6 top-6"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-white/45">Personal dashboard</div>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-bold text-white md:text-5xl">
              Stay visible. Stay consistent. Stack proof every day.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">
              Weekly target: ${currentMetrics.weeklyGoal}h. Sessions only count toward streaks
              after 30 minutes, and you can still backfill yesterday before today ends.
            </p>

            <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row lg:items-center">
              <${ProgressRing}
                value=${currentMetrics.weeklyHours}
                goal=${currentMetrics.weeklyGoal}
                label="Weekly progress"
              />
              <div className="grid gap-3">
                ${currentMetrics.insights.map(
                  (insight) => html`
                    <div
                      key=${insight}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
                    >
                      ${insight}
                    </div>
                  `,
                )}
              </div>
            </div>
          </div>
        </div>

        <form className="glass-panel rounded-[2rem] p-6 sm:p-8" onSubmit=${onCreateSession} noValidate>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/45">Daily logging</div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">Log today’s work</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/45">
              Auto timestamp
            </span>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-white/62">What did you learn?</span>
              <textarea
                required
                rows="4"
                value=${sessionDraft.learned}
                onInput=${(event) =>
                  setSessionDraft((current) => ({ ...current, learned: event.target.value }))}
                className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30"
                placeholder="Summarize the topic, drill, lecture, or practice block."
              ></textarea>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm text-white/62">Hours spent</span>
                <input
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  value=${sessionDraft.hours}
                  onInput=${(event) =>
                    setSessionDraft((current) => ({
                      ...current,
                      hours: Number(event.target.value),
                    }))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-white/62">Count this toward</span>
                <select
                  value=${sessionDraft.sessionDay}
                  onChange=${(event) =>
                    setSessionDraft((current) => ({ ...current, sessionDay: event.target.value }))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                >
                  <option value=${isoDay(new Date())}>Today</option>
                  <option value=${isoDay(new Date(Date.now() - 86400000))}>Yesterday</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-white/62">Challenges faced (optional)</span>
              <textarea
                rows="3"
                value=${sessionDraft.challenges}
                onInput=${(event) =>
                  setSessionDraft((current) => ({ ...current, challenges: event.target.value }))}
                className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30"
                placeholder="What slowed you down, confused you, or needs another pass?"
              ></textarea>
            </label>

            <button type="submit" className="brand-gradient-bg min-h-12 rounded-2xl px-4 text-sm font-semibold">
              Log session
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <${MetricCard}
          eyebrow="All-time hours"
          value=${formatHours(currentMetrics.totalHours)}
          detail="Every recorded study session combined."
        />
        <${MetricCard}
          eyebrow="Days active"
          value=${String(currentMetrics.activeDays)}
          detail="Unique calendar days with at least one session."
        />
        <${MetricCard}
          eyebrow="Current streak"
          value=${`${currentMetrics.currentStreak} days`}
          detail=${currentMetrics.streakAtRisk ? "No qualifying session logged yet today." : "Streak is healthy right now."}
        />
        <${MetricCard}
          eyebrow="Longest streak"
          value=${`${currentMetrics.longestStreak} days`}
          detail=${`${currentMetrics.level} level • best day ${currentMetrics.bestDay ? formatHours(currentMetrics.bestDay.hours) : "n/a"}`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <${WeeklyBarChart} bars=${currentMetrics.weeklyBars} />
        <${StreakTracker} tracker=${currentMetrics.sevenDayTracker} />
      </section>

      <section>
        <${BadgeGrid} badges=${currentMetrics.badges} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="glass-panel rounded-[2rem] p-5">
          <div className="text-sm font-semibold text-white">Filter session history</div>
          <div className="mt-1 text-sm text-white/50">Narrow your log by day or by minimum hours.</div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-white/62">Date</span>
              <input
                type="date"
                value=${dateFilter}
                onInput=${(event) => setDateFilter(event.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-white/62">Minimum hours</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value=${hoursFilter}
                onInput=${(event) => setHoursFilter(event.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                placeholder="0.5"
              />
            </label>
            <button
              type="button"
              onClick=${() => {
                setDateFilter("");
                setHoursFilter("");
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/70"
            >
              Reset filters
            </button>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/45">Full history</div>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white">Your sessions</h2>
            </div>
          </div>
          <${SessionHistory}
            sessions=${filteredSessions}
            profileLookup=${profileLookup}
            editable=${true}
            onEdit=${onEditSession}
            onDelete=${onDeleteSession}
            emptyState=${html`
              <${EmptyState}
                title="No sessions match these filters"
                detail="Try widening the date range or lowering the minimum hours threshold."
              />
            `}
          />
        </div>
      </section>
    </div>
  `;
}
