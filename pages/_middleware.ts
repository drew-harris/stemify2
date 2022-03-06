import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as config from "../config.json";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Before march 7th
  if (Date.now() < config.releaseDate) {
    const url = req.nextUrl.clone();
    url.pathname = "/closed";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
