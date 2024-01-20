import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import './ErrorPage.css'; // 동일한 CSS 파일을 사용

// 언어 선택 옵션
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'zh-cn', label: '简体中文' },
  { value: 'zh-tw', label: '繁體中文' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
];

const UnknownPage = () => {
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const [darkBtnText, setDarkBtnText] = useState(''); // 다크모드 버튼 텍스트 상태
  const [language, setLanguage] = useState(getLanguage().toLowerCase());
  const [darkMode, setDarkMode] = useState(getInitialMode());

  useEffect(() => {
    const loadLanguageFile = async () => {
      try {
        const langCode = language.startsWith('zh') ? language.replace('-', '_') : language;
        const messages = await import(`./langs/${langCode}.json`);
        setErrorMessage(messages.default.error['unknown']); // 'unknown' 오류 메시지 설정
        setDarkBtnText(messages.default.etc.dark_btn); // 'dark_btn' 텍스트 설정
      } catch {
        const messages = await import(`./langs/en.json`);
        setErrorMessage(messages.default.error['unknown']); // 예외 처리 시 'unknown' 오류 메시지 설정
        setDarkBtnText(messages.default.etc.dark_btn); // 'dark_btn' 텍스트 설정 (예외 처리)
      }
    };

    loadLanguageFile();
    saveMode(darkMode);

    // 브라우저 탭 타이틀 업데이트
    document.title = `Unknown Error`;

    // 파비콘 변경
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = '/res/favicon/2.png';
    document.getElementsByTagName('head')[0].appendChild(link);

    // 메타 태그 theme-color 변경
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    metaThemeColor.setAttribute("content", "#e8d3c3");
  }, [language, darkMode]);

  function getLanguage() {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || (navigator.language || navigator.userLanguage);
  }

  function getInitialMode() {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  }

  function saveMode(mode) {
    localStorage.setItem('darkMode', mode);
  }

  function handleLanguageChange(value) {
    setLanguage(value);
    localStorage.setItem('language', value); // 선택된 언어를 로컬 저장소에 저장
  }

  function toggleDarkMode() {
    setDarkMode(prevMode => !prevMode); // 이전 모드의 반대값으로 상태 업데이트
  }

  return (
    <div className={`error-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <img src="/res/characters/2.png" alt="캐릭터" className="error-image" />
      <div className="error-message">Unknown Page</div> {/* 고정된 헤더 메시지 */}
      <p className="error-detail">{errorMessage}</p> {/* 오류 상세 메시지 */}

      {/* 언어 변경 및 모드 변경 버튼 컨테이너 */}
      <div className="settings-container">
        <Select
          defaultValue={language}
          style={{ width: 120 }}
          onChange={handleLanguageChange}
          options={languageOptions} // 언어 옵션은 ErrorPage와 동일하게 사용
        />
        <Button type="primary" onClick={toggleDarkMode}>{darkBtnText}</Button>
      </div>
    </div>
  );
};

export default UnknownPage;
