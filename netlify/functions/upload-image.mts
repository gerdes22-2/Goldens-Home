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

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let rawBase64 = "";
    let ext = "jpg";
    let mimeType = "image/jpeg";
    let originalId = "custom-asset";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image, name, id } = body;

      if (!image) {
        return new Response(JSON.stringify({ error: "No image payload provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      originalId = id || name || "custom-asset";

      // If it is already a hosted permanent URL or local static asset path, pass through
      if (!image.startsWith("data:")) {
        return new Response(JSON.stringify({ success: true, url: image }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Extract mime type & base64 raw binary
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        ext = matches[1] === "jpeg" ? "jpg" : matches[1];
        mimeType = `image/${matches[1]}`;
        rawBase64 = matches[2];
      } else {
        rawBase64 = image.replace(/^data:[^;]+;base64,/, "");
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("image");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const fileObj = file as File;
        mimeType = fileObj.type || "image/jpeg";
        ext = mimeType.split("/")[1] || "jpg";
        const buffer = await fileObj.arrayBuffer();
        const binaryBuffer = new Uint8Array(buffer);
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const key = `blob_img_${Date.now()}_${randomSuffix}.${ext}`;

        const store = getStore("site-images");
        await store.set(key, binaryBuffer, {
          metadata: {
            contentType: mimeType,
            uploadedAt: new Date().toISOString(),
            originalId: formData.get("id")?.toString() || fileObj.name || "form-upload",
            byteLength: binaryBuffer.byteLength
          }
        });

        const permanentUrl = `/api/image?key=${key}`;
        return new Response(
          JSON.stringify({
            success: true,
            url: permanentUrl,
            key,
            storage: "netlify-blobs",
            message: "Image successfully stored in Netlify Blobs storage"
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    if (!rawBase64) {
      return new Response(JSON.stringify({ error: "Could not parse image data" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Convert to Uint8Array for binary storage
    const binaryBuffer = Uint8Array.from(atob(rawBase64), (char) => char.charCodeAt(0));
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const key = `blob_img_${Date.now()}_${randomSuffix}.${ext}`;

    // Store in Netlify Blobs 'site-images' bucket
    const store = getStore("site-images");
    await store.set(key, binaryBuffer, {
      metadata: {
        contentType: mimeType,
        uploadedAt: new Date().toISOString(),
        originalId,
        byteLength: binaryBuffer.byteLength
      }
    });

    // Permanent, domain-relative image URL
    const permanentUrl = `/api/image?key=${key}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: permanentUrl,
        key,
        storage: "netlify-blobs",
        message: "Image successfully stored in Netlify Blobs storage"
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error: any) {
    console.error("Netlify Blobs upload failed:", error);
    return new Response(
      JSON.stringify({
        error: "Blob upload failed",
        details: error?.message || String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};

export const config: Config = {
  path: "/api/upload-image"
};
