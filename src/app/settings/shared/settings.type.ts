import { SettingsConfig } from "../settings.config";

export interface SettingsStateModel {
	language: keyof typeof SettingsConfig.LANGUAGES;
	currency: keyof typeof SettingsConfig.CURRENCIES;
	wordlistLanguage: keyof typeof SettingsConfig.WORDLIST_LANGUAGES;
	darkMode: boolean;
}
