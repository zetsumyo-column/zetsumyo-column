import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ColumnForm } from "@/components/column/column-form";
import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Column } from "@/types/database";

type EditColumnPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditColumnPage({ params }: EditColumnPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: column, error } = await supabase
    .from("columns")
    .select("id, title, content, status, author_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !column) {
    notFound();
  }

  if (column.author_id !== user.id) {
    notFound();
  }

  if (column.status !== "draft") {
    redirect(`/columns/${id}`);
  }

  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">下書きを編集</h1>
            <p className="mt-2 text-sm text-zinc-500">
              下書き保存または公開できます
            </p>
          </div>
          <DeleteColumnButton columnId={column.id} />
        </div>

        <ColumnForm column={column as Pick<Column, "id" | "title" | "content" | "status">} />

        <p className="mt-8 text-center">
          <Link
            href="/mypage"
            className="text-sm text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            マイページに戻る
          </Link>
        </p>
      </div>
    </>
  );
}
