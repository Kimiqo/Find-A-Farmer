import fs from "fs";
import path from "path";

export async function getFarmers() {
  const filePath = path.join(process.cwd(), "src", "data", "farmers.json");
  const jsonData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(jsonData);
}