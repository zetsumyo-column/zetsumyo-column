export function getColumnPath(userId: string, publicId: string): string {
  return `/${userId}/${publicId}`;
}

export function getColumnEditPath(userId: string, publicId: string): string {
  return `/${userId}/${publicId}/edit`;
}
