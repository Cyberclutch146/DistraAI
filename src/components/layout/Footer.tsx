export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary" role="contentinfo">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Data Sources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Data Sources
            </h3>
            <div className="space-y-1.5 text-sm text-text-secondary">
              <p>Satellite imagery: Copernicus / Sentinel-2</p>
              <p>Terrain data: USGS SRTM</p>
              <p>Weather data: IMD Open Data Platform</p>
              <p>Soil & land use: ISRO Bhuvan</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Platform
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              {["About", "Documentation", "API Access", "Privacy Policy", "Terms of Use", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Disclaimer
            </h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Risk scores are model-generated estimates based on satellite imagery, terrain analysis,
              and environmental sensor data. They are intended as decision-support tools and do not
              replace official government warnings.{" "}
              <strong className="text-text-secondary">
                Always follow official evacuation orders from NDMA/SDMA.
              </strong>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <span className="font-semibold text-text-secondary">
              Distra<span className="text-accent">AI</span>
            </span>
            <span>·</span>
            <span>Disaster Intelligence Platform</span>
          </div>
          <div className="font-data text-xs text-text-tertiary">
            Last data refresh:{" "}
            <span className="text-text-secondary">
              {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
