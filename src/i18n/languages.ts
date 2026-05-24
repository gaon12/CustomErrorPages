export const languageOptions = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh-cn", label: "简体中文" },
  { value: "zh-tw", label: "繁體中文" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
] as const;

export type Language = (typeof languageOptions)[number]["value"];

const supportedLanguages = languageOptions.map(({ value }) => value);

export function isSupportedLanguage(value: string): value is Language {
  return supportedLanguages.some((language) => language === value);
}

export function getBrowserLanguage() {
  const navigatorWithUserLanguage = navigator as Navigator & {
    userLanguage?: string;
  };

  const browserLanguage = (
    navigator.language ||
    navigatorWithUserLanguage.userLanguage ||
    "en"
  ).toLowerCase();

  if (isSupportedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  const languagePrefix = browserLanguage.split("-")[0];
  return (
    languageOptions.find((option) => option.value.startsWith(languagePrefix))
      ?.value ?? "en"
  );
}
