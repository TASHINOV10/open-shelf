import { apiFetch } from "./client";

export async function getFrontStats() {
  return apiFetch("/front_stats/stats");
}
