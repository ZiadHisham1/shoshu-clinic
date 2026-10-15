import { Flower2 } from "lucide-react";

const LotusDivider = () => (
  <div role="separator" className="flex items-center gap-3 text-primary/70">
    <span className="flex-1 border-t border-dashed border-border" />
    <Flower2 className="size-5" aria-hidden />
    <span className="flex-1 border-t border-dashed border-border" />
  </div>
);

export default LotusDivider;
