import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import CannabisInquiryForm from "@/components/CannabisInquiryForm";

export default async function CannabisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CannabisContent />;
}

function CannabisContent() {
  const t = useTranslations("cannabis");

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-3">
            {t("title")}
          </h1>
          <p className="text-charcoal-light mb-6">{t("subtitle")}</p>
          <div className="inline-block bg-terracotta/10 border border-terracotta/30 rounded-xl px-6 py-3">
            <p className="text-sm text-terracotta-dark">{t("disclaimer")}</p>
          </div>
        </div>

        {/* Cannabis showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image
              src="/images/restaurant/family-terrace-cannabis.jpg"
              alt="Treecoma organic cannabis"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image
              src="/images/restaurant/terrace-greenery.jpg"
              alt="Cannabis garden"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-cream-dark rounded-2xl p-8">
            <h2 className="font-heading text-2xl text-forest mb-2">
              {t("inquiryTitle")}
            </h2>
            <p className="text-charcoal-light text-sm mb-6">
              {t("inquirySubtitle")}
            </p>
            <CannabisInquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
