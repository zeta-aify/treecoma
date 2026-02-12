import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/restaurant/terrace-garden-view.jpg"
          alt="Ban Passarelli terrace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {t("heroTitle")}
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-white/90 drop-shadow">
            {t("heroSubtitle")}
          </p>
          <Link
            href="/menu"
            className="inline-block bg-terracotta hover:bg-terracotta-dark text-white px-8 py-3 rounded-full text-lg font-medium transition-colors shadow-lg"
          >
            {t("heroCta")}
          </Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-forest mb-6">
            {t("storyTitle")}
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed max-w-2xl mx-auto">
            {t("storyText")}
          </p>
        </div>
      </section>

      {/* Featured / From Our Kitchen */}
      <section className="py-16 bg-cream-dark px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl text-forest mb-3">
              {t("featuredTitle")}
            </h2>
            <p className="text-charcoal-light">{t("featuredSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden bg-cream shadow-md">
              <div className="relative h-56">
                <Image
                  src="/images/menu/menu-pizza-classic.jpg"
                  alt="Classic Pizza"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-forest mb-1">
                  Artisan Pizza
                </h3>
                <p className="text-sm text-charcoal-light">
                  Hand-stretched dough, San Marzano sauce, fresh mozzarella
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-cream shadow-md">
              <div className="relative h-56">
                <Image
                  src="/images/menu/menu-pasta.jpg"
                  alt="Homemade Pasta"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-forest mb-1">
                  Homemade Pasta
                </h3>
                <p className="text-sm text-charcoal-light">
                  Traditional recipes, fresh ingredients, made daily
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-cream shadow-md">
              <div className="relative h-56">
                <Image
                  src="/images/restaurant/coffee-dessert-cannabis.jpg"
                  alt="Coffee & Dessert"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl text-forest mb-1">
                  Coffee & Dessert
                </h3>
                <p className="text-sm text-charcoal-light">
                  Italian espresso, tiramisù, homemade cakes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/restaurant/exterior-ban-passarelli-sign.jpg"
                alt="Ban Passarelli exterior"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-forest mb-4">
                {t("locationTitle")}
              </h2>
              <p className="text-charcoal-light mb-6 leading-relaxed">
                Come visit our terrace restaurant surrounded by nature. Enjoy
                authentic Italian food, fresh coffee, and the warmth of our
                family.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                {t("locationCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
