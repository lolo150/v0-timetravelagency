import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  const imageDir = join(process.cwd(), "public/images");
  const names = [
    "agency.jpg",
    "paris-1889.jpg",
    "cretaceous.jpg",
    "florence-1504.jpg",
    "hero-bg.jpg",
  ];

  const results: Record<string, string> = {};

  for (const name of names) {
    const filePath = join(imageDir, name);
    if (!existsSync(filePath)) {
      results[name] = `NOT FOUND: ${filePath}`;
      continue;
    }

    const fileBuffer = readFileSync(filePath);
    const blob = await put(`timetravel/${name}`, fileBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    results[name] = blob.url;
  }

  return NextResponse.json(results);
}
