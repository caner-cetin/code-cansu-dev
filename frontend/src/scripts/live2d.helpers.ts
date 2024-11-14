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

export const Live2D = {
	showMessage: (options: MessageOptions): void => {
		live2dShowMessage(options.text, options.timeout);
	},
};

// https://github.com/stevenjoezhang/live2d-widget/blob/master/src/message.js
function live2dShowMessage(text: string | string[], timeout: number): void {
	if (localStorage.getItem(States.DISPLAYING_WAIFU_TIPS)) return;
	if (messageTimer) {
		clearTimeout(messageTimer);
		messageTimer = null;
	}
	const selectedText = randomSelection(text);
	const tips = document.getElementById("waifu-tips");
	if (tips) {
		tips.innerHTML = selectedText as string;
		tips.classList.add("waifu-tips-active");
		localStorage.setItem(States.DISPLAYING_WAIFU_TIPS, "1");
		messageTimer = setTimeout(() => {
			localStorage.removeItem(States.DISPLAYING_WAIFU_TIPS);
			tips.classList.remove("waifu-tips-active");
		}, timeout);
	}
}
