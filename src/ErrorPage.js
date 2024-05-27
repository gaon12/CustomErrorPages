import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Select, Button } from "antd";
import "./ErrorPage.css";

// 언어 선택 옵션
const languageOptions = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh-cn", label: "简体中文" },
  { value: "zh-tw", label: "繁體中文" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
];

const ErrorPage = ({ errorCode }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [darkBtnText, setDarkBtnText] = useState(""); // 다크모드 버튼 텍스트 상태
  const [language, setLanguage] = useState(getInitialLanguage());
  const [darkMode, setDarkMode] = useState(getInitialMode());

  useEffect(() => {
    const loadLanguageFile = async () => {
      try {
        const langCode = language.startsWith("zh")
          ? language.replace("-", "_")
          : language;
        const messages = await import(`./langs/${langCode}.json`);

        const errorKey = errorCode ? errorCode.toString() : "unknown";
        const errorMessages = messages.default.error;
        const message = errorMessages[errorKey] || errorMessages["unknown"];

        setErrorMessage(message);
        setDarkBtnText(messages.default.etc.dark_btn);
      } catch (e) {
        console.error("Failed to load language file", e);
        const messages = await import(`./langs/en.json`);
        setErrorMessage(messages.default.error["unknown"]);
        setDarkBtnText(messages.default.etc.dark_btn);
      }
    };

    loadLanguageFile();

    document.title = errorCode ? `Error ${errorCode}` : "Unknown Error";

    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "shortcut icon";
    link.href = "/res/favicon/1.png";
    document.getElementsByTagName("head")[0].appendChild(link);

    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    metaThemeColor.setAttribute("content", "#d3a281");
  }, [language, darkMode, errorCode]);

  const saveMode = useCallback(
    (mode) => {
      try {
        localStorage.setItem("darkMode", mode);
        localStorage.setItem("language", language);
      } catch (e) {
        console.error("Failed to save mode", e);
      }
    },
    [language]
  );

  function getInitialLanguage() {
    try {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        return savedLanguage;
      }
    } catch (e) {
      console.error("Failed to get initial language", e);
    }
    const browserLanguage = (navigator.language || navigator.userLanguage).toLowerCase();

    if (browserLanguage === "zh-cn" || browserLanguage === "zh-tw") {
      return browserLanguage;
    }
    const languagePrefix = browserLanguage.split('-')[0];
    return languageOptions.find(option => option.value.startsWith(languagePrefix))?.value || "en";
  }

  function getInitialMode() {
    try {
      const savedMode = localStorage.getItem("darkMode");
      return savedMode === "true";
    } catch (e) {
      console.error("Failed to get initial mode", e);
      return false;
    }
  }

  function handleLanguageChange(value) {
    setLanguage(value);
    try {
      localStorage.setItem("language", value);
    } catch (e) {
      console.error("Failed to set language", e);
    }
  }

  function toggleDarkMode() {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      try {
        localStorage.setItem("darkMode", newMode);
      } catch (e) {
        console.error("Failed to set dark mode", e);
      }
      saveMode(newMode);
      return newMode;
    });
  }

  return (
    <div className={`error-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <img
        src={errorCode ? "/res/characters/1.png" : "/res/characters/2.png"}
        alt="캐릭터"
        className="error-image"
      />
      <div className="error-message">{errorCode || "Unknown Page"}</div>
      <p className="error-detail">{errorMessage}</p>

      {/* 언어 변경 및 모드 변경 버튼 컨테이너 */}
      <div className="settings-container">
        <Select
          value={language}
          style={{ width: 120 }}
          onChange={handleLanguageChange}
          options={languageOptions}
        />
        <Button type="primary" onClick={toggleDarkMode}>
          {darkBtnText}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
