import{M as e,P as t,a as n,j as r,o as i}from"./components-Be7lVndE.js";var a=t(e());function o({currentUser:e,profiles:t,sessions:o,reactions:s,onProfileOpen:c,onReactionToggle:l,onDeleteAsAdmin:u}){let[d,f]=a.useState(``),p=a.useDeferredValue(d.trim().toLowerCase()),m=Object.fromEntries(t.map(e=>[e.id,e])),h=o.filter(e=>{let t=m[e.userId];return p?t?.name.toLowerCase().includes(p):!0});return r`
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
              value=${d}
              onInput=${e=>f(e.target.value)}
              placeholder="Search the group"
              className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30"
            />
          </label>
        </div>
      </section>

      ${h.length?r`
            <section className="grid gap-4">
              ${h.map(t=>{let n=m[t.userId],a=s.filter(e=>e.sessionId===t.id);return r`
                  <${i}
                    key=${t.id}
                    session=${t}
                    profile=${n}
                    reactions=${a}
                    currentUserId=${e.id}
                    onProfileOpen=${c}
                    onReactionToggle=${(e,t)=>l(e,t)}
                    canModerate=${e.isAdmin}
                    onDelete=${u}
                  />
                `})}
            </section>
          `:r`
            <${n}
              title="No posts yet"
              detail="Once your group starts logging sessions, they will show up here from newest to oldest."
            />
          `}
    </div>
  `}export{o as default};