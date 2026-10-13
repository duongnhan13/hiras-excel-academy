import { CloudflareEnv, DbState, readCloudDb, writeCloudDb } from './_sharedDb';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export const onRequestGet = async (context: { env: CloudflareEnv }) => {
  try {
    const state = await readCloudDb(context.env);
    return new Response(JSON.stringify(state), { status: 200, headers: jsonHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to read DB', detail: String(err) }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: CloudflareEnv }) => {
  try {
    const incoming = (await context.request.json()) as Partial<DbState>;
    const saved = await writeCloudDb(context.env, incoming as DbState);
    return new Response(JSON.stringify(saved), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON or write error', detail: String(err) }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
};
