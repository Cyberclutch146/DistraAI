import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: "Satellite Risk Mapping",
    description: "Multi-spectral satellite imagery analyzed in real-time to detect terrain displacement, vegetation loss, and water body changes across monitored regions.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5m-3 1.5l-3-1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "ML Risk Scoring",
    description: "Ensemble machine learning models combine geological, meteorological, and hydrological data to produce calibrated risk scores with confidence intervals.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    title: "Real-Time Alerts",
    description: "Severity-tiered alerts pushed to your device within seconds of threshold breaches. Configurable notification rules by region, risk type, and severity level.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Community Intel",
    description: "Crowd-sourced ground reports from verified local observers. Geotagged photographs, road conditions, and on-the-ground situation updates in real time.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "Open Data Integration",
    description: "Fuses 12+ data sources including Copernicus Sentinel-2, USGS SRTM terrain models, IMD weather stations, and ISRO Bhuvan land-use data.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Safety First Design",
    description: "Built as a decision-support tool for evacuation planning. Clear, unambiguous risk communication designed with emergency management professionals.",
  },
];

const stats = [
  { value: "9", label: "Active Zones", suffix: "monitored" },
  { value: "12", label: "Data Sources", suffix: "connected" },
  { value: "<2s", label: "Alert Latency", suffix: "avg" },
  { value: "99.97%", label: "Uptime", suffix: "30d" },
];

const dataSources = [
  { name: "Copernicus Sentinel-2", type: "Satellite Imagery" },
  { name: "USGS SRTM", type: "Terrain Models" },
  { name: "IMD Open Data", type: "Weather Stations" },
  { name: "ISRO Bhuvan", type: "Land Use Data" },
  { name: "CWC River Data", type: "Hydrological" },
  { name: "GSI Landslide Atlas", type: "Geological" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav variant="transparent" activePage="" />

      <main className="flex-1">
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />

          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-36 lg:pb-32">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                <span className="text-xs font-medium text-accent">Monitoring 9 regions in real time</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
                Disaster intelligence{" "}
                <br className="hidden sm:block" />
                <span className="text-gradient">before the crisis hits</span>
              </h1>

              {/* Subhead */}
              <p
                className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                DistraAI combines satellite imagery, environmental sensors, and machine learning to
                predict flood and landslide risk — giving communities the time they need to act.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <a
                  href="/dashboard"
                  className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2.5"
                >
                  Open Dashboard
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <a
                  href="#features"
                  className="btn-ghost px-8 py-3.5 text-sm inline-flex items-center gap-2"
                >
                  Learn More
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Dashboard preview card */}
            <div
              className="mt-16 lg:mt-24 max-w-5xl mx-auto animate-scale-in"
              style={{ animationDelay: "400ms" }}
            >
              <div className="relative rounded-2xl border border-border-subtle overflow-hidden shadow-2xl">
                {/* Glow effect behind the card */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-accent/20 via-transparent to-transparent opacity-60" />

                {/* Mock dashboard preview */}
                <div className="relative bg-bg-surface p-1">
                  {/* Window chrome */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-risk-high/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-risk-moderate/60" />
                      <div className="h-2.5 w-2.5 rounded-full bg-risk-low/60" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-2 rounded-lg bg-bg-primary/60 border border-border-subtle px-3 py-1">
                        <svg className="h-3 w-3 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span className="text-[11px] font-data text-text-tertiary">distra.ai/dashboard</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content preview */}
                  <div className="p-4 sm:p-6 bg-bg-primary rounded-b-xl">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Map placeholder */}
                      <div className="col-span-12 rounded-xl bg-bg-surface border border-border-subtle h-48 sm:h-64 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-risk-moderate/5" />
                        {/* Fake map grid */}
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `
                            linear-gradient(var(--border-subtle) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
                          `,
                          backgroundSize: "40px 40px",
                        }} />
                        {/* Risk zones */}
                        <div className="absolute top-12 left-16 h-16 w-24 rounded-lg bg-risk-high/20 border border-risk-high/30 animate-pulse" />
                        <div className="absolute top-20 left-48 h-12 w-20 rounded-lg bg-risk-moderate/20 border border-risk-moderate/30" />
                        <div className="absolute top-8 right-24 h-20 w-16 rounded-lg bg-risk-low/20 border border-risk-low/30" />
                        <div className="absolute bottom-16 left-1/3 h-14 w-28 rounded-lg bg-risk-critical/15 border border-risk-critical/30 animate-pulse" />
                        {/* LIVE badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-bg-primary/80 border border-border-subtle">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-risk-low" />
                          </span>
                          <span className="text-[9px] font-semibold text-text-secondary tracking-wider">LIVE</span>
                        </div>
                      </div>

                      {/* Score card */}
                      <div className="col-span-4 sm:col-span-3 rounded-xl bg-bg-surface border border-border-subtle p-3 sm:p-4">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">Risk Score</div>
                        <div className="font-data text-2xl sm:text-3xl font-bold text-risk-high">72</div>
                        <div className="text-[10px] text-text-tertiary font-data mt-1">/ 100 · HIGH</div>
                      </div>

                      {/* Alert cards */}
                      <div className="col-span-8 sm:col-span-5 rounded-xl bg-bg-surface border border-border-subtle p-3 sm:p-4">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-text-tertiary mb-2">Active Alerts</div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 rounded-lg bg-bg-primary/40 p-2">
                            <div className="h-2 w-2 rounded-full bg-risk-critical animate-pulse" />
                            <span className="text-[10px] text-text-primary truncate">Wayanad — Imminent landslide risk</span>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-bg-primary/40 p-2">
                            <div className="h-2 w-2 rounded-full bg-risk-high" />
                            <span className="text-[10px] text-text-primary truncate">Kochi — Flash flood warning</span>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-bg-primary/40 p-2">
                            <div className="h-2 w-2 rounded-full bg-risk-moderate" />
                            <span className="text-[10px] text-text-primary truncate">Munnar — Slope instability</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini stats */}
                      <div className="hidden sm:block col-span-4 space-y-3">
                        <div className="rounded-xl bg-bg-surface border border-border-subtle p-3">
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-text-tertiary mb-1">Rainfall</div>
                          <div className="font-data text-sm font-bold text-text-primary">127 <span className="text-text-tertiary text-xs">mm</span></div>
                        </div>
                        <div className="rounded-xl bg-bg-surface border border-border-subtle p-3">
                          <div className="text-[9px] font-semibold uppercase tracking-wider text-text-tertiary mb-1">River Level</div>
                          <div className="font-data text-sm font-bold text-risk-moderate">9.2 <span className="text-text-tertiary text-xs">m</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Stats bar ═══ */}
        <section className="border-y border-border-subtle bg-bg-surface/50">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-data text-2xl sm:text-3xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                  <div className="text-xs text-text-tertiary mt-0.5">{stat.suffix}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Features ═══ */}
        <section id="features" className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Intelligence at every layer
              </h2>
              <p className="text-text-secondary leading-relaxed">
                From satellite orbit to ground level, DistraAI fuses multiple data streams into
                actionable risk intelligence you can trust.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group card-static p-6 hover:bg-bg-surface-hover transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 text-accent mb-5 group-hover:bg-accent/15 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ How it works ═══ */}
        <section className="relative py-20 lg:py-28 border-t border-border-subtle bg-bg-surface/30">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                Process
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                From satellite to signal
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Our pipeline processes terabytes of satellite and sensor data into clear, actionable risk intelligence in under two seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Ingest", desc: "Satellite imagery, weather data, soil sensors, and river gauges stream into our processing pipeline every 15 minutes." },
                { step: "02", title: "Analyze", desc: "Computer vision models detect terrain changes while hydrological models compute runoff and saturation projections." },
                { step: "03", title: "Score", desc: "Ensemble ML models fuse all data streams into calibrated 0–100 risk scores with confidence intervals per zone." },
                { step: "04", title: "Alert", desc: "Threshold breaches trigger severity-tiered alerts pushed to dashboards, devices, and emergency coordinators." },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="font-data text-5xl font-bold text-border-subtle mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Data Sources ═══ */}
        <section className="py-20 lg:py-28 border-t border-border-subtle">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                Trust
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Built on authoritative data
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Every risk score is grounded in publicly verifiable data from government agencies and international satellite programs.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dataSources.map((source) => (
                <div
                  key={source.name}
                  className="card-static p-4 text-center hover:bg-bg-surface-hover transition-colors"
                >
                  <div className="text-sm font-medium text-text-primary mb-1">{source.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-text-tertiary">{source.type}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Final CTA ═══ */}
        <section className="relative py-20 lg:py-28 border-t border-border-subtle overflow-hidden">
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Start monitoring your region
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
              Open the dashboard to see real-time risk assessments, active alerts, and environmental data for your area.
            </p>
            <a
              href="/dashboard"
              className="btn-primary px-10 py-4 text-base inline-flex items-center gap-3"
            >
              Open Dashboard
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
