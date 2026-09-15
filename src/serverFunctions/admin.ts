import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readJson, writeJson, type Order, type Product, type SiteContent } from "@/lib/store";

const SESSION_COOKIE = "labelle_admin_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function adminSecret(): string {
  return process.env["ADMIN_SECRET"] || "dev-secret-change-me";
}

function adminPassword(): string {
  return process.env["ADMIN_PASSWORD"] || "admin";
}

function sign(payload: string): string {
  return createHmac("sha256", adminSecret()).update(payload).digest("base64url");
}

function buildToken(expiresAt: number): string {
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = sign(exp);
  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (header ?? "").split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim());
  }
  return out;
}

function assertAdmin(): void {
  const request = getRequest();
  const cookies = parseCookies(request.headers.get("cookie"));
  if (!verifyToken(cookies[SESSION_COOKIE])) {
    throw new Error("Não autorizado");
  }
}

export const loginSession = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(({ data }) => {
    if (data.password !== adminPassword()) {
      return { ok: false as const, reason: "Senha incorreta" };
    }
    const token = buildToken(Date.now() + MAX_AGE * 1000);
    setResponseHeader(
      "Set-Cookie",
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`,
    );
    return { ok: true as const };
  });

export const logoutSession = createServerFn({ method: "POST" }).handler(() => {
  setResponseHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return { ok: true };
});

export const getSession = createServerFn({ method: "GET" }).handler(() => {
  const request = getRequest();
  const cookies = parseCookies(request.headers.get("cookie"));
  return { authed: verifyToken(cookies[SESSION_COOKIE]) };
});

// Pedidos

export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
  assertAdmin();
  const orders = await readJson<Order[]>("orders", []);
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
});

export const createOrder = createServerFn({ method: "POST" })
  .validator(
    (data: Omit<Order, "id" | "createdAt" | "status">) => data,
  )
  .handler(async ({ data }) => {
    const orders = await readJson<Order[]>("orders", []);
    const order: Order = {
      ...data,
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      status: "novo",
    };
    orders.push(order);
    await writeJson("orders", orders);
    return { ok: true, id: order.id };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: Order["status"] }) => data)
  .handler(async ({ data }) => {
    assertAdmin();
    const orders = await readJson<Order[]>("orders", []);
    const order = orders.find((o) => o.id === data.id);
    if (!order) throw new Error("Pedido não encontrado");
    order.status = data.status;
    await writeJson("orders", orders);
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    assertAdmin();
    const orders = await readJson<Order[]>("orders", []);
    await writeJson(
      "orders",
      orders.filter((o) => o.id !== data.id),
    );
    return { ok: true };
  });

// Produtos

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  assertAdmin();
  return (await readJson<Product[]>("products", [])).sort((a, b) => a.order - b.order);
});

export const getPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  return (await readJson<Product[]>("products", []))
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);
});

export const saveProduct = createServerFn({ method: "POST" })
  .validator(
    (data: { product: Product }) => data,
  )
  .handler(async ({ data }) => {
    assertAdmin();
    const products = await readJson<Product[]>("products", []);
    const index = products.findIndex((p) => p.id === data.product.id);
    if (index === -1) {
      products.push(data.product);
    } else {
      products[index] = data.product;
    }
    await writeJson(
      "products",
      products.sort((a, b) => a.order - b.order),
    );
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    assertAdmin();
    const products = await readJson<Product[]>("products", []);
    await writeJson(
      "products",
      products.filter((p) => p.id !== data.id),
    );
    return { ok: true };
  });

// Conteúdo do site

const DEFAULT_CONTENT: SiteContent = {
  heroTagline: "Papelaria e personalizados para momentos inesquecíveis.",
  heroParagraph: "Transformamos suas ideias em detalhes que fazem toda a diferença.",
  aboutText:
    "Na La'Belle Ateliê, cada detalhe é criado com carinho para transformar momentos especiais em memórias únicas.",
  testimonials: [
    "Ficou ainda mais lindo do que eu imaginava!",
    "Cada detalhe ficou perfeito.",
    "Atendimento maravilhoso e trabalho impecável.",
  ],
};

export const getContent = createServerFn({ method: "GET" }).handler(async () => {
  assertAdmin();
  return readJson<SiteContent>("content", DEFAULT_CONTENT);
});

export const getPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const content = await readJson<SiteContent>("content", DEFAULT_CONTENT);
  return {
    ...DEFAULT_CONTENT,
    ...content,
    testimonials: content.testimonials?.length ? content.testimonials : DEFAULT_CONTENT.testimonials,
  };
});

export const saveContent = createServerFn({ method: "POST" })
  .validator((data: { content: SiteContent }) => data)
  .handler(async ({ data }) => {
    assertAdmin();
    await writeJson("content", data.content);
    return { ok: true };
  });