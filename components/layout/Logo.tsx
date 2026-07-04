import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 select-none", className)}
    >
      <span className="grid size-8 place-items-center rounded-xl gradient-primary text-white text-sm font-bold shadow-[0_4px_12px_-2px_rgba(88,92,226,0.4)]">
        F
      </span>
      <span className="text-lg font-bold tracking-tight text-ink">
        {BRAND.name}
      </span>
    </Link>
  );
}
