import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="page">
        <h1 className="title">ページが見つかりません</h1>
        <p className="muted mt-3">
          リンクが無効か、ページが削除された可能性があります。
        </p>
        <Link href="/" className="link mt-6 inline-block">
          コラム一覧に戻る
        </Link>
      </div>
    </>
  );
}
