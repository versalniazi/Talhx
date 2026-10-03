import { cn } from "@/lib/format";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  dark?: boolean;
}

export function SectionHeading({ eyebrow, title, description, align = "left", as: Tag = "h2", className, dark }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="eyebrow">
          <span className={cn("h-px w-6", dark ? "bg-volt-300/60" : "bg-volt-500/60")} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "mt-4 text-[2rem] leading-[1.1] sm:text-[2.6rem] lg:text-5xl lg:tracking-[-0.03em]",
          dark ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-white/65" : "text-ink-600/90")}>{description}</p>
      )}
    </div>
  );
}
