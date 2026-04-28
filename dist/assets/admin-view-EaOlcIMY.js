import{M as e,P as t,a as n,b as r,c as i,j as a,k as o}from"./components-Be7lVndE.js";import{r as s}from"./index-xlBTyCBk.js";var c=t(e());function l({currentUser:e,profiles:t,sessions:l,ownerAnalytics:u,onRemoveUser:d,onDeleteAsAdmin:f,onSendAnnouncement:p}){let[m,h]=c.useState(``),[g,_]=c.useState(``),v=c.useDeferredValue(m.trim().toLowerCase()),y=t.filter(e=>e.name.toLowerCase().includes(v)),b=o(l.map(e=>e.hours)),x=new Set(l.filter(e=>s([e])>0).map(e=>e.userId)).size,S=l.slice(0,10);async function C(e){e.preventDefault(),g.trim()&&(await p(g.trim()),_(``))}return e.isAdmin?a`
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="text-xs uppercase tracking-[0.28em] text-white/45">Admin panel</div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Manage the system without clutter.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">
          Review member health, moderate posts, and send short announcements to the whole group.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <${i}
          eyebrow="Total users"
          value=${String(t.length)}
          detail="Registered members in this workspace."
        />
        <${i}
          eyebrow="Total hours logged"
          value=${r(b)}
          detail="All learning time recorded so far."
        />
        <${i}
          eyebrow="Active users"
          value=${String(x)}
          detail="Members with a current-week session."
        />
        <${i}
          eyebrow="Daily active users"
          value=${String(u.dailyActiveUsers)}
          detail="Members who logged something today."
        />
        <${i}
          eyebrow="Weekly retention"
          value=${`${u.weeklyRetention}%`}
          detail="Share of members active this week."
        />
        <${i}
          eyebrow="Average hours"
          value=${r(u.averageHours)}
          detail="Average logged time per member."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <form className="glass-panel rounded-[2rem] p-6" onSubmit=${C}>
          <div className="text-sm font-semibold text-white">Send announcement</div>
          <div className="mt-1 text-sm text-white/50">This appears at the top of every member’s app.</div>
          <textarea
            rows="5"
            value=${g}
            onInput=${e=>_(e.target.value)}
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
              value=${m}
              onInput=${e=>h(e.target.value)}
              placeholder="Search users"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
            />
          </div>

          <div className="mt-5 grid gap-3">
            ${y.map(t=>a`
                <div key=${t.id} className="flex items-center justify-between gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                  <div>
                    <div className="font-semibold text-white">${t.name}</div>
                    <div className="mt-1 text-sm text-white/50">${t.email}</div>
                  </div>
                  <button
                    type="button"
                    disabled=${t.id===e.id}
                    onClick=${()=>d(t.id)}
                    className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              `)}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <div className="text-sm font-semibold text-white">Moderate recent posts</div>
        <div className="mt-1 text-sm text-white/50">Delete inappropriate or off-topic feed items.</div>
        <div className="mt-5 grid gap-3">
          ${S.map(e=>a`
            <div key=${e.id} className="flex flex-col gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">${e.learned}</div>
                <div className="mt-2 text-sm text-white/50">
                  ${t.find(t=>t.id===e.userId)?.name||`Unknown`} • ${r(e.hours)}
                </div>
              </div>
              <button
                type="button"
                onClick=${()=>f(e.id)}
                className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm font-semibold text-rose-100"
              >
                Delete post
              </button>
            </div>
          `)}
        </div>
      </section>
    </div>
  `:a`
      <${n}
        title="Admin access only"
        detail="This workspace is reserved for administrators who manage members, moderation, and announcements."
      />
    `}export{l as default};