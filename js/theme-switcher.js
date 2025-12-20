/**
 * Theme Switcher
 * テーマ切替機能（themeA/themeB/themeC）
 */
(function () {
  const THEME_KEY = "chord-voicing-map-theme";
  const DEFAULT_THEME = "themeA";
  const THEMES = [
    { id: "themeB", label: "A: Minimal (Opus)" },
    { id: "themeA", label: "B: Studio (Opus)" },
    { id: "themeC", label: "C: Learning (Opus)" },
    { id: "themeA-gemini", label: "A: Neo-Glass (Gemini)" },
    { id: "themeB-gemini", label: "B: Cyber-Console (Gemini)" },
    { id: "themeC-gemini", label: "C: Modern Academic (Gemini)" },
  ];

  /**
   * テーマを適用
   */
  function applyTheme(themeId) {
    document.documentElement.setAttribute("data-theme", themeId);
    try {
      localStorage.setItem(THEME_KEY, themeId);
    } catch (e) {
      // localStorage unavailable
    }
  }

  /**
   * 保存されたテーマを取得
   */
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  /**
   * テーマ切替UIを作成
   */
  function createThemeSwitcher() {
    const container = document.createElement("div");
    container.className = "theme-switcher";

    const label = document.createElement("label");
    label.setAttribute("for", "themeSwitcherSelect");
    label.textContent = "Theme:";

    const select = document.createElement("select");
    select.id = "themeSwitcherSelect";
    select.setAttribute("aria-label", "Select theme");

    THEMES.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.id;
      option.textContent = theme.label;
      select.appendChild(option);
    });

    select.value = getSavedTheme();

    select.addEventListener("change", function () {
      applyTheme(this.value);
    });

    container.appendChild(label);
    container.appendChild(select);
    document.body.appendChild(container);
  }

  /**
   * 初期化
   */
  function init() {
    // 保存されたテーマを適用
    applyTheme(getSavedTheme());

    // UIを作成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createThemeSwitcher);
    } else {
      createThemeSwitcher();
    }
  }

  init();
})();


