// Photo storage. Uses the R2 bucket bound as PHOTOS_R2 when it exists, otherwise the KV
// namespace bound as PHOTOS. Keys are photo ids; the database keeps the metadata.

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_PHOTOS_PER_WORK = 6;

export async function putPhoto(env, id, file) {
  const body = await file.arrayBuffer();
  if (env.PHOTOS_R2) {
    await env.PHOTOS_R2.put(id, body, { httpMetadata: { contentType: file.type } });
  } else if (env.PHOTOS) {
    await env.PHOTOS.put(id, body, { metadata: { type: file.type } });
  } else {
    throw new Error("Photo storage is not configured");
  }
  return body.byteLength;
}

export async function deletePhoto(env, id) {
  if (env.PHOTOS_R2) await env.PHOTOS_R2.delete(id);
  else if (env.PHOTOS) await env.PHOTOS.delete(id);
}

// Returns a Response with the image, or null if missing.
export async function photoResponse(env, id, contentType, cacheControl) {
  let body = null;
  if (env.PHOTOS_R2) {
    const obj = await env.PHOTOS_R2.get(id);
    body = obj ? obj.body : null;
  } else if (env.PHOTOS) {
    body = await env.PHOTOS.get(id, { type: "stream" });
  }
  if (!body) return null;
  return new Response(body, {
    headers: {
      "content-type": contentType || "image/jpeg",
      "cache-control": cacheControl,
      "x-content-type-options": "nosniff",
    },
  });
}
