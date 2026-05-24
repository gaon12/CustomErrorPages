import { useEffect, useState } from "react";
import { getPageQueryParams } from "./config/queryParams";
import {
  getStoredDarkMode,
  getStoredLanguage,
  saveDarkMode,
  saveLanguage,
} from "./config/storage";
import {
  getBrowserLanguage,
  type Language,
  languageOptions,
} from "./i18n/languages";
import { fallbackMessages, loadLanguageMessages } from "./i18n/messages";
import { publicAssetPath } from "./utils/assets";
import { updateFavicon, updateThemeColor } from "./utils/documentHead";
import "./ErrorPage.css";

type ErrorPageProps = {
  errorCode?: string;
};

function getInitialLanguage(): Language {
  return getStoredLanguage() ?? getBrowserLanguage();
}

function getInitialDarkMode() {
  const storedDarkMode = getStoredDarkMode();

  if (storedDarkMode !== undefined) {
    return storedDarkMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ErrorPage({ errorCode }: ErrorPageProps) {
  const { customMessage, homeUrl } = getPageQueryParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [darkBtnText, setDarkBtnText] = useState(fallbackMessages.etc.dark_btn);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    let isCurrent = true;

    async function loadCurrentLanguage() {
      try {
        const messages = await loadLanguageMessages(language);

        if (!isCurrent) {
          return;
        }

        const errorKey = errorCode ?? "unknown";
        setErrorMessage(
          customMessage ?? messages.error[errorKey] ?? messages.error.unknown,
        );
        setDarkBtnText(messages.etc.dark_btn);
      } catch (error) {
        console.error("Failed to load language file", error);

        if (isCurrent) {
          setErrorMessage(customMessage ?? fallbackMessages.error.unknown);
          setDarkBtnText(fallbackMessages.etc.dark_btn);
        }
      }
    }

    void loadCurrentLanguage();

    return () => {
      isCurrent = false;
    };
  }, [language, errorCode, customMessage]);

  useEffect(() => {
    document.title = errorCode ? `Error ${errorCode}` : "Unknown Error";
    updateFavicon();
    updateThemeColor("#d3a281");
  }, [errorCode]);

  function handleLanguageChange(value: Language) {
    setLanguage(value);
    saveLanguage(value);
  }

  function toggleDarkMode() {
    setDarkMode((previousMode) => {
      const nextMode = !previousMode;
      saveDarkMode(nextMode);
      return nextMode;
    });
  }

  return (
    <main
      className={`error-container ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <fieldset className="settings-container">
        <legend className="sr-only">Page settings</legend>
        <label className="language-field">
          <span className="sr-only">Language</span>
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
        </label>
        <button
          className="icon-button"
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkBtnText}
          title={darkBtnText}
        >
          {darkMode ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 18.5A6.5 6.5 0 1 0 12 5.5a6.5 6.5 0 0 0 0 13Z" />
              <path d="M12 1.75v2.5M12 19.75v2.5M4.75 4.75l1.75 1.75M17.5 17.5l1.75 1.75M1.75 12h2.5M19.75 12h2.5M4.75 19.25 6.5 17.5M17.5 6.5l1.75-1.75" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M20.5 15.25A8.6 8.6 0 0 1 8.75 3.5 8.6 8.6 0 1 0 20.5 15.25Z" />
            </svg>
          )}
        </button>
      </fieldset>

      <img
        src={publicAssetPath(
          errorCode ? "res/characters/1.png" : "res/characters/2.png",
        )}
        alt="캐릭터"
        className="error-image"
      />
      <h1 className="error-message">{errorCode ?? "Unknown Page"}</h1>
      <p className="error-detail">{errorMessage}</p>

      {homeUrl ? (
        <a className="home-link" href={homeUrl}>
          Home
        </a>
      ) : null}
    </main>
  );
}
