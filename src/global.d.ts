import th from "./messages/th.json";

type Messages = typeof th;

declare global {
    // Use type safe message keys with `next-intl`
    interface IntlMessages extends Messages { }

}