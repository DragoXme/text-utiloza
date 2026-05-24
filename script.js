const yearLabels = document.querySelectorAll("#year, [data-year]");

yearLabels.forEach((yearLabel) => {
  yearLabel.textContent = String(new Date().getFullYear());
});

const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const syncHeaderHeight = () => {
    const height = Math.ceil(siteHeader.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--site-header-height", `${height}px`);
  };

  syncHeaderHeight();
  window.addEventListener("load", syncHeaderHeight);

  if ("ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(syncHeaderHeight);
    headerObserver.observe(siteHeader);
  } else {
    window.addEventListener("resize", syncHeaderHeight);
  }
}

const themePicker = document.querySelector("[data-theme-picker]");

if (themePicker) {
  const trigger = themePicker.querySelector(".theme-trigger");
  const menu = themePicker.querySelector(".theme-menu");
  const options = [...themePicker.querySelectorAll("[data-theme-choice]")];
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const allowedThemes = ["system", "light", "dark"];
  const getThemeCookie = () => {
    const match = document.cookie.match(/(?:^|; )utiloza-theme=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  };
  const getSavedTheme = () => {
    try {
      const saved = getThemeCookie() || localStorage.getItem("utiloza-theme") || "system";
      return allowedThemes.includes(saved) ? saved : "system";
    } catch {
      return "system";
    }
  };
  const saveTheme = (choice) => {
    try {
      localStorage.setItem("utiloza-theme", choice);
    } catch {
      // The visual theme still changes if storage is unavailable.
    }

    try {
      document.cookie = `utiloza-theme=${encodeURIComponent(choice)}; Max-Age=31536000; Path=/; SameSite=Lax`;
      if (location.hostname === "utiloza.top" || location.hostname.endsWith(".utiloza.top")) {
        document.cookie = `utiloza-theme=${encodeURIComponent(choice)}; Max-Age=31536000; Path=/; Domain=.utiloza.top; SameSite=Lax`;
      }
    } catch {
      // Cookie sync is a convenience, not required for the current page.
    }
  };
  const resolveTheme = (choice) => (choice === "dark" || (choice === "system" && systemTheme.matches) ? "dark" : "light");
  let currentChoice = document.documentElement.dataset.themeChoice || getSavedTheme();
  let themeTurn = 0;

  const applyTheme = (choice, { animate = true, save = true } = {}) => {
    const option = options.find((item) => item.dataset.themeChoice === choice) || options[0];
    const nextChoice = option.dataset.themeChoice;
    const text = option.textContent.trim();
    const resolvedTheme = resolveTheme(nextChoice);

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themeChoice = nextChoice;

    if (themeColor) {
      themeColor.setAttribute("content", resolvedTheme === "dark" ? "#050814" : "#101828");
    }

    if (save) {
      saveTheme(nextChoice);
    }

    trigger.setAttribute("title", `Theme: ${text}`);
    trigger.setAttribute("aria-label", `Theme: ${text}`);
    trigger.classList.remove("theme-system", "theme-light", "theme-dark");
    trigger.classList.add(`theme-${nextChoice}`);

    if (animate && nextChoice !== currentChoice) {
      trigger.classList.remove("theme-changing");
      void trigger.offsetWidth;
      themeTurn += 180;
      trigger.style.setProperty("--theme-turn", `${themeTurn}deg`);
      trigger.classList.add("theme-changing");
      window.setTimeout(() => trigger.classList.remove("theme-changing"), 320);
    }

    currentChoice = nextChoice;

    options.forEach((item) => {
      const isActive = item === option;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-checked", String(isActive));
    });
  };

  const closeMenu = () => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
  };

  trigger.addEventListener("click", toggleMenu);

  options.forEach((option) => {
    option.addEventListener("click", () => {
      applyTheme(option.dataset.themeChoice);
      closeMenu();
    });
  });

  applyTheme(currentChoice, { animate: false, save: false });

  const handleSystemThemeChange = () => {
    if (currentChoice === "system") {
      applyTheme("system", { animate: false, save: false });
    }
  };

  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", handleSystemThemeChange);
  } else if (systemTheme.addListener) {
    systemTheme.addListener(handleSystemThemeChange);
  }

  document.addEventListener("click", (event) => {
    if (!themePicker.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
