import { handleGet, handlePost } from "./votes.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/votes") {
      if (request.method === "GET") return handleGet({ env });
      if (request.method === "POST") return handlePost({ request, env });
      return new Response("Method not allowed", { status: 405 });
    }

    // Alles andere: statische Dateien aus /public
    return env.ASSETS.fetch(request);
  },
};
