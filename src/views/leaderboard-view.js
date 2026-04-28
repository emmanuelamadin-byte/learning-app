import React from "react";
import { EmptyState, LeaderboardPodium } from "../components.js";
import { html } from "../lib/html.js";
import { buildLeaderboard } from "../lib/metrics.js";
import { formatHours } from "../lib/utils.js";

export default function LeaderboardView({ profiles, sessions, onProfileOpen, userStreaks = [] }) {
  const [scope, setScope] = React.useState("weekly");
  const [metric, setMetric] = React.useState("hours");
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search.trim().toLowerCase());

  const leaderboardMode =
    metric === "hours" ? (scope === "weekly" ? "weekly" : "total") : metric;

  const rows = buildLeaderboard(profiles, sessions, leaderboardMode, userStreaks).filter((row) =>
    row.name.toLowerCase().includes(deferredSearch),
  );

  const rankedRows = rows.map((row, index) => ({
    ...row,
    rank: index + 1,
    displayValue:
      metric === "streak"
        ? `${row.value} days`
        : metric === "total" || scope === "all-time"
          ? formatHours(row.metrics.totalHours)
          : formatHours(row.metrics.weeklyHours),
    detail:
      metric === "streak"
        ? `Total logged: ${formatHours(row.metrics.totalHours)}`
        : `Current streak: ${row.metrics.currentStreak} days`,
  }));

  const leaders = rankedRows.slice(0, 3);

  return html`
    <div className="grid gap-4 sm:gap-6">
      <section className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.28em] text-white/45">
              Leaderboard
            </div>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-tight text-white">
              Consistency becomes visible here.
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-6 sm:leading-7 text-white/60">
              Weekly standings refresh on Sunday. Switch between weekly hours, current streaks,
              and all-time momentum to see who is sustaining the pace.
            </p>
          </div>

          <label className="grid gap-2 lg:w-72">
            <span className="text-sm text-white/55">Search members</span>
            <input
              type="search"
              value=${search}
              onInput=${(event) => setSearch(event.target.value)}
              placeholder="Search the leaderboard"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="flex flex-wrap gap-2">
            ${[
              ["weekly", "Weekly"],
              ["all-time", "All-time"],
            ].map(
              ([value, label]) => html`
                <button
                  key=${value}
                  type="button"
                  onClick=${() => setScope(value)}
                  className=${scope === value
                    ? "min-h-11 rounded-2xl border border-accent/30 bg-accent/12 px-4 text-sm font-semibold text-white"
                    : "min-h-11 rounded-2xl border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold text-white/65"}
                >
                  ${label}
                </button>
              `,
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            ${[
              ["hours", "Hours"],
              ["streak", "Streak"],
              ["total", "Total hours"],
            ].map(
              ([value, label]) => html`
                <button
                  key=${value}
                  type="button"
                  onClick=${() => setMetric(value)}
                  className=${metric === value
                    ? "min-h-11 rounded-2xl border border-accent2/30 bg-accent2/12 px-4 text-sm font-semibold text-white"
                    : "min-h-11 rounded-2xl border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold text-white/65"}
                >
                  ${label}
                </button>
              `,
            )}
          </div>
        </div>
      </section>

      ${rankedRows.length
        ? html`
            <${LeaderboardPodium} leaders=${leaders} onProfileOpen=${onProfileOpen} />

            <section className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
              <div className="hidden md:grid grid-cols-[72px_minmax(0,1fr)_120px_120px] gap-4 border-b border-white/8 px-5 py-4 text-xs uppercase tracking-[0.24em] text-white/45">
                <div>Rank</div>
                <div>Learner</div>
                <div>Value</div>
                <div>Streak</div>
              </div>

              <div className="grid">
                ${rankedRows.map(
                  (row) => html`
                    <button
                      key=${row.id}
                      type="button"
                      onClick=${() => onProfileOpen(row.id)}
                      className="border-b border-white/6 text-left transition hover:bg-white/[0.03]"
                    >
                      <div className="grid gap-3 px-4 py-4 md:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-display text-3xl font-bold text-white">#${row.rank}</div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">${row.displayValue}</div>
                            <div className="mt-1 text-sm text-white/60">${row.metrics.currentStreak}d streak</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xl font-semibold text-white break-words">${row.name}</div>
                          <div className="mt-1 text-sm text-white/50">${row.metrics.level}</div>
                        </div>
                      </div>

                      <div className="hidden md:grid grid-cols-[72px_minmax(0,1fr)_120px_120px] gap-4 px-5 py-4">
                        <div className="font-display text-2xl font-bold text-white">#${row.rank}</div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">${row.name}</div>
                          <div className="mt-1 text-sm text-white/50">${row.metrics.level}</div>
                        </div>
                        <div className="font-semibold text-white">${row.displayValue}</div>
                        <div className="text-white/60">${row.metrics.currentStreak}d</div>
                      </div>
                    </button>
                  `,
                )}
              </div>
            </section>
          `
        : html`
            <${EmptyState}
              title="No members match that search"
              detail="Try a broader search term or switch the leaderboard scope."
            />
          `}
    </div>
  `;
}
