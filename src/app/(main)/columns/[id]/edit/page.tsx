import { notFound, redirect } from "next/navigation";

import { ColumnForm } from "@/components/column/column-form";
import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { BackLink } from "@/components/ui/back-link";
import { getProfileDraftsPath } from "@/lib/profile/paths";
import { getAuthUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { Column } from "@/types/database";

type EditColumnPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditColumnPage({ params }: EditColumnPageProps) {
  const { id } = await params;
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const [{ data: column, error }, { data: profile }] = await Promise.all([
    supabase
      .from("columns")
      .select("id, title, content, status, author_id")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("profiles").select("user_id").eq("id", user.id).single(),
  ]);

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
    <div className="page">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="title">下書きを編集</h1>
          <p className="muted mt-2">下書き保存または公開できます</p>
        </div>
        <DeleteColumnButton columnId={column.id} />
      </div>

      <ColumnForm column={column as Pick<Column, "id" | "title" | "content" | "status">} />

      <BackLink
        href={profile?.user_id ? getProfileDraftsPath(profile.user_id) : "/"}
        className="mt-8 block text-center"
      >
        下書き一覧に戻る
      </BackLink>
    </div>
  );
}
