import Link from "next/link";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link href={href} className={className ? `link ${className}` : "link"}>
      {children}
    </Link>
  );
}
