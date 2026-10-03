import { Code2, Megaphone, MapPin, PenLine, Search, Share2, type LucideProps } from "lucide-react";
import type { ServiceIcon as IconName } from "@/data/services";
import type { PackageCategory } from "@/data/packages";

const ICONS = { search: Search, "map-pin": MapPin, pen: PenLine, share: Share2, megaphone: Megaphone, code: Code2 };

export function ServiceIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" {...props} />;
}

export const CATEGORY_ICON: Record<PackageCategory, IconName> = {
  seo: "search",
  "local-seo": "map-pin",
  content: "pen",
  social: "share",
  advertising: "megaphone",
  growth: "code",
};
