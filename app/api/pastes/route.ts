import { NextResponse } from "next/server";
import { Paste } from "@/lib/models/Paste";
import { nanoid } from "nanoid";
import connectToDatabase from "@/lib/db";

export async function POST(req: Request) {
  await connectToDatabase();

  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const slug = nanoid(8);

  let expiresAt;
  if (ttl_seconds) {
    expiresAt = new Date(Date.now() + ttl_seconds * 1000);
  }

  const paste = await Paste.create({
    content,
    slug,
    maxViews: max_views,
    expiresAt,
  });

  return NextResponse.json({
    id: paste.slug,
    url: `${process.env.MONGODB_URI}/p/${paste.slug}`,
  });
}
