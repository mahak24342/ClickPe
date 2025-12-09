import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, product, history = [] } = body;

    // Format previous messages for OpenAI
    const historyFormatted = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // System prompt with dynamic product data
    const aiMessages = [
      {
        role: "system",
        content: `
You are a helpful financial assistant.

Answer ONLY using the following product data:

Product Name: ${product.name}
APR: ${product.rate_apr}%
Minimum Income: ₹${product.min_income}
Minimum Credit Score: ${product.min_credit_score}
Description: ${product.description || "No description available."}

If the user asks something unrelated to this product, reply:
"I can only answer questions related to this loan product."
`,
      },
      ...historyFormatted,
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: aiMessages,
    });

    const answer =
      completion.choices[0].message?.content ||
      "I couldn't find an answer.";

    return Response.json({ answer });
  } catch (err) {
    console.error("AI error:", err);
    return Response.json(
      { error: "Something went wrong with the AI." },
      { status: 500 }
    );
  }
}
