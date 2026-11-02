import { request } from "./apiClient";

export interface ContactPayload {
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
}

// POST /product/contact
export async function sendContact(data: ContactPayload): Promise<{ ok: boolean }> {
  await request("/product/contact", {
    method: "POST",
    body: JSON.stringify({
      fullName: data.name,
      phone: data.phone,
      email: data.email ?? "",
      topic: data.topic,
      content: data.message,
    }),
  });
  return { ok: true };
}