// app/api/ai/ask/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient"; // Use server client here
import OpenAI from "openai";

// 1️⃣ Zod schema for request validation
const requestSchema = z.object({
  productId: z.string(),
  message: z.string(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

// 2️⃣ Initialize OpenAI client (server-side)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 3️⃣ Validate request body
    const { productId, message, history } = requestSchema.parse(body);

    // 4️⃣ Fetch product from Supabase
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { answer: "Product not found." },
        { status: 404 }
      );
    }

    // 5️⃣ Construct AI prompt
    const prompt = `
You are a helpful assistant for a loan product.
Product info: ${JSON.stringify(product, null, 2)}
Answer the user's question strictly based on this product info. 
If the question is unrelated, politely say you can't answer.
User question: "${message}"
`;

    // 6️⃣ Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    // 7️⃣ Extract answer
    const answer = completion.choices[0]?.message?.content ?? "I cannot answer that.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { answer: "Something went wrong." },
      { status: 500 }
    );
  }
}
