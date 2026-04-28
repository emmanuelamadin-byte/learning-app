import{C as e,M as t,P as n,a as r,b as i,c as a,d as o,h as s,j as c,p as l,r as u,u as d}from"./components-Be7lVndE.js";var f=n(t());function p({currentUser:t,currentMetrics:n,sessions:p,profileLookup:m,sessionDraft:h,setSessionDraft:g,onCreateSession:_,onEditSession:v,onDeleteSession:y}){let[b,x]=f.useState(``),[S,C]=f.useState(``),w=p.filter(e=>e.userId===t.id).filter(e=>{let t=!b||e.sessionDay===b,n=!S||Number(e.hours)>=Number(S);return t&&n});return c`
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="hero-orb hero-orb--green -left-6 top-6"></div>
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-white/45">Personal dashboard</div>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-bold text-white md:text-5xl">
              Stay visible. Stay consistent. Stack proof every day.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">
              Weekly target: ${n.weeklyGoal}h. Sessions only count toward streaks
              after 30 minutes, and you can still backfill yesterday before today ends.
            </p>

            <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row lg:items-center">
              <${d}
                value=${n.weeklyHours}
                goal=${n.weeklyGoal}
                label="Weekly progress"
              />
              <div className="grid gap-3">
                ${n.insights.map(e=>c`
                    <div
                      key=${e}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
                    >
                      ${e}
                    </div>
                  `)}
              </div>
            </div>
          </div>
        </div>

        <form className="glass-panel rounded-[2rem] p-6 sm:p-8" onSubmit=${_}>
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
                value=${h.learned}
                onInput=${e=>g(t=>({...t,learned:e.target.value}))}
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
                  value=${h.hours}
                  onInput=${e=>g(t=>({...t,hours:Number(e.target.value)}))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm text-white/62">Count this toward</span>
                <select
                  value=${h.sessionDay}
                  onChange=${e=>g(t=>({...t,sessionDay:e.target.value}))}
                  className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                >
                  <option value=${e(new Date)}>Today</option>
                  <option value=${e(new Date(Date.now()-864e5))}>Yesterday</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-white/62">Challenges faced (optional)</span>
              <textarea
                rows="3"
                value=${h.challenges}
                onInput=${e=>g(t=>({...t,challenges:e.target.value}))}
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
        <${a}
          eyebrow="All-time hours"
          value=${i(n.totalHours)}
          detail="Every recorded study session combined."
        />
        <${a}
          eyebrow="Days active"
          value=${String(n.activeDays)}
          detail="Unique calendar days with at least one session."
        />
        <${a}
          eyebrow="Current streak"
          value=${`${n.currentStreak} days`}
          detail=${n.streakAtRisk?`No qualifying session logged yet today.`:`Streak is healthy right now.`}
        />
        <${a}
          eyebrow="Longest streak"
          value=${`${n.longestStreak} days`}
          detail=${`${n.level} level • best day ${n.bestDay?i(n.bestDay.hours):`n/a`}`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <${s} bars=${n.weeklyBars} />
        <${l} tracker=${n.sevenDayTracker} />
      </section>

      <section>
        <${u} badges=${n.badges} />
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
                value=${b}
                onInput=${e=>x(e.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-white/62">Minimum hours</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value=${S}
                onInput=${e=>C(e.target.value)}
                className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white"
                placeholder="0.5"
              />
            </label>
            <button
              type="button"
              onClick=${()=>{x(``),C(``)}}
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
          <${o}
            sessions=${w}
            profileLookup=${m}
            editable=${!0}
            onEdit=${v}
            onDelete=${y}
            emptyState=${c`
              <${r}
                title="No sessions match these filters"
                detail="Try widening the date range or lowering the minimum hours threshold."
              />
            `}
          />
        </div>
      </section>
    </div>
  `}export{p as default};