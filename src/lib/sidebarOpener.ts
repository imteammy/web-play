"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "sidebar:state";

export async function getSidebarOpener() {
  return cookies().get(COOKIE_NAME)?.value === "true";
}

export async function setSidebarOpener(open: boolean) {
  cookies().set(COOKIE_NAME, String(open));
}
