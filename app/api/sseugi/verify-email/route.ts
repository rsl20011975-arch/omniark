import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, verifyEmailAddress } from "@/lib/sseugi-account";
export async function GET(request:NextRequest){const email=normalizeEmail(request.nextUrl.searchParams.get("email")),token=request.nextUrl.searchParams.get("token")||"";const verified=email&&await verifyEmailAddress(email,token);return NextResponse.redirect(new URL(`/korean/sseugi?emailVerification=${verified?"success":"failed"}`,request.url));}
