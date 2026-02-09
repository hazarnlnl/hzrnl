export type WorkItem = {
  id: string;
  imageUrl: string;
  alt: string | null;
};
import fs from "fs";
import path from "path";

const WORKS_DIR = path.join(process.cwd(), "public", "works");
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp)$/i;

export function getWorks(): WorkItem[] {
  let files: string[] = [];

  try {
    files = fs.readdirSync(WORKS_DIR).filter((file) => IMAGE_EXT_REGEX.test(file));
  } catch {
    // If the folder doesn't exist yet, just return empty
    return [];
  }

  // Basic alphabetical order by filename
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  return files.map((file) => {
    const base = path.parse(file).name;
    const alt =
      base
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || null;

    return {
      id: file,
      imageUrl: `/works/${file}`,
      alt,
    };
  });
}
