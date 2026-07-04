import { notFound, permanentRedirect } from "next/navigation";

import { getColumnEditPath, getColumnPath } from "@/lib/column/paths";
import { getColumnById } from "@/lib/column/queries";

type LegacyEditColumnPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyEditColumnRedirect({
  params,
}: LegacyEditColumnPageProps) {
  const { id } = await params;
  const column = await getColumnById(id);

  if (!column) {
    notFound();
  }

  const { user_id } = column.profiles;

  if (column.status === "draft") {
    permanentRedirect(getColumnEditPath(user_id, column.public_id));
  }

  permanentRedirect(getColumnPath(user_id, column.public_id));
}
