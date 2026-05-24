import type { Language } from "./languages";

export type LanguageMessages = {
  error: Record<string, string>;
  etc: {
    dark_btn: string;
  };
};

const languageFiles: Record<Language, string> = {
  ar: "ar",
  de: "de",
  en: "en",
  fr: "fr",
  ja: "ja",
  ko: "ko",
  "zh-cn": "zh_cn",
  "zh-tw": "zh_tw",
};

const languageLoaders = import.meta.glob<LanguageMessages>("../langs/*.json", {
  import: "default",
});

export const fallbackMessages: LanguageMessages = {
  error: {
    unknown:
      "An unknown error has occurred. The exact cause is unknown. Please contact the administrator.",
  },
  etc: {
    dark_btn: "Toggle Light/Dark Mode",
  },
};

export async function loadLanguageMessages(language: Language) {
  const fileName = languageFiles[language];
  const loader = languageLoaders[`../langs/${fileName}.json`];

  if (!loader) {
    return fallbackMessages;
  }

  return loader();
}
