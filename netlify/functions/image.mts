import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Range",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  const url = new URL(req.url);
  const key = url.searchParams.get("key") || url.pathname.split("/").pop();

  if (!key || key === "image") {
    return new Response("Missing image key parameter", {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const store = getStore("site-images");
    const blob = await store.getWithMetadata(key, { type: "arrayBuffer" });

    if (!blob || !blob.data) {
      return new Response("Requested image not found in Blob storage", {
        status: 404,
        headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" }
      });
    }

    const contentType = (blob.metadata as any)?.contentType || "image/jpeg";

    return new Response(blob.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
        "ETag": `"${key}"`
      }
    });
  } catch (error: any) {
    console.error("Failed to retrieve image from Netlify Blobs:", error);
    return new Response("Internal error retrieving image blob", {
      status: 500,
      headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" }
    });
  }
};

export const config: Config = {
  path: "/api/image"
};
