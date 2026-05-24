import { publicAssetPath } from "./assets";

export function updateThemeColor(color: string) {
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

export function updateFavicon() {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

  if (!link) {
    link = document.createElement("link");
    document.head.appendChild(link);
  }

  link.type = "image/png";
  link.rel = "shortcut icon";
  link.href = publicAssetPath("res/favicon/1.png");
}
