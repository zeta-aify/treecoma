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

      {/* Guest Spotlight / Review */}
      <section className="py-16 sm:py-24 bg-cream-dark px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-terracotta uppercase tracking-wider mb-2">
              From Our Guests
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl text-forest">
              A Taste Worth Traveling For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/chocolate-cake-review.jpg"
                alt="Chocolate Cake at Bân Passarelli — handmade Italian dessert in Chiang Mai"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <p className="text-white text-sm font-medium">
                  Chocolate Cake &middot; 89฿
                </p>
              </div>
            </div>

            <div>
              <div className="bg-cream rounded-2xl p-6 sm:p-8 shadow-md">
                <svg className="w-8 h-8 text-terracotta/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-charcoal leading-relaxed mb-4 text-lg italic">
                  &ldquo;I came for the pizza and stayed for the desserts. The Chocolate Cake
                  is dangerously good — rich, moist, and perfectly bitter.
                  But the real hidden gem? The House Cake. Absolutely incredible.
                  It&apos;s one of those things you can&apos;t find anywhere else in Chiang Mai.
                  Angela and the family make everything from scratch, and you can taste it.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-cream-dark">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-sm">
                    AF
                  </div>
                  <div>
                    <p className="font-medium text-charcoal text-sm">Andreas F.</p>
                    <p className="text-xs text-charcoal-light">Developer &middot; Stockholm, Sweden</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full bg-forest/10 text-forest font-medium">Best desserts in Chiang Mai</span>
                <span className="text-xs px-3 py-1 rounded-full bg-forest/10 text-forest font-medium">Italian bakery</span>
                <span className="text-xs px-3 py-1 rounded-full bg-forest/10 text-forest font-medium">Homemade cakes</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-charcoal-light text-sm mb-4 max-w-xl mx-auto">
              Every cake, every dessert, every slice of bread at Bân Passarelli is baked fresh daily
              by Angela and her family. No shortcuts, no pre-mixes — just real Italian recipes
              passed down through generations, made with love in the heart of Chiang Mai.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              See Our Full Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
