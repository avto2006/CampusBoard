import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// "approved" = განცხადება მაშინვე ჩანს საიტზე.
// მოდერაციის გასაკეთებლად შეცვალე "pending"-ით და Supabase-ში ხელით დაამტკიცე.
const DEFAULT_STATUS = "approved";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type === "teammate" ? "teammate" : "event";

    if (type === "event") {
      if (!body.title?.trim() || !body.description?.trim()) {
        return NextResponse.json({ error: "სათაური და აღწერა სავალდებულოა" }, { status: 400 });
      }

      const { error } = await supabase.from("events").insert([
        {
          title: body.title.trim(),
          description: body.description.trim(),
          category: body.category || "სხვა",
          organizer: body.university || "სხვა",
          date: body.date || "თარიღი მალე დაზუსტდება",
          event_date: body.date || null,
          location: body.location?.trim() || "ონლაინ",
          link: body.link?.trim() || "#",
          status: DEFAULT_STATUS,
        },
      ]);

      if (error) {
        console.error("events insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      if (!body.author?.trim() || !body.contact?.trim() || !body.title?.trim()) {
        return NextResponse.json({ error: "სახელი, ივენთი და კონტაქტი სავალდებულოა" }, { status: 400 });
      }

      const { error } = await supabase.from("teammates").insert([
        {
          author: body.author.trim(),
          university: body.university || "სხვა",
          role_needed: body.role_needed?.trim() || "მეწყვილე",
          title: body.title.trim(),
          description: body.description?.trim() || "",
          contact: body.contact.trim(),
          status: DEFAULT_STATUS,
        },
      ]);

      if (error) {
        console.error("teammates insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("auto-add error:", err);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}