export const metadata = {
  title: "Get PI Events on your phone",
  description:
    "Download the PI Events app on iPhone or Android. Free, works on Samsung, Sony, OnePlus, Huawei, Motorola, Xiaomi, Google Pixel and more.",
};

const IOS_URL = "https://apps.apple.com/gb/app/pi-events/id6760933712";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=uk.co.performanceinterpreting.app";

const buttonClasses =
  "btn-shimmer group inline-flex items-center gap-3 rounded-full bg-pi-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-pi-accent/40 hover:scale-[1.03]";

export default function GetAppChoosePage() {
  return (
    <main className="section-padding flex min-h-[60vh] items-center justify-center py-16">
      {/* ─── BreadcrumbList ──────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://performanceinterpreting.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Get App", item: "https://performanceinterpreting.co.uk/get-app/" },
              { "@type": "ListItem", position: 3, name: "Choose Store", item: "https://performanceinterpreting.co.uk/get-app/choose/" },
            ],
          }),
        }}
      />

      {/* ─── WebPage ─────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://performanceinterpreting.co.uk/get-app/choose/#webpage",
            url: "https://performanceinterpreting.co.uk/get-app/choose/",
            name: "Get PI Events on your phone",
            description:
              "Download the PI Events app on iPhone or Android. Free, works on Samsung, Sony, OnePlus, Huawei, Motorola, Xiaomi, Google Pixel and more.",
            inLanguage: "en-GB",
            datePublished: "2026-06-02",
            dateModified: "2026-06-02",
            isPartOf: { "@id": "https://performanceinterpreting.co.uk/#website" },
            about: { "@id": "https://performanceinterpreting.co.uk/#pi-events-app" },
          }),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
          The PI Events App
        </p>
        <h1 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
          Get PI Events on your phone
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pi-ink/70">
          Tap the right button for your phone.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href={IOS_URL} className={buttonClasses} aria-label="Download PI Events on the App Store">
            iPhone — App Store
          </a>
          <a
            href={ANDROID_URL}
            className={buttonClasses}
            aria-label="Download PI Events on the Google Play Store"
          >
            Any other phone — Play Store
          </a>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-pi-ink/60">
          The Google Play Store is already installed on Samsung, Sony, OnePlus,
          Huawei, Motorola, Xiaomi and Google Pixel phones — no need to download it first.
        </p>
      </div>
    </main>
  );
}
