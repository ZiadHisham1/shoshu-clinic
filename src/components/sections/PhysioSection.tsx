import { copy, physioConditions, siteConfig } from "@/lib/constants";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/AnimatedContainer";
import SectionHeading from "@/components/ui/SectionHeading";

const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-figma-tab px-4 " +
  "text-sm font-semibold text-foreground transition-colors duration-150 hover:border-primary " +
  "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const PhysioSection = () => (
  <section aria-labelledby="physio-title bg-figma-tab">
    <AnimatedContainer className="space-y-4">
      <AnimatedItem>
        <SectionHeading id="physio-title">{copy.physioTitle}</SectionHeading>
      </AnimatedItem>
      <ul className="flex flex-wrap gap-3">
        {physioConditions.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <AnimatedItem>
              <a href={siteConfig.bookingUrl} className={chip}>
                <Icon className="size-5 text-primary" aria-hidden />
                {label}
              </a>
            </AnimatedItem>
          </li>
        ))}
      </ul>
    </AnimatedContainer>
  </section>
);

export default PhysioSection;
