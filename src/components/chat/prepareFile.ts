import { ATTACHMENT_MAX_BYTES } from "@/lib/chat/types";

const ALLOWED_EXT = /\.(png|jpe?g|webp|gif|pdf|docx?|xlsx?|csv|txt)$/i;

/**
 * Checks a chosen file and shrinks large photos (phone pictures are often 5–10 MB)
 * so they fit the 4 MB limit. Returns the file to upload, or an error message.
 */
export async function prepareFile(file: File): Promise<File | string> {
  if (!ALLOWED_EXT.test(file.name)) return "This file type isn't supported. Send an image, PDF, Word, Excel, CSV or text file.";

  const resizable = /^image\/(jpeg|png|webp)$/.test(file.type);
  if (resizable && file.size > 1.5 * 1024 * 1024) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.85));
      if (blob && blob.size < file.size) {
        file = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
      }
    } catch {
      /* fall through to the size check */
    }
  }
  if (file.size > ATTACHMENT_MAX_BYTES) return "Files must be 4 MB or smaller.";
  return file;
}
