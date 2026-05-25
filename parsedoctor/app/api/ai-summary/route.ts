import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ ok: true, route: "ai-summary" });
  }

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openrouter/free",
          messages: [
            {
              role: "system",
              content:
                "You are ParseDoctor, a brutal but useful World of Warcraft raid log analyst. Be concise, direct, and practical.",
            },
            {
              role: "user",
              content: `Analyze this Warcraft Logs summary:\n\n${JSON.stringify(
                body
              )}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("OPENROUTER STATUS:", response.status);
    console.log("OPENROUTER DATA:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      summary:
        data.choices?.[0]?.message?.content || "No AI summary generated.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}