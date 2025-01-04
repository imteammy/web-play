import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales } from "./navigation";

export default createMiddleware({
  locales: locales,
  localePrefix: localePrefix,
  defaultLocale: defaultLocale,
});

export const config = {
  matcher: ["/", "/(th|en)/:path*"],
};