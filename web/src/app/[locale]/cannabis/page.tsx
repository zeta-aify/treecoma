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

        {/* Licensed Cultivation & Compliance */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl sm:text-4xl text-forest mb-3">
              {t("complianceTitle")}
            </h2>
            <p className="text-charcoal-light leading-relaxed max-w-2xl mx-auto">
              {t("complianceIntro")}
            </p>
          </div>

          {/* License Details */}
          <div className="bg-cream-dark rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-forest">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-charcoal-light mb-1">{t("licenseLabel")}</p>
                <p className="font-heading text-xl text-forest">{t("licenseNumber")}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-charcoal-light pl-14">
              <p>{t("licenseAuthority")}</p>
              <p>{t("licenseValidity")}</p>
              <p>{t("licenseLaw")}</p>
            </div>
          </div>

          {/* Cultivation & Quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-cream-dark rounded-2xl p-6">
              <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-forest">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-1.687.282-3.404.354-5.113.216l-.544-.044c-1.153-.093-2.21-.658-2.928-1.56l-.357-.446" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">
                {t("environmentTitle")}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                {t("environmentText")}
              </p>
            </div>

            <div className="bg-cream-dark rounded-2xl p-6">
              <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-forest">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">
                {t("qualityTitle")}
              </h3>
              <ul className="text-sm text-charcoal-light space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-forest mt-0.5">&#10003;</span>
                  {t("qualityItem1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest mt-0.5">&#10003;</span>
                  {t("qualityItem2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest mt-0.5">&#10003;</span>
                  {t("qualityItem3")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest mt-0.5">&#10003;</span>
                  {t("qualityItem4")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest mt-0.5">&#10003;</span>
                  {t("qualityItem5")}
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Framework */}
          <div className="bg-forest/5 border border-forest/10 rounded-2xl p-6 text-center">
            <h3 className="font-heading text-lg text-forest mb-2">
              {t("frameworkTitle")}
            </h3>
            <p className="text-sm text-charcoal-light leading-relaxed max-w-2xl mx-auto">
              {t("frameworkText")}
            </p>
          </div>
        </div>

        {/* Medical License Holder CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-forest rounded-2xl p-8 sm:p-10 text-center text-white">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl mb-3">
              Have a Medical Cannabis License?
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto leading-relaxed">
              We grow premium organic cannabis strains on our family farm in Chiang Mai.
              If you hold a valid Thai medical cannabis license, chat with us directly
              to learn about our available strains, pricing, and visit our garden.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://line.me/ti/p/@898awkbw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#06C755] hover:bg-[#05b34d] text-white font-medium transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                Chat on LINE
              </a>
              <a
                href="https://wa.me/66950579660?text=Hi%2C%20I%20have%20a%20medical%20cannabis%20license%20and%20would%20like%20to%20learn%20about%20your%20strains."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
            <p className="text-white/50 text-xs mt-4">
              Valid Thai medical cannabis license required. For informational purposes only.
            </p>
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
