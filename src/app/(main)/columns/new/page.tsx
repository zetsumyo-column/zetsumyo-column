import { redirect } from "next/navigation";

import { ColumnForm } from "@/components/column/column-form";
import { BackLink } from "@/components/ui/back-link";
import { getAuthUser } from "@/lib/supabase/auth";

export default async function NewColumnPage() {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="page">
      <header className="mb-8">
        <h1 className="title">コラムを投稿</h1>
        <p className="muted mt-2">
          700文字以上1,400文字以内で投稿、または下書き保存できます
        </p>
      </header>

      <ColumnForm />

      <BackLink href="/" className="mt-8 block text-center">
        コラム一覧に戻る
      </BackLink>
    </div>
  );
}
