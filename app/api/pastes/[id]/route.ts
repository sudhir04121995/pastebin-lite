
import { NextRequest, NextResponse } from "next/server";
import { Paste } from "@/lib/models/Paste";
import { connectDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // ✅ MUST await
    console.log("Fetching paste:", id);

    const paste = await Paste.findOne({ slug: id }); // ❌ NO .lean()

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    if (!paste.isAvailable()) {
      return NextResponse.json({ error: "Paste expired or max views reached" }, { status: 404 });
    }

    await paste.incrementViews();

    return NextResponse.json({
      content: paste.content,
      views: paste.views,
      remaining_views: paste.maxViews ? paste.maxViews - paste.views : null,
      expiresAt: paste.expiresAt,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
