import Link from "next/link";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";

const features = [
  {
    index: "01",
    title: "Satellite risk mapping",
    description:
      "Multi-spectral satellite imagery analyzed to detect terrain displacement, vegetation loss, and water body changes across monitored regions.",
  },
  {
    index: "02",
    title: "ML risk scoring",
    description:
      "Machine learning models combine geological, meteorological, and hydrological data to produce calibrated risk scores with confidence intervals.",
  },
  {
    index: "03",
    title: "Severity-tiered alerts",
    description:
      "Alerts organized by severity across flood, landslide, and combined risk types, configurable by region.",
  },
  {
    index: "04",
    title: "Community intelligence",
    description:
      "Crowd-sourced ground reports with geotagged observations, road conditions, and on-the-ground situation updates from local observers.",
  },
  {
    index: "05",
    title: "Open data integration",
    description:
      "Fuses publicly available data from satellite missions, terrain models, weather agencies, and geological surveys.",
  },
  {
    index: "06",
    title: "Safety-first design",
    description:
      "Built as decision-support for evacuation planning — clear, unambiguous risk communication designed with emergency management in mind.",
  },
];

const pipelineSteps = [
  { step: "01", title: "Ingest", desc: "Satellite imagery, weather data, soil sensors, and river gauges are gathered for analysis." },
  { step: "02", title: "Analyze", desc: "Computer vision models detect terrain changes while hydrological models compute runoff and saturation projections." },
  { step: "03", title: "Score", desc: "Ensemble ML models fuse all data streams into calibrated 0–100 risk scores with confidence intervals per zone." },
  { step: "04", title: "Alert", desc: "Threshold breaches trigger severity-tiered alerts shared across dashboards and emergency coordinators." },
];

const dataSources = [
  { name: "Copernicus Sentinel-2", type: "Satellite Imagery" },
  { name: "USGS SRTM", type: "Terrain Models" },
  { name: "IMD Open Data", type: "Weather Stations" },
  { name: "ISRO Bhuvan", type: "Land Use Data" },
  { name: "CWC River Data", type: "Hydrological" },
  { name: "GSI Landslide Atlas", type: "Geological" },
];

const sampleAlerts = [
  { place: "Wayanad", detail: "Imminent landslide risk", level: "Critical", color: "var(--risk-critical)" },
  { place: "Kochi", detail: "Flash flood warning", level: "High", color: "var(--risk-high)" },
  { place: "Munnar", detail: "Slope instability", level: "Moderate", color: "var(--risk-moderate)" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav variant="transparent" activePage="" />

      <main className="flex-1 relative">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute -top-24 right-[8%] h-96 w-96 rounded-full bg-accent-subtle blur-3xl" />

          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
              <div className="lg:col-span-7 pr-0 lg:pr-10">
                <p className="eyebrow animate-fade-in mb-5">
                  Flood &amp; landslide risk intelligence
                </p>

                <h1
                  className="serif-display text-[2.75rem] sm:text-6xl lg:text-[4.25rem] font-medium leading-[1.05] tracking-tight mb-6 animate-clip-reveal"
                >
                  Disaster intelligence{" "}
                  <span className="italic text-accent">before the crisis</span>{" "}
                  hits
                </h1>

                <p className="text-lg text-text-secondary leading-relaxed max-w-xl mb-9 animate-slide-up">
                  DistraAI fuses satellite imagery, environmental sensors, and
                  machine learning to predict flood and landslide risk — giving
                  communities the time they need to act.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-8 gap-y-4 animate-slide-up">
                  <Link
                    href="/dashboard"
                    className="btn-primary px-7 py-3 text-sm inline-flex items-center gap-2.5"
                  >
                    Open dashboard
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <a href="#capabilities" className="link-editorial text-base">
                      How it works
                    </a>
                    <a href="#sources" className="link-editorial text-base text-text-secondary">
                      Data of record
                    </a>
                  </div>
                </div>

                <div className="mt-14 max-w-xl">
                  <p className="eyebrow mb-3">Field dispatch — now</p>
                  <div className="border-t border-border-subtle">
                    {sampleAlerts.map((alert) => (
                      <div
                        key={alert.place}
                        className="flex items-baseline gap-3 py-2.5 border-b border-border-subtle"
                      >
                        <span className="h-2 w-2 rounded-full shrink-0 self-center" style={{ backgroundColor: alert.color }} aria-hidden="true" />
                        <span className="font-data text-sm text-text-primary w-20 shrink-0">{alert.place}</span>
                        <span className="text-sm text-text-secondary flex-1">{alert.detail}</span>
                        <span className="eyebrow">{alert.level}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-tertiary mt-3">
                    Sample data shown for demonstration purposes.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="card p-6 animate-fade-in">
                  <div className="index-rule mb-5">
                    <span className="eyebrow">Wayanad snapshot</span>
                  </div>
                  <div className="font-data text-7xl font-bold text-risk-high leading-none serif-display tracking-tight">
                    72
                  </div>
                  <div className="font-data text-sm text-text-tertiary mt-2 mb-6">
                    / 100 · HIGH · updated 14:32 IST
                  </div>

                  <dl className="border-t border-border-subtle font-data text-sm">
                    {[
                      ["Rainfall", "127 mm / 24h"],
                      ["River level", "9.2 m"],
                      ["Monitored zones", "14"],
                      ["Elevated risk", "3"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-baseline justify-between py-2.5 border-b border-border-subtle">
                        <dt className="text-text-tertiary">{label}</dt>
                        <dd className="text-text-primary font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="text-xs leading-relaxed text-text-tertiary mt-6">
                    Scores are model estimates for planning and training only —
                    always follow official warnings from NDMA/SDMA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="py-20 lg:py-24 border-t border-border-subtle bg-bg-wash relative">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <p className="eyebrow mb-4">Capabilities</p>
              <h2 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
                Intelligence at every layer, from orbit to ground level
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {features.map((feature) => (
                <div key={feature.index} className="group">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-data text-xs text-accent">{feature.index} —</span>
                    <h3 className="serif-display text-xl font-semibold text-text-primary">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed pl-6 text-pretty">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24 border-t border-border-subtle">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <p className="eyebrow mb-4">Process</p>
              <h2 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
                From satellite to signal
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-10 gap-y-10">
              {pipelineSteps.map((item) => (
                <div key={item.step} className="border-t border-strong pt-4">
                  <div className="font-data text-sm text-accent mb-3">{item.step} /</div>
                  <h3 className="serif-display text-xl font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed text-pretty">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sources" className="py-20 lg:py-24 border-t border-border-subtle bg-bg-wash">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-6">
                <p className="eyebrow mb-4">Trust</p>
                <h2 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight mb-4">
                  Built on data of record
                </h2>
                <p className="text-text-secondary leading-relaxed max-w-md text-pretty">
                  Risk scores are grounded in publicly available data from
                  government agencies and international satellite programs —
                  every figure traceable to a named source.
                </p>
                <blockquote className="mt-8 border-l-2 border-accent pl-5">
                  <p className="serif-display text-2xl text-text-primary leading-snug">
                    A warning you can trace is a warning you can trust.
                  </p>
                </blockquote>
              </div>

              <div className="lg:col-span-6">
                <dl className="font-data text-sm">
                  {dataSources.map((source) => (
                    <div
                      key={source.name}
                      className="flex items-baseline justify-between gap-6 py-3 border-b border-border-subtle"
                    >
                      <dt className="text-text-primary font-medium">{source.name}</dt>
                      <dd className="text-text-tertiary shrink-0">{source.type}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24 border-t border-border-subtle relative overflow-hidden">
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-[60%] rounded-full bg-accent-subtle blur-3xl" />
          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 text-center">
            <p className="eyebrow mb-4">Begin</p>
            <h2 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              Start monitoring your region
            </h2>
            <p className="text-lg text-text-secondary max-w-md mx-auto mb-8 text-pretty">
              Open the dashboard to explore risk assessments, active alerts,
              and environmental data for your area.
            </p>
            <a href="/dashboard" className="link-editorial text-lg">
              Open the dashboard →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}