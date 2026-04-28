import React from "react";
import { html } from "./lib/html.js";
import {
  cn,
  formatDateTime,
  formatHours,
  formatLongDate,
  formatRelativeTime,
  getInitials,
  makeAvatarHue,
} from "./lib/utils.js";

export function Avatar({ profile, size = "md", onClick }) {
  const dimensions =
    size === "lg"
      ? "h-14 w-14 text-lg"
      : size === "sm"
        ? "h-10 w-10 text-sm"
        : "h-12 w-12 text-base";
  const hue = makeAvatarHue(profile?.name || profile?.email || "LT");

  if (profile?.photoUrl) {
    return html`
      <button
        type="button"
        onClick=${onClick}
        className=${cn(
          "overflow-hidden rounded-2xl border border-white/10 bg-white/5",
          dimensions,
          onClick && "cursor-pointer",
        )}
      >
        <img
          src=${profile.photoUrl}
          alt=${profile.name}
          className="h-full w-full object-cover"
        />
      </button>
    `;
  }

  return html`
    <button
      type="button"
      onClick=${onClick}
      className=${cn(
        "rounded-2xl border border-white/10 font-semibold text-white",
        dimensions,
        onClick && "cursor-pointer",
      )}
      style=${{
        background: `linear-gradient(135deg, hsla(${hue}, 80%, 58%, 0.25), hsla(${(hue + 46) % 360}, 78%, 54%, 0.18))`,
      }}
    >
      ${getInitials(profile?.name)}
    </button>
  `;
}

export function ProgressRing({
  value,
  goal,
  label = "This week",
  sublabel = "hours logged",
  compact = false,
}) {
  const progress = Math.min(value / Math.max(goal, 0.1), 1);
  const radius = compact ? 44 : 64;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const size = compact ? 120 : 164;

  return html`
    <div className=${cn("relative grid place-items-center", compact ? "h-28 w-28" : "h-44 w-44")}>
      <svg
        viewBox=${`0 0 ${size} ${size}`}
        className="metric-ring h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="metricRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ce99a" />
            <stop offset="100%" stopColor="#6ad8ff" />
          </linearGradient>
        </defs>
        <circle
          className="metric-ring__trail"
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          fill="none"
          strokeWidth=${compact ? 10 : 12}
        />
        <circle
          className="metric-ring__value"
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          fill="none"
          strokeWidth=${compact ? 10 : 12}
          strokeDasharray=${circumference}
          strokeDashoffset=${dashOffset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className=${cn("font-display font-bold text-white", compact ? "text-2xl" : "text-4xl")}>
            ${formatHours(value)}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">${label}</div>
          <div className="mt-1 text-xs text-white/60">${goal}h goal • ${sublabel}</div>
        </div>
      </div>
    </div>
  `;
}

export function MetricCard({ eyebrow, value, detail }) {
  return html`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-white/45">${eyebrow}</div>
      <div className="brand-gradient-text mt-3 font-display text-3xl font-bold">
        ${value}
      </div>
      <div className="mt-2 text-sm text-white/65">${detail}</div>
    </div>
  `;
}

export function WeeklyBarChart({ bars }) {
  const max = Math.max(1, ...bars.map((bar) => bar.value));
  return html`
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Weekly bar chart</div>
          <div className="text-sm text-white/50">Daily hours across the current Sunday-Saturday cycle.</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-3">
        ${bars.map(
          (bar) => html`
            <div key=${bar.day} className="flex flex-col items-center gap-3">
              <div className="flex h-40 w-full items-end justify-center rounded-2xl border border-white/6 bg-white/[0.03] p-2">
                <div
                  className=${cn(
                    "brand-bar w-full rounded-2xl transition-all duration-500",
                    bar.isToday && "shadow-[0_0_30px_rgba(140,233,154,0.25)]",
                  )}
                  style=${{
                    height: `${Math.max(10, (bar.value / max) * 100)}%`,
                    opacity: bar.value > 0 ? 1 : 0.22,
                  }}
                  title=${`${bar.label}: ${formatHours(bar.value)}`}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">${bar.label}</div>
                <div className="mt-1 text-sm text-white/75">${bar.value ? formatHours(bar.value) : "0h"}</div>
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export function StreakTracker({ tracker }) {
  return html`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-sm font-semibold text-white">7-day streak tracker</div>
      <div className="mt-1 text-sm text-white/50">A day counts after at least 30 minutes of learning.</div>
      <div className="mt-5 grid grid-cols-7 gap-2">
        ${tracker.map(
          (entry) => html`
            <div
              key=${entry.day}
              className=${cn(
                "rounded-2xl border px-2 py-4 text-center",
                entry.hit
                  ? "border-accent/35 bg-accent/12 text-white"
                  : "border-white/8 bg-white/[0.03] text-white/45",
              )}
              title=${`${formatLongDate(entry.day)} • ${formatHours(entry.hours)}`}
            >
              <div className="text-xs uppercase tracking-[0.25em]">${entry.label}</div>
              <div className="mt-2 text-xl">${entry.hit ? "•" : "○"}</div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export function BadgeGrid({ badges }) {
  return html`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-sm font-semibold text-white">Badges and milestones</div>
      <div className="mt-1 text-sm text-white/50">Momentum markers for consistency, depth, and follow-through.</div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        ${badges.map(
          (badge) => html`
            <div
              key=${badge.id}
              className=${cn(
                "rounded-2xl border p-4",
                badge.earned
                  ? "brand-soft-panel"
                  : "border-white/8 bg-white/[0.03]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-xl">
                  ${badge.emoji}
                </div>
                <div>
                  <div className="font-semibold text-white">${badge.label}</div>
                  <div className="text-sm text-white/55">
                    ${badge.earned ? "Unlocked" : "Keep going"}
                  </div>
                </div>
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export function EmptyState({ title, detail, action }) {
  return html`
    <div className="glass-panel rounded-3xl border-dashed p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/6 text-2xl">+</div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-white">${title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/58">${detail}</p>
      ${action
        ? html`<div className="mt-6 flex justify-center">${action}</div>`
        : null}
    </div>
  `;
}

export function SkeletonCard({ className = "h-40" }) {
  return html`<div className=${cn("skeleton rounded-3xl", className)}></div>`;
}

export function ToastStack({ toasts, onDismiss }) {
  return html`
    <div className="fixed right-4 top-4 z-50 grid w-[min(360px,calc(100vw-32px))] gap-3">
      ${toasts.map(
        (toast) => html`
          <button
            key=${toast.id}
            type="button"
            onClick=${() => onDismiss(toast.id)}
            className=${cn(
              "toast-enter glass-panel rounded-2xl px-4 py-3 text-left",
              toast.type === "error" ? "border-rose-400/25" : "border-accent/25",
            )}
          >
            <div className="font-semibold text-white">${toast.title}</div>
            <div className="mt-1 text-sm text-white/65">${toast.message}</div>
          </button>
        `,
      )}
    </div>
  `;
}

export function ConfettiBurst({ active }) {
  if (!active) {
    return null;
  }

  const colors = ["#8ce99a", "#6ad8ff", "#ffb86c", "#ffffff"];
  return html`
    <div className="confetti-layer" aria-hidden="true">
      ${Array.from({ length: 42 }, (_, index) => {
        const left = Math.round((index / 42) * 100);
        const color = colors[index % colors.length];
        return html`
          <span
            key=${index}
            className="confetti-piece"
            style=${{
              left: `${left}%`,
              background: color,
              "--x-shift": `${(index % 2 === 0 ? 1 : -1) * (40 + (index % 5) * 12)}px`,
              "--spin": `${index % 2 === 0 ? 420 : -420}deg`,
              animationDelay: `${(index % 10) * 40}ms`,
            }}
          ></span>
        `;
      })}
    </div>
  `;
}

export function AnnouncementBar({ announcement, author }) {
  if (!announcement) {
    return null;
  }

  return html`
    <div className="glass-panel rounded-3xl border-accent2/20 bg-gradient-to-r from-accent2/10 to-accent/10 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/55">
          Announcement
        </span>
        <span className="text-sm text-white/70">
          ${announcement.body}
        </span>
        <span className="ml-auto text-xs text-white/45">
          ${author?.name || "Admin"} • ${formatRelativeTime(announcement.createdAt)}
        </span>
      </div>
    </div>
  `;
}

export function Modal({ open, title, description, children, footer, onClose }) {
  if (!open) {
    return null;
  }

  return html`
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/55 p-4 backdrop-blur md:place-items-center">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">${title}</h3>
            ${description
              ? html`<p className="mt-2 text-sm text-white/60">${description}</p>`
              : null}
          </div>
          <button
            type="button"
            onClick=${onClose}
            className="h-12 min-w-12 rounded-2xl border border-white/10 bg-white/5 text-white/70"
          >
            ×
          </button>
        </div>
        <div className="mt-6">${children}</div>
        ${footer ? html`<div className="mt-6 flex justify-end gap-3">${footer}</div>` : null}
      </div>
    </div>
  `;
}

export function FeedCard({
  session,
  profile,
  reactions,
  currentUserId,
  onProfileOpen,
  onReactionToggle,
  canModerate,
  onDelete,
}) {
  const groupedReactions = ["🔥", "👏", "💡"].map((emoji) => ({
    emoji,
    count: reactions.filter((reaction) => reaction.emoji === emoji).length,
    active: reactions.some(
      (reaction) => reaction.emoji === emoji && reaction.userId === currentUserId,
    ),
  }));

  return html`
    <article className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-start gap-4">
        <${Avatar} profile=${profile} size="sm" onClick=${() => onProfileOpen(profile.id)} />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick=${() => onProfileOpen(profile.id)}
            className="font-semibold text-white"
          >
            ${profile.name}
          </button>
          <div className="mt-1 text-sm text-white/45">
            ${formatRelativeTime(session.loggedAt)} • ${formatHours(session.hours)}
          </div>
        </div>
        ${session.syncStatus === "queued"
          ? html`
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                Offline queued
              </span>
            `
          : null}
      </div>

      <div className="mt-5 rounded-3xl border border-white/8 bg-white/[0.03] p-5">
        <div className="text-lg font-semibold text-white">${session.learned}</div>
        ${session.challenges
          ? html`<p className="mt-3 text-sm leading-6 text-white/62">${session.challenges}</p>`
          : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        ${groupedReactions.map(
          (reaction) => html`
            <button
              key=${reaction.emoji}
              type="button"
              onClick=${() => onReactionToggle(session.id, reaction.emoji)}
              className=${cn(
                "min-h-12 rounded-2xl border px-4 text-sm transition",
                reaction.active
                  ? "brand-soft-panel text-white"
                  : "border-white/8 bg-white/[0.03] text-white/65 hover:bg-white/[0.05]",
              )}
            >
              ${reaction.emoji} ${reaction.count || ""}
            </button>
          `,
        )}
        ${canModerate
          ? html`
              <button
                type="button"
                onClick=${() => onDelete(session.id)}
                className="ml-auto min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm text-rose-100"
              >
                Delete post
              </button>
            `
          : null}
      </div>
    </article>
  `;
}

export function LeaderboardPodium({ leaders, onProfileOpen }) {
  const decorated = [leaders[1], leaders[0], leaders[2]].filter(Boolean);
  const heights = ["h-40", "h-52", "h-32"];

  return html`
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      ${decorated.map(
        (leader, index) => html`
          <button
            key=${leader.id}
            type="button"
            onClick=${() => onProfileOpen(leader.id)}
            className=${cn(
              "glass-panel rounded-[2rem] p-5 text-left transition hover:-translate-y-1",
              heights[index],
            )}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/50">
                #${leader.rank}
              </span>
              <span className="text-xl">${leader.rank === 1 ? "🏆" : leader.rank === 2 ? "🥈" : "🥉"}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <${Avatar} profile=${leader} size="sm" />
              <div>
                <div className="font-semibold text-white">${leader.name}</div>
                <div className="text-sm text-white/50">${leader.metrics.level}</div>
              </div>
            </div>
            <div className="mt-5 font-display text-3xl font-bold text-white">${leader.displayValue}</div>
            <div className="mt-2 text-sm text-white/55">${leader.detail}</div>
          </button>
        `,
      )}
    </div>
  `;
}

export function SessionHistory({
  sessions,
  profileLookup,
  editable,
  onEdit,
  onDelete,
  emptyState,
}) {
  if (!sessions.length) {
    return emptyState;
  }

  return html`
    <div className="grid gap-3">
      ${sessions.map((session) => {
        const profile = profileLookup[session.userId];
        return html`
          <article key=${session.id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3">
                ${profile ? html`<${Avatar} profile=${profile} size="sm" />` : null}
                <div>
                  <div className="font-semibold text-white">${profile?.name || "You"}</div>
                  <div className="text-sm text-white/45">
                    ${formatDateTime(session.loggedAt)} • Counts toward ${formatLongDate(session.sessionDay)}
                  </div>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-display text-2xl font-bold text-white">${formatHours(session.hours)}</div>
                ${session.syncStatus === "queued"
                  ? html`<div className="text-xs text-amber-100/85">Queued for sync</div>`
                  : null}
              </div>
            </div>
            <div className="mt-4 text-base font-semibold text-white">${session.learned}</div>
            ${session.challenges
              ? html`<p className="mt-2 text-sm leading-6 text-white/60">${session.challenges}</p>`
              : null}
            ${editable
              ? html`
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick=${() => onEdit(session)}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70"
                    >
                      Edit session
                    </button>
                    <button
                      type="button"
                      onClick=${() => onDelete(session)}
                      className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm text-rose-100"
                    >
                      Delete session
                    </button>
                  </div>
                `
              : null}
          </article>
        `;
      })}
    </div>
  `;
}
