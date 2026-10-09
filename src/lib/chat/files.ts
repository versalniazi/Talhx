import "server-only";
import { randomUUID } from "node:crypto";
import { ATTACHMENT_MAX_BYTES, ATTACHMENT_TYPES, type ChatAttachment } from "./types";
import { sanitizeText } from "@/lib/sanitize";

const EXT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  txt: "text/plain",
};

/** Check the file's real content matches its type, so renamed or disguised files are rejected. */
function signatureOk(buf: Buffer, type: string) {
  const hex = buf.subarray(0, 8).toString("hex");
  switch (type) {
    case "image/png":
      return hex.startsWith("89504e470d0a1a0a");
    case "image/jpeg":
      return hex.startsWith("ffd8ff");
    case "image/gif":
      return buf.subarray(0, 4).toString("ascii") === "GIF8";
    case "image/webp":
      return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
    case "application/pdf":
      return buf.subarray(0, 5).toString("ascii") === "%PDF-";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return hex.startsWith("504b0304"); // zip container
    case "application/msword":
    case "application/vnd.ms-excel":
      return hex.startsWith("d0cf11e0a1b11ae1"); // legacy Office
    case "text/csv":
    case "text/plain":
      return !buf.subarray(0, 8192).includes(0); // no binary content
    default:
      return false;
  }
}

export type ValidatedFile = { meta: ChatAttachment; data: Buffer };

/** Validate an uploaded file. Returns an error message, or the file ready to store. */
export async function validateUpload(entry: FormDataEntryValue | null): Promise<{ error: string } | ValidatedFile> {
  if (!(entry instanceof File) || entry.size === 0) return { error: "Please choose a file." };
  if (entry.size > ATTACHMENT_MAX_BYTES) return { error: "Files must be 4 MB or smaller." };

  const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
  const type = EXT_TYPES[ext];
  if (!type || !ATTACHMENT_TYPES[type]) {
    return { error: "This file type isn't supported. Send an image, PDF, Word, Excel, CSV or text file." };
  }
  const data = Buffer.from(await entry.arrayBuffer());
  if (!signatureOk(data, type)) return { error: "This file appears to be damaged or isn't the type its name suggests." };

  const base = sanitizeText(entry.name, 120).replace(/[\\/:*?"<>|]+/g, "_") || `file.${ext}`;
  return {
    data,
    meta: { id: randomUUID(), name: base, type, size: data.length, isImage: type.startsWith("image/") },
  };
}

/** HTTP response serving a stored file safely (no script execution, correct download name). */
export function fileResponse(meta: ChatAttachment, data: Buffer, download: boolean) {
  const inline = meta.isImage && !download;
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": meta.type,
      "Content-Length": String(data.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(meta.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
