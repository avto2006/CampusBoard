import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    
    // უსაფრთხოების გასაღების შემოწმება (რომ სხვამ ვერავინ გამოაგზავნოს)
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, organizer, category, date, location, link } = body;

    if (!title || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ავტომატურად ჩაწერილი ივენთი მიდის pending სტატუსით (შენს დასტურამდე)
    const { data, error } = await supabase.from("events").insert([
      {
        title,
        description,
        organizer: organizer || "Auto Aggregator",
        category: category || "ჰაკათონი",
        date: date || "ახლახანს გამოქვეყნდა",
        location: location || "თბილისი / ონლაინ",
        link,
        status: "pending",
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ message: "Successfully queued for review", data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}