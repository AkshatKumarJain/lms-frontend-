export default function PageCard({ title, subtitle, children, aside }) {
  return (
    <section className="page-glow relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow)]">
      <div className="relative grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--brand-deep)]">
              LearnSphere Workspace
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--ink)] md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>
        {aside ? (
          <aside className="glass-panel rounded-[1.75rem] border border-[var(--line)] p-5 text-sm text-[var(--ink)] shadow-[0_18px_44px_rgba(51,34,23,0.09)]">
            {aside}
          </aside>
        ) : null}
      </div>
    </section>
  );
}
