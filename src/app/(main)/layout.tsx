import { SiteHeader } from "@/components/layout/site-header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
