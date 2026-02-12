import { setRequestLocale } from "next-intl/server";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 prose prose-forest">
        <h1 className="font-heading text-4xl text-forest">
          Legal & Disclaimers
        </h1>

        <section className="mb-12">
          <h2 className="font-heading text-2xl text-forest">
            Cannabis Disclaimer
          </h2>
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-6 not-prose">
            <p className="text-sm text-charcoal leading-relaxed">
              As of June 2025, cannabis has been re-restricted in Thailand to
              medical-only use under the supervision of licensed practitioners.
              Recreational cannabis use, sale, and online distribution are
              prohibited under Thai law.
            </p>
            <p className="text-sm text-charcoal leading-relaxed mt-3">
              All cannabis-related content on this website is provided for{" "}
              <strong>informational purposes only</strong>. No cannabis products
              are available for purchase through this website. Visitors
              interested in medical cannabis should consult with a licensed
              healthcare professional and visit our location in person.
            </p>
            <p className="text-sm text-charcoal leading-relaxed mt-3">
              Treecoma operates in full compliance with Thai cannabis
              regulations.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl text-forest">Terms of Service</h2>
          <p className="text-charcoal-light">
            By using this website and placing food orders, you agree to the
            following terms:
          </p>
          <ul className="text-charcoal-light">
            <li>
              All food orders are subject to availability and operating hours
              (Wednesday–Monday, 11:00–22:00, closed Tuesdays).
            </li>
            <li>
              Prices are in Thai Baht (THB) and may change without prior notice.
            </li>
            <li>
              Payment is accepted via PromptPay. Orders are confirmed upon
              payment verification.
            </li>
            <li>
              Delivery availability and timing depend on your location. Contact
              us for delivery coverage area.
            </li>
            <li>
              We reserve the right to cancel orders in cases of payment issues or
              ingredient unavailability.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-2xl text-forest">Privacy Policy</h2>
          <p className="text-charcoal-light">
            Ban Passarelli respects your privacy. Here is how we handle your
            information:
          </p>
          <ul className="text-charcoal-light">
            <li>
              <strong>What we collect:</strong> Name, phone number, email
              (optional), and delivery address when you place an order or submit
              an inquiry.
            </li>
            <li>
              <strong>How we use it:</strong> To process your orders, respond to
              inquiries, and contact you about your order status.
            </li>
            <li>
              <strong>Data sharing:</strong> We do not sell or share your
              personal information with third parties.
            </li>
            <li>
              <strong>Data storage:</strong> Your information is stored securely
              on Supabase servers and retained only as long as necessary for
              order fulfillment and legal compliance.
            </li>
            <li>
              <strong>Your rights:</strong> You may request deletion of your
              personal data by contacting us via LINE or WhatsApp.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-forest">Contact</h2>
          <p className="text-charcoal-light">
            For legal questions or data requests, contact us through LINE or
            WhatsApp (links available on every page via the chat button).
          </p>
        </section>
      </div>
    </div>
  );
}
