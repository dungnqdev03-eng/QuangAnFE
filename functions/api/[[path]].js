const BACKEND = "https://quanganbe.onrender.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const target = BACKEND + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set("Origin", BACKEND);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  return fetch(target, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    redirect: "manual",
  });
}