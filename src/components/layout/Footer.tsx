import Link from "next/link";

const platformLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Map", href: "/map" },
  { label: "Alerts", href: "/alerts" },
  { label: "Community", href: "/community" },
  { label: "Reports", href: "/reports" },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-border-subtle bg-bg-wash"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="eyebrow mb-3">Data Sources</h3>
            <div className="space-y-1.5 text-sm text-text-secondary">
              <p>Satellite imagery: Copernicus / Sentinel-2</p>
              <p>Terrain data: USGS SRTM</p>
              <p>Weather data: IMD Open Data Platform</p>
              <p>Soil & land use: ISRO Bhuvan</p>
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Platform</h3>
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-3">Note</h3>
            <div className="rounded-xl bg-bg-surface border border-border-subtle px-4 py-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                Risk scores are model-generated estimates based on satellite
                imagery, terrain analysis, and environmental sensor data.
                They are decision-support tools and do not replace official
                government warnings.{" "}
                <strong className="text-text-primary">
                  Always follow official evacuation orders from NDMA/SDMA.
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <span className="serif-display font-semibold text-text-primary">
              Distra<span className="text-accent italic">AI</span>
            </span>
            <span>·</span>
            <span>Disaster Intelligence Platform</span>
          </div>
          <div className="font-data text-xs text-text-tertiary">
            Displayed values are sample data for demonstration purposes.
          </div>
        </div>
      </div>
    </footer>
  );
}