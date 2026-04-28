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
    <div className=${cn("relative grid place-items-center mx-auto", compact ? "h-28 w-28" : "h-40 w-40 sm:h-44 sm:w-44")}>
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
      <div className="absolute inset-0 grid place-items-center text-center p-2">
        <div>
          <div className=${cn("font-display font-bold text-white leading-none", compact ? "text-xl" : "text-2xl sm:text-4xl")}>
            ${formatHours(value)}
          </div>
          <div className="mt-1 text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-white/45">${label}</div>
          <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-white/60 leading-tight">${goal}h goal<br className="sm:hidden"/> • ${sublabel}</div>
        </div>
      </div>
    </div>
  `;
}

export function MetricCard({ eyebrow, value, detail }) {
  return html`
    <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-center">
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-white/45">${eyebrow}</div>
      <div className="brand-gradient-text mt-1 sm:mt-3 font-display text-2xl sm:text-3xl font-bold truncate">
        ${value}
      </div>
      <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/65">${detail}</div>
    </div>
  `;
}

export function WeeklyBarChart({ bars }) {
  const max = Math.max(1, ...bars.map((bar) => bar.value));
  return html`
    <div className="glass-panel rounded-3xl p-4 sm:p-5 w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Weekly bar chart</div>
          <div className="text-xs sm:text-sm text-white/50">Daily hours across the current Sunday-Saturday cycle.</div>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 grid grid-cols-7 gap-1 sm:gap-3">
        ${bars.map(
          (bar) => html`
            <div key=${bar.day} className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="flex h-32 sm:h-40 w-full items-end justify-center rounded-2xl border border-white/6 bg-white/[0.03] p-1 sm:p-2">
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
                <div className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.22em] text-white/45">${bar.label}</div>
                <div className="mt-1 text-[10px] sm:text-sm text-white/75">${bar.value ? formatHours(bar.value) : "0h"}</div>
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
    <div className="glass-panel rounded-3xl p-4 sm:p-5 w-full overflow-x-auto custom-scrollbar">
      <div className="text-sm font-semibold text-white">7-day streak tracker</div>
      <div className="mt-1 text-xs sm:text-sm text-white/50">A day counts after at least 30 minutes of learning.</div>
      <div className="mt-4 sm:mt-5 grid grid-cols-7 gap-1.5 sm:gap-2 min-w-[280px]">
        ${tracker.map(
          (entry) => html`
            <div
              key=${entry.day}
              className=${cn(
                "rounded-2xl border px-1 sm:px-2 py-3 sm:py-4 text-center",
                entry.hit
                  ? "border-accent/35 bg-accent/12 text-white"
                  : "border-white/8 bg-white/[0.03] text-white/45",
              )}
              title=${`${formatLongDate(entry.day)} • ${formatHours(entry.hours)}`}
            >
              <div className="text-[9px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.25em]">${entry.label}</div>
              <div className="mt-1 sm:mt-2 text-lg sm:text-xl">${entry.hit ? "•" : "○"}</div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}

export function BadgeGrid({ badges }) {
  return html`
    <div className="glass-panel rounded-3xl p-4 sm:p-5">
      <div className="text-sm font-semibold text-white">Badges and milestones</div>
      <div className="mt-1 text-xs sm:text-sm text-white/50">Momentum markers for consistency, depth, and follow-through.</div>
      <div className="mt-4 sm:mt-5 grid gap-3 grid-cols-1 md:grid-cols-2">
        ${badges.map(
          (badge) => html`
            <div
              key=${badge.id}
              className=${cn(
                "rounded-2xl border p-3 sm:p-4",
                badge.earned
                  ? "brand-soft-panel"
                  : "border-white/8 bg-white/[0.03]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-2xl bg-white/8 text-lg sm:text-xl shrink-0">
                  ${badge.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-white truncate">${badge.label}</div>
                  <div className="text-xs sm:text-sm text-white/55">
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
    <div className="glass-panel rounded-3xl border-dashed p-6 sm:p-8 text-center px-4">
      <div className="mx-auto grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-white/6 text-xl sm:text-2xl">+</div>
      <h3 className="mt-4 sm:mt-5 font-display text-xl sm:text-2xl font-semibold text-white">${title}</h3>
      <p className="mx-auto mt-2 sm:mt-3 max-w-lg text-xs sm:text-sm leading-5 sm:leading-6 text-white/58">${detail}</p>
      ${action
        ? html`<div className="mt-5 sm:mt-6 flex justify-center">${action}</div>`
        : null}
    </div>
  `;
}

export function SkeletonCard({ className = "h-32 sm:h-40" }) {
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
            <div className="font-semibold text-sm sm:text-base text-white">${toast.title}</div>
            <div className="mt-1 text-xs sm:text-sm text-white/65">${toast.message}</div>
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
    <div className="glass-panel rounded-3xl border-accent2/20 bg-gradient-to-r from-accent2/10 to-accent/10 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="self-start sm:self-auto whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.26em] text-white/55">
          Announcement
        </span>
        <span className="text-xs sm:text-sm text-white/70 leading-relaxed">
          ${announcement.body}
        </span>
        <span className="sm:ml-auto text-[10px] sm:text-xs text-white/45">
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
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/60 p-4 pb-[env(safe-area-inset-bottom)] backdrop-blur md:place-items-center">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-5 sm:p-6 mb-safe max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">${title}</h3>
            ${description
              ? html`<p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/60">${description}</p>`
              : null}
          </div>
          <button
            type="button"
            onClick=${onClose}
            className="h-10 w-10 sm:h-12 sm:min-w-12 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white/70"
          >
            ×
          </button>
        </div>
        <div className="mt-5 sm:mt-6">${children}</div>
        ${footer ? html`<div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">${footer}</div>` : null}
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
    <article className="glass-panel rounded-[2rem] p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <${Avatar} profile=${profile} size="sm" onClick=${() => onProfileOpen(profile.id)} />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick=${() => onProfileOpen(profile.id)}
            className="font-semibold text-sm sm:text-base text-white truncate w-full text-left"
          >
            ${profile.name}
          </button>
          <div className="mt-0.5 text-[11px] sm:text-sm text-white/45">
            ${formatRelativeTime(session.loggedAt)} • ${formatHours(session.hours)}
          </div>
        </div>
        ${session.syncStatus === "queued"
          ? html`
              <span className="whitespace-nowrap rounded-full border border-amber-300/20 bg-amber-300/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-amber-100">
                Queued
              </span>
            `
          : null}
      </div>

      <div className="mt-4 sm:mt-5 rounded-2xl sm:rounded-3xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <div className="text-base sm:text-lg font-semibold text-white leading-snug">${session.learned}</div>
        ${session.challenges
          ? html`<p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-white/62">${session.challenges}</p>`
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
                "min-h-10 sm:min-h-12 rounded-xl sm:rounded-2xl border px-3 sm:px-4 text-xs sm:text-sm transition",
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
                className="ml-auto min-h-10 sm:min-h-12 rounded-xl sm:rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 sm:px-4 text-xs sm:text-sm text-rose-100"
              >
                Delete
              </button>
            `
          : null}
      </div>
    </article>
  `;
}

export function LeaderboardPodium({ leaders, onProfileOpen }) {
  const decorated = [leaders[1], leaders[0], leaders[2]].filter(Boolean);
  const heights = ["min-h-[9rem] md:h-40", "min-h-[11rem] md:h-52", "min-h-[7rem] md:h-32"];

  return html`
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3 md:items-end">
      ${decorated.map(
        (leader, index) => html`
          <button
            key=${leader.id}
            type="button"
            onClick=${() => onProfileOpen(leader.id)}
            className=${cn(
              "glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 text-left transition hover:-translate-y-1 flex md:block items-center md:items-start justify-between md:justify-start",
              heights[index],
            )}
          >
            <div className="flex md:w-full items-center justify-between gap-3 md:gap-0 order-2 md:order-1">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/50">
                #${leader.rank}
              </span>
              <span className="text-lg sm:text-xl">${leader.rank === 1 ? "🏆" : leader.rank === 2 ? "🥈" : "🥉"}</span>
            </div>
            
            <div className="mt-0 md:mt-5 flex items-center gap-3 order-1 md:order-2 w-1/2 md:w-auto">
              <${Avatar} profile=${leader} size="sm" />
              <div className="min-w-0">
                <div className="font-semibold text-sm sm:text-base text-white truncate">${leader.name}</div>
                <div className="text-[10px] sm:text-sm text-white/50">${leader.metrics.level}</div>
              </div>
            </div>
            
            <div className="md:mt-5 text-right md:text-left order-3 md:order-3 flex flex-col items-end md:items-start">
              <div className="font-display text-xl sm:text-3xl font-bold text-white">${leader.displayValue}</div>
              <div className="mt-0.5 md:mt-2 text-[10px] sm:text-sm text-white/55">${leader.detail}</div>
            </div>
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
          <article key=${session.id} className="glass-panel rounded-[1.5rem] sm:rounded-3xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start gap-3 sm:gap-4 justify-between">
              <div className="flex items-center gap-2 sm:gap-3 max-w-[65%]">
                ${profile ? html`<${Avatar} profile=${profile} size="sm" />` : null}
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-white truncate">${profile?.name || "You"}</div>
                  <div className="text-[10px] sm:text-sm text-white/45 truncate">
                    ${formatDateTime(session.loggedAt)}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-xl sm:text-2xl font-bold text-white">${formatHours(session.hours)}</div>
                ${session.syncStatus === "queued"
                  ? html`<div className="whitespace-nowrap mt-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] sm:text-xs text-amber-100/85 border border-amber-400/20">Queued</div>`
                  : null}
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-white leading-snug">${session.learned}</div>
            ${session.challenges
              ? html`<p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/60">${session.challenges}</p>`
              : null}
            ${editable
              ? html`
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick=${() => onEdit(session)}
                      className="min-h-10 sm:min-h-12 flex-1 sm:flex-none rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] px-3 sm:px-4 text-xs sm:text-sm text-white/70"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick=${() => onDelete(session)}
                      className="min-h-10 sm:min-h-12 flex-1 sm:flex-none rounded-xl sm:rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 sm:px-4 text-xs sm:text-sm text-rose-100"
                    >
                      Delete
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
