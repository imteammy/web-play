"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "sidebar:state";

export async function getSidebarOpener() {
  return (await cookies()).get(COOKIE_NAME)?.value === "true";
}

export async function setSidebarOpener(open: boolean) {
  (await cookies()).set(COOKIE_NAME, String(open));
}
