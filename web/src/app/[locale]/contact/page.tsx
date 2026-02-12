import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("contact");

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-12 text-center">
          {t("title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Map & Address */}
          <div>
            {/* Google Maps embed placeholder */}
            <div className="rounded-2xl overflow-hidden mb-6 bg-cream-dark h-64 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5!2d100.5!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBan%20Passarelli!5e0!3m2!1sen!2sth!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ban Passarelli location"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-xl text-forest mb-1">
                  {t("addressTitle")}
                </h3>
                <p className="text-charcoal-light text-sm">
                  Ban Passarelli, Thailand
                </p>
                <a
                  href="https://maps.google.com/?q=Ban+Passarelli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm font-medium text-forest hover:text-forest-light transition-colors underline"
                >
                  {t("directionsBtn")} &rarr;
                </a>
              </div>

              <div>
                <h3 className="font-heading text-xl text-forest mb-1">
                  {t("hoursTitle")}
                </h3>
                <p className="text-charcoal-light text-sm">{t("hours")}</p>
                <p className="text-terracotta text-sm font-medium">
                  {t("closed")}
                </p>
              </div>
            </div>
          </div>

          {/* Chat with us */}
          <div className="bg-cream-dark rounded-2xl p-8">
            <h2 className="font-heading text-2xl text-forest mb-2">
              {t("chatTitle")}
            </h2>
            <p className="text-charcoal-light text-sm mb-6">
              {t("chatSubtitle")}
            </p>

            <div className="space-y-4">
              <a
                href="https://line.me/ti/p/~banpassarelli"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#06C755] text-white font-medium hover:bg-[#05b34d] transition-colors"
              >
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                {t("line")}
              </a>

              <a
                href="https://wa.me/66XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
              >
                <svg
                  className="w-6 h-6 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("whatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
