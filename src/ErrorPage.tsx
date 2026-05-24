import { useEffect, useState } from "react";

import "./ErrorPage.css";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh-cn", label: "简体中文" },
  { value: "zh-tw", label: "繁體中文" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
] as const;

type Language = (typeof languageOptions)[number]["value"];

type LanguageMessages = {
  error: Record<string, string>;
  etc: {
    dark_btn: string;
  };
};

type ErrorPageProps = {
  errorCode?: string;
};

const supportedLanguages = languageOptions.map(({ value }) => value);

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

const languageLoaders = import.meta.glob<LanguageMessages>("./langs/*.json", {
  import: "default",
});

const fallbackMessages: LanguageMessages = {
  error: {
    unknown:
      "An unknown error has occurred. The exact cause is unknown. Please contact the administrator.",
  },
  etc: {
    dark_btn: "Toggle Light/Dark Mode",
  },
};

function isSupportedLanguage(value: string): value is Language {
  return supportedLanguages.some((language) => language === value);
}

function getInitialLanguage(): Language {
  try {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.error("Failed to get initial language", error);
  }

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

function getInitialMode(): boolean {
  try {
    return localStorage.getItem("darkMode") === "true";
  } catch (error) {
    console.error("Failed to get initial mode", error);
    return false;
  }
}

async function loadLanguageMessages(language: Language) {
  const fileName = languageFiles[language];
  const loader = languageLoaders[`./langs/${fileName}.json`];

  if (!loader) {
    return fallbackMessages;
  }

  return loader();
}

function updateThemeColor(color: string) {
  let metaThemeColor = document.querySelector<HTMLMetaElement>(
    "meta[name='theme-color']",
  );

  if (!metaThemeColor) {
    metaThemeColor = document.createElement("meta");
    metaThemeColor.name = "theme-color";
    document.head.appendChild(metaThemeColor);
  }

  metaThemeColor.content = color;
}

function updateFavicon() {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

  if (!link) {
    link = document.createElement("link");
    document.head.appendChild(link);
  }

  link.type = "image/png";
  link.rel = "shortcut icon";
  link.href = "/res/favicon/1.png";
}

export default function ErrorPage({ errorCode }: ErrorPageProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [darkBtnText, setDarkBtnText] = useState(fallbackMessages.etc.dark_btn);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [darkMode, setDarkMode] = useState(getInitialMode);

  useEffect(() => {
    let isCurrent = true;

    async function loadCurrentLanguage() {
      try {
        const messages = await loadLanguageMessages(language);

        if (!isCurrent) {
          return;
        }

        const errorKey = errorCode ?? "unknown";
        setErrorMessage(messages.error[errorKey] ?? messages.error.unknown);
        setDarkBtnText(messages.etc.dark_btn);
      } catch (error) {
        console.error("Failed to load language file", error);

        if (isCurrent) {
          setErrorMessage(fallbackMessages.error.unknown);
          setDarkBtnText(fallbackMessages.etc.dark_btn);
        }
      }
    }

    void loadCurrentLanguage();

    return () => {
      isCurrent = false;
    };
  }, [language, errorCode]);

  useEffect(() => {
    document.title = errorCode ? `Error ${errorCode}` : "Unknown Error";
    updateFavicon();
    updateThemeColor("#d3a281");
  }, [errorCode]);

  function handleLanguageChange(value: Language) {
    setLanguage(value);

    try {
      localStorage.setItem("language", value);
    } catch (error) {
      console.error("Failed to set language", error);
    }
  }

  function toggleDarkMode() {
    setDarkMode((previousMode) => {
      const nextMode = !previousMode;

      try {
        localStorage.setItem("darkMode", String(nextMode));
      } catch (error) {
        console.error("Failed to set dark mode", error);
      }

      return nextMode;
    });
  }

  return (
    <div className={`error-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <img
        src={errorCode ? "/res/characters/1.png" : "/res/characters/2.png"}
        alt="캐릭터"
        className="error-image"
      />
      <div className="error-message">{errorCode ?? "Unknown Page"}</div>
      <p className="error-detail">{errorMessage}</p>

      <div className="settings-container">
        <select
          aria-label="Language"
          className="language-select"
          value={language}
          onChange={(event) =>
            handleLanguageChange(event.currentTarget.value as Language)
          }
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="mode-button" type="button" onClick={toggleDarkMode}>
          {darkBtnText}
        </button>
      </div>
    </div>
  );
}
