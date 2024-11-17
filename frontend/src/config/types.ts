export interface LanguageConfig {
	defaultText: string;
	mode: string;
	runnerName: string;
	/**
	 * The class name of the icon to display for this language.
	 * @example
	 * ```ts
	 * <i class="devicon-visualbasic-plain"></i>
	 * ```
	 *
	 * To change the size, change the <i>'s `font-size`.
	 * @see https://devicon.dev/
	 *
	 */
	iconClass: string | undefined;
	languageName: string;
}