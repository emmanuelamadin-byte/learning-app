import{M as e,a as t,b as n,d as r,j as i,n as a,p as o,r as s,u as c}from"./components-Be7lVndE.js";import{n as l}from"./index-xlBTyCBk.js";e();function u({currentUser:e,selectedProfile:u,profiles:d,sessions:f,profileLookup:p,onEditSession:m,onDeleteSession:h}){if(!u)return i`
      <${t}
        title="Profile not found"
        detail="The member you are looking for is missing from the current workspace."
      />
    `;let g=l(u,f,d),_=f.filter(e=>e.userId===u.id).slice(0,8),v=e.id===u.id;return i`
    <div className="grid gap-6">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <${a} profile=${u} size="lg" />
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/45">
                ${v?`Your profile`:`Public profile`}
              </div>
              <h1 className="mt-2 font-display text-4xl font-bold text-white">${u.name}</h1>
              <div className="mt-2 text-sm text-white/58">
                ${g.level} • ${n(g.totalHours)} total •
                ${g.currentStreak} day current streak
              </div>
            </div>
          </div>
          <${c}
            value=${g.weeklyHours}
            goal=${g.weeklyGoal}
            label="Weekly progress"
            compact=${!0}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          ${[[`Weekly hours`,n(g.weeklyHours)],[`Current streak`,`${g.currentStreak} days`],[`Longest streak`,`${g.longestStreak} days`],[`Days active`,`${g.activeDays}`]].map(([e,t])=>i`
              <div key=${e} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">${e}</div>
                <div className="mt-3 font-display text-3xl font-bold text-white">${t}</div>
              </div>
            `)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <${o} tracker=${g.sevenDayTracker} />
        <${s} badges=${g.badges} />
      </section>

      <section>
        <div className="mb-4">
          <div className="text-xs uppercase tracking-[0.28em] text-white/45">Recent sessions</div>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white">
            ${v?`Your latest work`:`${u.name.split(` `)[0]}'s latest work`}
          </h2>
        </div>

        <${r}
          sessions=${_}
          profileLookup=${p}
          editable=${v}
          onEdit=${m}
          onDelete=${h}
          emptyState=${i`
            <${t}
              title="No sessions logged yet"
              detail="Once this learner starts logging, their recent work will show up here."
            />
          `}
        />
      </section>
    </div>
  `}export{u as default};