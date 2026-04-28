import React from "react";
import { EmptyState, FeedCard } from "../components.js";
import { html } from "../lib/html.js";

export default function CommunityView({
  currentUser,
  profiles,
  sessions,
  reactions,
  onProfileOpen,
  onReactionToggle,
  onDeleteAsAdmin,
}) {
  const [search, setSearch] = React.useState("");
  const deferredSearch = React.useDeferredValue(search.trim().toLowerCase());

  const profileLookup = Object.fromEntries(profiles.map((profile) => [profile.id, profile]));
  const visibleSessions = sessions.filter((session) => {
    const owner = profileLookup[session.userId];
    if (!deferredSearch) return true;
    return owner?.name.toLowerCase().includes(deferredSearch);
  });

  return html`
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">Group feed</div>
            <h1 className="mt-3 font-display text-4xl font-bold text-white">Learn in public with people who care.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
              Every session appears here in real time. Use reactions to keep the energy high.
              Comments are planned for Phase 2.
            </p>
          </div>
          <label className="grid gap-2 lg:w-80">
            <span className="text-sm text-white/55">Search members by name</span>
            <input
              type="search"
              value=${search}
              onInput=${(event) => setSearch(event.target.value)}
              placeholder="Search the group"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
            />
          </label>
        </div>
      </section>

      ${visibleSessions.length
        ? html`
            <section className="grid gap-4">
              ${visibleSessions.map((session) => {
                const owner = profileLookup[session.userId];
                const feedReactions = reactions.filter((reaction) => reaction.sessionId === session.id);
                return html`
                  <${FeedCard}
                    key=${session.id}
                    session=${session}
                    profile=${owner}
                    reactions=${feedReactions}
                    currentUserId=${currentUser.id}
                    onProfileOpen=${onProfileOpen}
                    onReactionToggle=${(sessionId, emoji) => onReactionToggle(sessionId, emoji)}
                    canModerate=${currentUser.isAdmin}
                    onDelete=${onDeleteAsAdmin}
                  />
                `;
              })}
            </section>
          `
        : html`
            <${EmptyState}
              title="No posts yet"
              detail="Once your group starts logging sessions, they will show up here from newest to oldest."
            />
          `}
    </div>
  `;
}
