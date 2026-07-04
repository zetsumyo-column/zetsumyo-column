import { notFound, permanentRedirect } from "next/navigation";

import { getColumnPath } from "@/lib/column/paths";
import { getColumnById } from "@/lib/column/queries";

type LegacyColumnPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyColumnRedirect({ params }: LegacyColumnPageProps) {
  const { id } = await params;
  const column = await getColumnById(id);

  if (!column) {
    notFound();
  }

  permanentRedirect(getColumnPath(column.profiles.user_id, column.public_id));
}
