import { blobMediaBaseUrl, localMediaPathsByBlobPath } from "@/lib/media-paths";

/** Keep a remote media URL in production; use an explicit local mapping elsewhere. */
export function resolveRemoteMediaUrl(url: string): string {
  if (process.env.NODE_ENV === "production") return url;

  let parsedUrl: URL;
  let blobOrigin: string;
  try {
    parsedUrl = new URL(url);
    blobOrigin = new URL(process.env.NEXT_PUBLIC_BLOB_MEDIA_URL || blobMediaBaseUrl).origin;
  } catch {
    return url;
  }

  if (parsedUrl.origin !== blobOrigin) return url;

  const localPath = localMediaPathsByBlobPath[parsedUrl.pathname];
  if (!localPath) return url;

  return `${localPath}${parsedUrl.search}${parsedUrl.hash}`;
}

/** Keep an already-local public media path unchanged in every environment. */
export function resolveLocalMediaPath(path: string): string {
  return path;
}
