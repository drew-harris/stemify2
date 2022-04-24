import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import config from "../config";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Before march 7th

  return NextResponse.next();
}
