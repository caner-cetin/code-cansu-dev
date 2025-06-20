import { States } from "@/services/settings";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function randomSelection(obj: Array<any> | any): any {
  return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
}

let messageTimer: ReturnType<typeof setTimeout> | null = null;

interface MessageOptions {
  text: string | string[];
  timeout: number;
}
