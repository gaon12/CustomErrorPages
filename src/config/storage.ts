import { isSupportedLanguage, type Language } from "../i18n/languages";

export function getStoredLanguage() {
  try {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage && isSupportedLanguage(savedLanguage)
      ? savedLanguage
      : undefined;
  } catch (error) {
    console.error("Failed to get stored language", error);
    return undefined;
  }
}

export function saveLanguage(language: Language) {
  try {
    localStorage.setItem("language", language);
  } catch (error) {
    console.error("Failed to save language", error);
  }
}

export function getStoredDarkMode() {
  try {
    const savedMode = localStorage.getItem("darkMode");

    if (savedMode === null) {
      return undefined;
    }

    return savedMode === "true";
  } catch (error) {
    console.error("Failed to get stored dark mode", error);
    return undefined;
  }
}

export function saveDarkMode(darkMode: boolean) {
  try {
    localStorage.setItem("darkMode", String(darkMode));
  } catch (error) {
    console.error("Failed to save dark mode", error);
  }
}
