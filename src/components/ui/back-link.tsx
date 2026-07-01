import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
      }
    >
      <ArrowLeftIcon className="h-4 w-4 shrink-0" aria-hidden />
      {children}
    </Link>
  );
}
