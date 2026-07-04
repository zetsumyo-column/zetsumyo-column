import { notFound, redirect } from "next/navigation";

import { ColumnForm } from "@/components/column/column-form";
import { DeleteColumnButton } from "@/components/column/delete-column-button";
import { BackLink } from "@/components/ui/back-link";
import { getColumnPath } from "@/lib/column/paths";
import { getColumnByUserAndPublicId } from "@/lib/column/queries";
import { getProfileDraftsPath } from "@/lib/profile/paths";
import { getAuthUser } from "@/lib/supabase/auth";
import type { Column } from "@/types/database";

type EditColumnPageProps = {
  params: Promise<{ user_id: string; public_id: string }>;
};

export default async function EditColumnPage({ params }: EditColumnPageProps) {
  const { user_id, public_id } = await params;
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const column = await getColumnByUserAndPublicId(user_id, public_id);

  if (!column) {
    notFound();
  }

  if (column.author_id !== user.id) {
    notFound();
  }

  if (column.status !== "draft") {
    redirect(getColumnPath(user_id, public_id));
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

      <ColumnForm
        column={
          column as Pick<Column, "id" | "title" | "content" | "status">
        }
      />

      <BackLink href={getProfileDraftsPath(user_id)} className="mt-8 block text-center">
        下書き一覧に戻る
      </BackLink>
    </div>
  );
}
