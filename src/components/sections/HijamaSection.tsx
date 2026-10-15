import { Clock, Droplets } from "lucide-react";
import { copy, siteConfig } from "@/lib/constants";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/AnimatedContainer";
import ServiceRow from "@/components/ui/ServiceRow";

const HijamaSection = () => (
  <section aria-label={copy.hijamaTitle}>
    <AnimatedContainer className="space-y-3">
      <AnimatedItem>
        <ServiceRow title={copy.hijamaTitle} subtitle={copy.hijamaSubtitle} icon={Droplets} />
      </AnimatedItem>
    </AnimatedContainer>
  </section>
);

export default HijamaSection;
