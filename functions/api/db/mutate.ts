import { applyCloudMutation, CloudflareEnv, readCloudDb, writeCloudDb } from '../_sharedDb';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export const onRequestPost = async (context: { request: Request; env: CloudflareEnv }) => {
  try {
    const payload = await context.request.json();
    const current = await readCloudDb(context.env);
    const updated = applyCloudMutation(current, payload);
    const saved = await writeCloudDb(context.env, updated);
    return new Response(JSON.stringify({ success: true, data: saved }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid mutation payload', detail: String(err) }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
};
