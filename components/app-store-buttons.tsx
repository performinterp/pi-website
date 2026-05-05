import Link from "next/link";

interface AppStoreButtonsProps {
  /** @deprecated retained for backward compatibility — link now resolves via /get-app */
  iosUrl?: string;
  /** @deprecated retained for backward compatibility — link now resolves via /get-app */
  androidUrl?: string;
  variant?: "light" | "dark";
  /** Hide the "works on iPhone & any other phone" subtext on small screens. */
  hideSubtextOnMobile?: boolean;
}

export default function AppStoreButtons({
  variant = "dark",
  hideSubtextOnMobile = false,
}: AppStoreButtonsProps) {
  const isDark = variant === "dark";

  const buttonClasses = isDark
    ? "btn-shimmer group inline-flex items-center gap-3 rounded-full bg-pi-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-pi-accent/40 hover:scale-[1.03]"
    : "btn-shimmer group inline-flex items-center gap-3 rounded-full bg-pi-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-pi-accent/30 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-pi-accent/40 hover:scale-[1.03]";

  const subtextBase = isDark
    ? "mt-3 text-xs font-medium text-white/60"
    : "mt-3 text-xs font-medium text-pi-ink/60";
  const subtextClasses = hideSubtextOnMobile
    ? `${subtextBase} hidden md:block`
    : subtextBase;

  return (
    <div className="flex flex-col items-center">
      <Link href="/get-app" className={buttonClasses} aria-label="Download the PI Events App">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="currentColor"
          className="shrink-0"
          aria-hidden="true"
        >
          <path d="M17 1H7a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3Zm-5 20a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm6-4H6V4h12v13Z" />
        </svg>
        Download the App
      </Link>
      <p className={subtextClasses}>
        Free — works on iPhone &amp; any other phone
      </p>
    </div>
  );
}
