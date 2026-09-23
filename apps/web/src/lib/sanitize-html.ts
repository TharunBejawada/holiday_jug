import sanitizeHtml from "sanitize-html";

// Applied server-side on every save of admin-authored rich text (hero
// descriptions, "why visit" copy, FAQ answers, etc.) as defense-in-depth
// against stored XSS — allowlisted to exactly what the TipTap editor's
// toolbar can produce.
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "s", "u", "code", "pre",
      "h2", "h3", "h4",
      "ul", "ol", "li",
      "blockquote",
      "a", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
