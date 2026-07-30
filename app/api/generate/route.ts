import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const chatId = data.get("chatId") as string;
    const prompt = data.get("prompt") as string;
    const mode = data.get("generationMode") as string || "textToImage";
    
    // Process files... (Assume uploadedUrls is an array of strings parsed from your cloud bucket)
    const uploadedUrls = [
      { storageUrl: "https://bucket.com", fileName: "sample.png", fileSizeBytes: 2048, mimeType: "image/png" }
    ];

    // Single DB operation writing the user message + nested attachments + updating chat metadata
    const updatedConversation = await prisma.conversation.update({
      where: { id: chatId },
      data: {
        lastGenerationMode: mode, // Automatically sync cache string on the conversation row
        messages: {
          create: {
            role: "user",
            content: prompt,
            attachments: {
              createMany: {
                data: uploadedUrls, // Inserts all attachment objects concurrently
              },
            },
          },
        },
      },
    });

    // 1. [Trigger your AI model generation engine API request here...]
    const aiReplyText = "Here is your generated asset variation output text!";

    // 2. Insert AI response into the database
    await prisma.message.create({
      data: {
        conversationId: chatId,
        role: "assistant",
        content: aiReplyText,
      }
    });

    return Response.json({ success: true, reply: aiReplyText });
  } catch (error) {
    return Response.json({ error: "Write operation collapsed" }, { status: 500 });
  }
}
