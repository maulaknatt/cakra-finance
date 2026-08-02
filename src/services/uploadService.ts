import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export class UploadService {
  static async uploadFile(file: File): Promise<UploadResult> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists in public/
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() || "bin";
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = join(uploadDir, uniqueFileName);

    // Save to disk
    await writeFile(filePath, buffer);

    return {
      fileName: file.name,
      fileUrl: `/uploads/${uniqueFileName}`,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
    };
  }
}
