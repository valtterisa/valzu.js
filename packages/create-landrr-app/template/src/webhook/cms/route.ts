import { revalidateTag } from "@landrr/core";

interface WebhookContext {
  request: Request;
}

interface CmsPayload {
  secret?: string;
  slug?: string;
}

export async function POST(ctx: WebhookContext) {
  const payload = (await ctx.request.json()) as CmsPayload;
  if (payload.secret !== process.env.CMS_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  if (!payload.slug) {
    return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  await revalidateTag(`post:${payload.slug}`);
  await revalidateTag("blog");
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
