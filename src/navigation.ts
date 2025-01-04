import { createNavigation as c } from "next-intl/navigation";

export type LocalePrefix = "as-needed" | "always" | "never";
export type Locale = 'en' | 'th'

export const locales: Locale[] = ["en", "th"];
export const defaultLocale: Locale = "th";
export const localePrefix: LocalePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } = c({
    locales,
    localePrefix,
    defaultLocale: 'th'
});