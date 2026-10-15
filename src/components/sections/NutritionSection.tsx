import { Stethoscope } from "lucide-react";
import { copy } from "@/lib/constants";
import { AnimatedContainer, AnimatedItem } from "@/components/ui/AnimatedContainer";
import ServiceRow from "@/components/ui/ServiceRow";

const NutritionSection = () => (
  <section aria-label={copy.nutritionTitle}>
    <AnimatedContainer>
      <AnimatedItem>
        <ServiceRow
          title={copy.nutritionTitle}
          badge={copy.nutritionBadge}
          icon={Stethoscope}
        />
      </AnimatedItem>
    </AnimatedContainer>
  </section>
);

export default NutritionSection;
