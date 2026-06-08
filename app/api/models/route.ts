import { NextResponse } from "next/server";
import { readModels } from "@/lib/data";

export async function GET() {
  const models = await readModels();

  return NextResponse.json(models);
}
