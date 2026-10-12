import { Post } from "./types";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "app/content/posts");

export function getAllPosts(): Post[] {
  try {
    const files = fs.readdirSync(postsDir);
    const posts: Post[] = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const fullPath = path.join(postsDir, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        return JSON.parse(fileContents) as Post;
      });
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

export function getPostsByKind(kind: "blog" | "guide") {
  return getAllPosts().filter((post) => post.kind === kind);
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}
