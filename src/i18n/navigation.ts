import { createNavigation as c } from "next-intl/navigation";
import { type Locale, type LocalePrefix, locales } from "./config";

export const defaultLocale: Locale = "th";
export const localePrefix: LocalePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } = c({
  locales,
  localePrefix,
  defaultLocale: "th",
});
