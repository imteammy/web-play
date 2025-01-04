import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix } from "./i18n/navigation";
import { locales } from "./i18n/config";

export default createMiddleware({
  locales: locales,
  localePrefix: localePrefix,
  defaultLocale: defaultLocale,
});

export const config = {
  matcher: ["/", "/(th|en)/:path*"],
};
