import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import config from "../config";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Before march 7th
  //
  if (Date.now() < config.releaseDate && !req.url.includes("/storage/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/closed";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
