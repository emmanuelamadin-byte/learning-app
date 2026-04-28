import React from "react";
import { EmptyState, MetricCard } from "../components.js";
import { html } from "../lib/html.js";
import { sumWeeklyHours } from "../lib/metrics.js";
import { formatHours, sum } from "../lib/utils.js";

export default function AdminView({
  currentUser,
  profiles,
  sessions,
  ownerAnalytics,
  onRemoveUser,
  onDeleteAsAdmin,
  onSendAnnouncement,
}) {
  const [search, setSearch] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const deferredSearch = React.useDeferredValue(search.trim().toLowerCase());
  const visibleProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(deferredSearch),
  );
  const totalHours = sum(sessions.map((session) => session.hours));
  const activeUsers = new Set(
    sessions.filter((session) => sumWeeklyHours([session]) > 0).map((session) => session.userId),
  ).size;
  const recentSessions = sessions.slice(0, 10);

  async function handleAnnouncementSubmit(event) {
    event.preventDefault();
    if (!announcement.trim()) {
      return;
    }
    await onSendAnnouncement(announcement.trim());
    setAnnouncement("");
  }

  if (!currentUser.isAdmin) {
    return html`
      <${EmptyState}
        title="Admin access only"
        detail="This workspace is reserved for administrators who manage members, moderation, and announcements."
      />
    `;
  }

  return html`
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="text-xs uppercase tracking-[0.28em] text-white/45">Admin panel</div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Manage the system without clutter.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
          Review member health, moderate posts, and send short announcements to the whole group.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <${MetricCard}
          eyebrow="Total users"
          value=${String(profiles.length)}
          detail="Registered members in this workspace."
        />
        <${MetricCard}
          eyebrow="Total hours logged"
          value=${formatHours(totalHours)}
          detail="All learning time recorded so far."
        />
        <${MetricCard}
          eyebrow="Active users"
          value=${String(activeUsers)}
          detail="Members with a current-week session."
        />
        <${MetricCard}
          eyebrow="Daily active users"
          value=${String(ownerAnalytics.dailyActiveUsers)}
          detail="Members who logged something today."
        />
        <${MetricCard}
          eyebrow="Weekly retention"
          value=${`${ownerAnalytics.weeklyRetention}%`}
          detail="Share of members active this week."
        />
        <${MetricCard}
          eyebrow="Average hours"
          value=${formatHours(ownerAnalytics.averageHours)}
          detail="Average logged time per member."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <form className="glass-panel rounded-[2rem] p-6" onSubmit=${handleAnnouncementSubmit}>
          <div className="text-sm font-semibold text-white">Send announcement</div>
          <div className="mt-1 text-sm text-white/50">This appears at the top of every member’s app.</div>
          <textarea
            rows="5"
            value=${announcement}
            onInput=${(event) => setAnnouncement(event.target.value)}
            className="mt-5 w-full rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30"
            placeholder="Share a weekly sprint, deadline, or community encouragement."
          ></textarea>
          <button type="submit" className="brand-gradient-bg mt-4 min-h-12 rounded-2xl px-4 text-sm font-semibold">
            Send announcement
          </button>
        </form>

        <div className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">Members</div>
              <div className="mt-1 text-sm text-white/50">Search by name and remove when needed.</div>
            </div>
            <input
              type="search"
              value=${search}
              onInput=${(event) => setSearch(event.target.value)}
              placeholder="Search users"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
            />
          </div>

          <div className="mt-5 grid gap-3">
            ${visibleProfiles.map(
              (profile) => html`
                <div key=${profile.id} className="flex items-center justify-between gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <div>
                    <div className="font-semibold text-white">${profile.name}</div>
                    <div className="mt-1 text-sm text-white/50">${profile.email}</div>
                  </div>
                  <button
                    type="button"
                    disabled=${profile.id === currentUser.id}
                    onClick=${() => onRemoveUser(profile.id)}
                    className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              `,
            )}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="text-sm font-semibold text-white">Moderate recent posts</div>
        <div className="mt-1 text-sm text-white/50">Delete inappropriate or off-topic feed items.</div>
        <div className="mt-5 grid gap-3">
          ${recentSessions.map((session) => html`
            <div key=${session.id} className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">${session.learned}</div>
                <div className="mt-2 text-sm text-white/50">
                  ${profiles.find((profile) => profile.id === session.userId)?.name || "Unknown"} • ${formatHours(session.hours)}
                </div>
              </div>
              <button
                type="button"
                onClick=${() => onDeleteAsAdmin(session.id)}
                className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100"
              >
                Delete post
              </button>
            </div>
          `)}
        </div>
      </section>
    </div>
  `;
}
