const DEFAULT_BLOB_MEDIA_URL = "https://6xft9z0vzph7qrfh.public.blob.vercel-storage.com";

const localMediaPaths: Record<string, string> = {
  "/media/services/Little%20Giant%20Labs%20-%20service-01.mp4": "/media/Little%20Giant%20Labs%20-%20service-01.mp4",
  "/media/services/Little%20Giant%20Labs%20-%20service-02.mp4": "/media/Little%20Giant%20Labs%20-%20service-02.mp4",
  "/media/services/Little%20Giant%20Labs%20-%20service-03.mp4": "/media/Little%20Giant%20Labs%20-%20service-03.mp4",
};

/** Resolve a Blob media URL to a local public asset outside production. */
export function resolveMediaUrl(blobUrl: string): string {
  if (process.env.NODE_ENV === "production") return blobUrl;

  const url = new URL(blobUrl);
  const blobMediaUrl = process.env.NEXT_PUBLIC_BLOB_MEDIA_URL || DEFAULT_BLOB_MEDIA_URL;
  if (url.origin !== new URL(blobMediaUrl).origin) return blobUrl;

  const localPath = localMediaPaths[url.pathname];
  if (!localPath) return blobUrl;

  return `${localPath}${url.search}${url.hash}`;
}
