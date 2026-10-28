import { HelpCarousel } from "@/components/help/help-carousel";
import { HelpSteps } from "@/components/help/help-steps";

export function HowToHelp() {
  return (
    <section
      id="como-ayudar"
      aria-labelledby="como-ayudar-titulo"
      className="overflow-x-clip px-4 pb-32 pt-24 sm:px-6 md:pt-32"
    >
      <div className="mx-auto max-w-[1240px]">
        <HelpCarousel />
        <HelpSteps />
      </div>
    </section>
  );
}
