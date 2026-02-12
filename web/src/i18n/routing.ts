import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en", "it"],
  defaultLocale: "th",
  localePrefix: "as-needed",
});
