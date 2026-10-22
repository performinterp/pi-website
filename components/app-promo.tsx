import AppStoreButtons from "@/components/app-store-buttons";

interface AppPromoProps {
  heading: string;
  text: string;
}

export default function AppPromo({ heading, text }: AppPromoProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-pi-ink/10 bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="max-w-2xl">
        <h2 className="font-display text-xl text-balance text-pi-ink md:text-2xl">
          <span aria-hidden="true">📱</span> {heading}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-pi-ink/75">{text}</p>
      </div>
      <div className="self-start md:shrink-0 md:self-auto">
        <AppStoreButtons variant="light" hideSubtextOnMobile />
      </div>
    </div>
  );
}
