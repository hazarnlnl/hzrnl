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

  // Ensure the newest featured image appears in second position
  const FEATURED_SECOND = "img1.5.png";
  const featuredIndex = files.indexOf(FEATURED_SECOND);
  if (featuredIndex > -1 && featuredIndex !== 1) {
    files.splice(featuredIndex, 1);
    files.splice(1, 0, FEATURED_SECOND);
  }

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
