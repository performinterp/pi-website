import { useId } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  imagePosition?: string;
  mobileImagePosition?: string;
  tall?: boolean;
  /** Hide the subtitle on small screens (subtitle still renders on md+). */
  hideSubtitleOnMobile?: boolean;
}

export default function PageHero({ title, subtitle, backgroundImage, imagePosition, mobileImagePosition, tall, hideSubtitleOnMobile }: PageHeroProps) {
  const desktopPos = imagePosition ?? "center";
  const mobilePos = mobileImagePosition ?? desktopPos;
  const reactId = useId();
  const heroId = `hero-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <section
      id={heroId}
      className={`relative w-full overflow-hidden bg-pi-navy ${tall ? "min-h-[70vh]" : "min-h-[55vh]"}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {backgroundImage ? (
        <style>{`
          #${heroId} { background-position: ${mobilePos}; }
          @media (min-width: 768px) {
            #${heroId} { background-position: ${desktopPos}; }
          }
        `}</style>
      ) : null}
      {backgroundImage ? (
        <>
          {/* Subtle full-image tint to keep the brightest highlights from blowing out type */}
          <div className="absolute inset-0 bg-pi-navy/15" />
          {/* Bottom-up scrim — darkens the lower portion where the text sits */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(2,1,66,0.88) 0%, rgba(2,1,66,0.7) 30%, rgba(2,1,66,0.35) 55%, rgba(2,1,66,0.1) 75%, transparent 100%)",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pi-deep to-pi-navy" />
      )}

      {/* Content drives section height — no separate min-h on the section */}
      <div className={`section-padding relative z-10 flex flex-col justify-end pt-24 pb-3 md:pb-5 lg:pb-8 xl:pb-12 ${tall ? "min-h-[70vh] md:pt-40" : "min-h-[55vh] md:pt-32"}`}>
        <div className="max-w-3xl">
          <h1
            className="font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 1px 4px rgba(2,1,66,0.35)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl ${
                hideSubtitleOnMobile ? "hidden md:block" : ""
              }`}
              style={{ textShadow: "0 1px 3px rgba(2,1,66,0.25)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
