import { NextResponse } from "next/server";
import { concatUint8Arrays } from "@/src/utils/streamToBuffer";
import { scrapeHtml } from "@/src/utils/scrapeHtml";

export const POST = async (req: Request, context: any) => {
  const body = req.body as any;
  try {
    const reader = body.getReader();

    let chunks = [];
    let streamComplete = false;

    while (!streamComplete) {
      const { value, done } = await reader.read();
      if (done) {
        streamComplete = true;
      } else {
        chunks.push(value);
      }
    }

    let data = new TextDecoder().decode(concatUint8Arrays(chunks));
    const resultBuffer = await scrapeHtml(data);
    
    const response = new Response(resultBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="walmart.xlsx"',
        'x-version': '123',
      },
    });

    return response;
  } catch (error) {
    console.error("Error reading stream", error);
    return NextResponse.json({ error: "Error reading stream" }, { status: 500 });
  }
};
