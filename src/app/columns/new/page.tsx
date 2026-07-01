import { redirect } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { ColumnForm } from "@/components/column/column-form";
import { SiteHeader } from "@/components/layout/site-header";
import { BackLink } from "@/components/ui/back-link";
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
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <PencilSquareIcon className="h-6 w-6" aria-hidden />
            コラムを投稿
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            700文字以上1,400文字以内で投稿、または下書き保存できます
          </p>
        </div>

        <ColumnForm />

        <p className="mt-8 text-center">
          <BackLink href="/">コラム一覧に戻る</BackLink>
        </p>
      </div>
    </>
  );
}
