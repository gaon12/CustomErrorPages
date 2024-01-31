import React, { useState, useEffect, useCallback } from "react";
import { Select, Button } from "antd";
import "./ErrorPage.css"; // 동일한 CSS 파일을 사용

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

const UnknownPage = () => {
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태
  const [darkBtnText, setDarkBtnText] = useState(""); // 다크모드 버튼 텍스트 상태
  const [language, setLanguage] = useState(getLanguage().toLowerCase());
  const [darkMode, setDarkMode] = useState(getInitialMode());

  // 상위 요소(body)에 overflow-y: hidden; 적용
  useEffect(() => {
    // 상위 요소 선택
    const parentElement = document.body; // body를 사용

    // 상위 요소의 원래 overflow-y 스타일 저장
    const originalOverflowY = parentElement.style.overflowY;

    // 상위 요소의 overflow-y를 hidden으로 설정
    parentElement.style.overflowY = "hidden";

    // 컴포넌트가 언마운트될 때 원래 스타일로 되돌림
    return () => {
      parentElement.style.overflowY = originalOverflowY;
    };
  }, []);

  // saveMode 함수를 useCallback으로 메모이제이션
  const saveMode = useCallback(
    (mode) => {
      localStorage.setItem("darkMode", mode);
      localStorage.setItem("language", language);
    },
    [language]
  ); // language가 변경될 때만 함수를 새로 생성

  useEffect(() => {
    const loadLanguageFile = async () => {
      try {
        const langCode = language.startsWith("zh")
          ? language.replace("-", "_")
          : language;
        const messages = await import(`./langs/${langCode}.json`);

        const errorMessages = messages.default.error;
        const message = errorMessages["unknown"];

        setErrorMessage(message);
        setDarkBtnText(messages.default.etc.dark_btn);
      } catch {
        const messages = await import(`./langs/en.json`);
        setErrorMessage(messages.default.error["unknown"]);
        setDarkBtnText(messages.default.etc.dark_btn);
      }
    };

    loadLanguageFile();
    saveMode(getLanguage()); // language 상태를 저장
    saveMode(darkMode);

    // 브라우저 탭 타이틀 업데이트
    document.title = `Unknown Error`;

    // 파비콘 변경
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "shortcut icon";
    link.href = "/error/res/favicon/1.png";
    document.getElementsByTagName("head")[0].appendChild(link);

    // 메타 태그 theme-color 변경
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    metaThemeColor.setAttribute("content", "#d3a281");
  }, [language, darkMode, saveMode]);

  function getLanguage() {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      return savedLanguage;
    }
    const browserLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
  
    // 'zh-cn'과 'zh-tw'의 경우 특별하게 처리
    if (browserLanguage === "zh-cn" || browserLanguage === "zh-tw") {
      return browserLanguage;
    }
  
    // 다른 언어 설정의 경우 첫 부분만 사용 (예: 'ko-KR' -> 'ko')
    const languagePrefix = browserLanguage.split('-')[0];
    return languageOptions.find(option => option.value.startsWith(languagePrefix))?.value || "en";
  }

  function getInitialMode() {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true" ? true : false;
  }

  function handleLanguageChange(value) {
    setLanguage(value);
    localStorage.setItem("language", value); // 선택된 언어를 로컬 저장소에 저장
  }

  function toggleDarkMode() {
    setDarkMode((prevMode) => !prevMode); // 이전 모드의 반대값으로 상태 업데이트
  }

  return (
    <div className={`error-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <img
        src="/error/res/characters/2.png"
        alt="캐릭터"
        className="error-image"
      />
      <div className="error-message">Unknown Page</div>{" "}
      {/* 고정된 헤더 메시지 */}
      <p className="error-detail">{errorMessage}</p> {/* 오류 상세 메시지 */}
      {/* 언어 변경 및 모드 변경 버튼 컨테이너 */}
      <div className="settings-container">
        <Select
          defaultValue={language}
          style={{ width: 120 }}
          onChange={handleLanguageChange}
          options={languageOptions} // 언어 옵션은 ErrorPage와 동일하게 사용
        />
        <Button type="primary" onClick={toggleDarkMode}>
          {darkBtnText}
        </Button>
      </div>
    </div>
  );
};

export default UnknownPage;
