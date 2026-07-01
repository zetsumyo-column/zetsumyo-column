import Link from "next/link";
import { redirect } from "next/navigation";

import { ColumnForm } from "@/components/column/column-form";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function NewColumnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">コラムを投稿</h1>
          <p className="mt-2 text-sm text-zinc-500">
            文字数制限を選んで、絶妙なコラムを書きましょう
          </p>
        </div>

        <ColumnForm />

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            コラム一覧に戻る
          </Link>
        </p>
      </div>
    </>
  );
}
