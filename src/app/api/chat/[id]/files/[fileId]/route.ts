import type { NextRequest } from "next/server";
import { fileResponse } from "@/lib/chat/files";
import { visitorConversation } from "@/lib/chat/http";
import { getChatStore } from "@/lib/chat/store";
import { errorResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Visitor downloads a file from their own conversation (token in x-chat-token header). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const { id, fileId } = await params;
  const { conv, error } = await visitorConversation(req, id);
  if (error) return error;
  const file = await getChatStore().getFile(conv.id, fileId);
  if (!file) return errorResponse("File not found.", 404);
  return fileResponse(file.meta, file.data, req.nextUrl.searchParams.has("download"));
}
