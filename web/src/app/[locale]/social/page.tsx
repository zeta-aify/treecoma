import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { socialLinks, instagramPosts } from "@/lib/social-data";
import InstagramPostsGrid from "@/components/InstagramPostsGrid";

export default async function SocialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SocialContent />;
}

function SocialContent() {
  const t = useTranslations("social");

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-3">
            {t("title")}
          </h1>
          <p className="text-charcoal-light max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Instagram — Active */}
          <a
            href={socialLinks.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] rounded-2xl p-[2px] hover:shadow-xl transition-shadow"
          >
            <div className="bg-cream rounded-2xl p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-8 h-8 text-[#E1306C]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <div>
                  <h2 className="font-heading text-xl text-forest">
                    {t("instagramTitle")}
                  </h2>
                  <p className="text-sm text-charcoal-light">
                    {socialLinks.instagram.handle}
                  </p>
                </div>
              </div>
              <p className="text-sm text-charcoal-light flex-1">
                {t("instagramDesc")}
              </p>
              <div className="mt-4">
                <span className="inline-block bg-[#E1306C] text-white text-sm px-4 py-2 rounded-full font-medium group-hover:bg-[#c52760] transition-colors">
                  {t("followOnInstagram")}
                </span>
              </div>
            </div>
          </a>

          {/* TikTok — Coming Soon */}
          <div className="bg-cream-dark rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-8 h-8 text-charcoal"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.01-.3z" />
              </svg>
              <div>
                <h2 className="font-heading text-xl text-forest">
                  {t("tiktokTitle")}
                </h2>
                <p className="text-sm text-charcoal-light">
                  {socialLinks.tiktok.handle}
                </p>
              </div>
            </div>
            <p className="text-sm text-charcoal-light flex-1">
              {t("tiktokDesc")}
            </p>
            <div className="mt-4">
              <span className="inline-block bg-gold/20 text-gold-dark text-sm px-4 py-2 rounded-full font-medium">
                {t("comingSoon")}
              </span>
            </div>
          </div>

          {/* X — Coming Soon */}
          <div className="bg-cream-dark rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-8 h-8 text-charcoal"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <div>
                <h2 className="font-heading text-xl text-forest">
                  {t("xTitle")}
                </h2>
                <p className="text-sm text-charcoal-light">
                  {socialLinks.x.handle}
                </p>
              </div>
            </div>
            <p className="text-sm text-charcoal-light flex-1">{t("xDesc")}</p>
            <div className="mt-4">
              <span className="inline-block bg-gold/20 text-gold-dark text-sm px-4 py-2 rounded-full font-medium">
                {t("comingSoon")}
              </span>
            </div>
          </div>
        </div>

        {/* Instagram Feed Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl text-forest">
              {t("latestPosts")}
            </h2>
            <a
              href={socialLinks.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-forest hover:text-forest-light transition-colors"
            >
              {t("viewOnInstagram")} &rarr;
            </a>
          </div>

          <InstagramPostsGrid posts={instagramPosts} />
        </section>
      </div>
    </div>
  );
}
