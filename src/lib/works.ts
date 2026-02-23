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

  // Swap 3rd and 4th: img12.5 before img12
  const i3 = files.indexOf("img12.5.png");
  const i4 = files.indexOf("img12.png");
  if (i3 > -1 && i4 > -1 && i3 > i4) {
    [files[i3], files[i4]] = [files[i4], files[i3]];
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
