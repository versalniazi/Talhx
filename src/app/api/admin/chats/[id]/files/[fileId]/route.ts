import type { NextRequest } from "next/server";
import { fileResponse } from "@/lib/chat/files";
import { agentConversation, requireAgent } from "@/lib/chat/http";
import { getChatStore } from "@/lib/chat/store";
import { errorResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Team member views or downloads a file (signed-in cookie). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const { error: authError } = await requireAgent();
  if (authError) return authError;
  const { id, fileId } = await params;
  const { conv, error } = await agentConversation(id);
  if (error) return error;
  const file = await getChatStore().getFile(conv.id, fileId);
  if (!file) return errorResponse("File not found.", 404);
  return fileResponse(file.meta, file.data, req.nextUrl.searchParams.has("download"));
}
