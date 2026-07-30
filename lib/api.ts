import type { History } from "./types";

export async function getHistory(): Promise<History[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const data = [{ id: "1", prompt: "Hello, GPT", imageUrl: "/images (1).jpeg", createdAt: new Date().toISOString() }, { id: "2", prompt: "Hello, GPT", imageUrl: "/images.jpeg", createdAt: new Date().toISOString() }];
  return Array.isArray(data) ? (data as History[]): [];
};

  // if (!baseUrl) {
  //   return [{ id: "fallback", prompt: "No history available", imageUrl: null, createdAt: new Date().toISOString() }];
  // }

//   const response = await fetch(`${baseUrl}/history`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch history: ${response.statusText}`);
//   }

//   const data = await response.json() || [{ id: "1", prompt: "Hello, GPT", imageUrl: "None", createdAt: new Date().toISOString() }, { id: "2", prompt: "Hello, GPT", imageUrl: "None", createdAt: new Date().toISOString() }];
//   return Array.isArray(data) ? (data as History[]) : [];
// }   
