import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  return (
    <div className="py-12 sm:py-20">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center mb-16">
        <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-6">
          {t("title")}
        </h1>
        <p className="text-lg text-charcoal-light leading-relaxed max-w-2xl mx-auto">
          {t("intro")}
        </p>
      </section>

      {/* Family section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src="/images/restaurant/family-terrace-cannabis.jpg"
              alt="The Passarelli family"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-heading text-3xl text-forest mb-4">
              {t("familyTitle")}
            </h2>
            <p className="text-charcoal-light leading-relaxed">
              {t("familyText")}
            </p>
          </div>
        </div>
      </section>

      {/* Food section */}
      <section className="bg-cream-dark py-16 mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-heading text-3xl text-forest mb-4">
                {t("foodTitle")}
              </h2>
              <p className="text-charcoal-light leading-relaxed">
                {t("foodText")}
              </p>
            </div>
            <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden order-1 md:order-2">
              <Image
                src="/images/restaurant/restaurant-interior.jpg"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cannabis section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden">
            <Image
              src="/images/restaurant/terrace-greenery.jpg"
              alt="Organic cannabis garden"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-heading text-3xl text-forest mb-4">
              {t("cannabisTitle")}
            </h2>
            <p className="text-charcoal-light leading-relaxed">
              {t("cannabisText")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
