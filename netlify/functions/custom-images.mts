import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  const store = getStore("site-metadata");

  if (req.method === "GET") {
    try {
      const manifest = await store.get("custom_images_manifest", { type: "json" });
      return new Response(JSON.stringify(manifest || {}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }

  if (req.method === "POST") {
    try {
      const payload = await req.json();
      await store.setJSON("custom_images_manifest", payload || {});
      return new Response(JSON.stringify({ success: true, count: Object.keys(payload || {}).length }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: "Failed to persist custom image manifest", details: err?.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { "Access-Control-Allow-Origin": "*" }
  });
};

export const config: Config = {
  path: "/api/custom-images"
};
