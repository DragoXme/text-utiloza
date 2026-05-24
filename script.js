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

const headerMain = document.querySelector(".header-main");
const siteNav = document.querySelector(".site-nav");
const headerThemePicker = document.querySelector("[data-theme-picker]");
const searchCatalog = {
  main: [
    {
      title: "Basic Calculator",
      type: "Tool",
      description: "Everyday arithmetic, percentages, copied results, and recent history.",
      url: "https://calculator.utiloza.top/basic-calculator/",
      icon: "=",
      keywords: ["calculator", "math", "arithmetic", "percentage", "numbers"],
    },
    {
      title: "Text Cleaner",
      type: "Tool",
      description: "Clean copied text, fix spacing, broken lines, blanks, and duplicates.",
      url: "https://text.utiloza.top/text-cleaner/",
      icon: "TC",
      keywords: ["text", "clean", "pdf", "spacing", "replace", "lines"],
    },
    {
      title: "Gradient Background Generator",
      type: "Tool",
      description: "Create gradient images for posts, wallpapers, thumbnails, and designs.",
      url: "https://color.utiloza.top/gradient-background-generator/",
      icon: "GB",
      keywords: ["gradient", "background", "color", "image", "wallpaper"],
    },
    {
      title: "Text tools",
      type: "Collection",
      description: "Tools for cleaning and preparing copied text.",
      url: "https://text.utiloza.top/",
      icon: "TC",
      keywords: ["text", "writing", "collection"],
    },
    {
      title: "Color tools",
      type: "Collection",
      description: "Tools for gradients, colors, and simple visual assets.",
      url: "https://color.utiloza.top/",
      icon: "GB",
      keywords: ["color", "gradient", "collection"],
    },
    {
      title: "Calculator tools",
      type: "Collection",
      description: "Focused calculators for everyday numbers.",
      url: "https://calculator.utiloza.top/",
      icon: "=",
      keywords: ["calculator", "math", "collection"],
    },
  ],
  text: [
    {
      title: "Text tools",
      type: "Collection",
      description: "Tools for cleaning and preparing copied text.",
      url: "https://text.utiloza.top/",
      icon: "TC",
      keywords: ["text", "writing", "collection"],
    },
    {
      title: "Text Cleaner",
      type: "Tool",
      description: "Clean copied text, fix spacing, broken lines, blanks, and duplicates.",
      url: "https://text.utiloza.top/text-cleaner/",
      icon: "TC",
      keywords: ["text", "clean", "pdf", "spacing", "replace", "lines"],
    },
  ],
  color: [
    {
      title: "Color tools",
      type: "Collection",
      description: "Tools for gradients, colors, and simple visual assets.",
      url: "https://color.utiloza.top/",
      icon: "GB",
      keywords: ["color", "gradient", "collection"],
    },
    {
      title: "Gradient Background Generator",
      type: "Tool",
      description: "Create gradient images for posts, wallpapers, thumbnails, and designs.",
      url: "https://color.utiloza.top/gradient-background-generator/",
      icon: "GB",
      keywords: ["gradient", "background", "color", "image", "wallpaper"],
    },
  ],
  calculator: [
    {
      title: "Calculator tools",
      type: "Collection",
      description: "Focused calculators for everyday numbers.",
      url: "https://calculator.utiloza.top/",
      icon: "=",
      keywords: ["calculator", "math", "collection"],
    },
    {
      title: "Basic Calculator",
      type: "Tool",
      description: "Everyday arithmetic, percentages, copied results, and recent history.",
      url: "https://calculator.utiloza.top/basic-calculator/",
      icon: "=",
      keywords: ["calculator", "math", "arithmetic", "percentage", "numbers"],
    },
  ],
};
const getSearchScope = () => {
  const host = location.hostname.toLowerCase();

  if (host.startsWith("text.")) {
    return "text";
  }

  if (host.startsWith("color.")) {
    return "color";
  }

  if (host.startsWith("calculator.")) {
    return "calculator";
  }

  const brandContext = document.querySelector(".brand small")?.textContent.toLowerCase() || "";

  if (brandContext.includes("text")) {
    return "text";
  }

  if (brandContext.includes("color")) {
    return "color";
  }

  if (brandContext.includes("calculator")) {
    return "calculator";
  }

  return "main";
};
const escapeSearchText = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
let closeHeaderSearch = () => {};

if (siteHeader && headerMain && siteNav) {
  if (!siteNav.id) {
    siteNav.id = "site-navigation";
  }

  const navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.type = "button";
  navToggle.setAttribute("aria-label", "Open menu");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-controls", siteNav.id);
  navToggle.innerHTML = '<span class="nav-toggle-mark" aria-hidden="true"></span>';

  siteHeader.classList.add("nav-ready");
  headerMain.setAttribute("data-mobile-menu", "");

  if (headerThemePicker) {
    headerThemePicker.after(navToggle);
  } else {
    headerMain.after(navToggle);
  }

  const closeNav = () => {
    siteHeader.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  const openNav = () => {
    siteHeader.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  navToggle.addEventListener("click", () => {
    closeHeaderSearch();

    if (siteHeader.classList.contains("nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest?.("a")) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  const desktopNav = window.matchMedia("(min-width: 921px)");
  const handleDesktopNav = () => {
    if (desktopNav.matches) {
      closeNav();
    }
  };

  if (desktopNav.addEventListener) {
    desktopNav.addEventListener("change", handleDesktopNav);
  } else if (desktopNav.addListener) {
    desktopNav.addListener(handleDesktopNav);
  }
}

if (siteHeader && headerThemePicker) {
  const searchScope = getSearchScope();
  const searchItems = searchCatalog[searchScope] || searchCatalog.main;
  const headerSearch = document.createElement("div");
  const panelId = "header-search-panel";

  headerSearch.className = "header-search";
  headerSearch.dataset.headerSearch = "";
  headerSearch.innerHTML = `
    <button class="search-trigger" type="button" aria-label="Search" aria-expanded="false" aria-controls="${panelId}">
      <span class="search-mark" aria-hidden="true"></span>
    </button>
    <form class="header-search-form" role="search">
      <span class="search-mark" aria-hidden="true"></span>
      <input class="header-search-input" type="search" aria-label="Search tools" placeholder="${searchScope === "main" ? "Search tools" : "Search this site"}" autocomplete="off" spellcheck="false">
      <button class="search-clear" type="button" hidden>Clear</button>
    </form>
    <div class="header-search-panel" id="${panelId}" data-header-search-panel hidden>
      <div class="search-panel-header">
        <span data-search-count>${searchScope === "main" ? "Search Utiloza" : "Search this site"}</span>
      </div>
      <div class="suggestion-list" data-search-results></div>
    </div>
  `;
  headerThemePicker.before(headerSearch);

  const searchTrigger = headerSearch.querySelector(".search-trigger");
  const searchForm = headerSearch.querySelector(".header-search-form");
  const searchInput = headerSearch.querySelector(".header-search-input");
  const searchClear = headerSearch.querySelector(".search-clear");
  const searchPanel = headerSearch.querySelector(".header-search-panel");
  const searchCount = headerSearch.querySelector("[data-search-count]");
  const searchResults = headerSearch.querySelector("[data-search-results]");
  const normalize = (value) => value.toLowerCase().trim();
  const getMatches = () => {
    const query = normalize(searchInput.value);

    if (!query) {
      return searchItems;
    }

    const words = query.split(/\s+/).filter(Boolean);

    return searchItems
      .map((item) => {
        const title = normalize(item.title);
        const searchable = normalize(`${item.title} ${item.type} ${item.description} ${item.keywords.join(" ")}`);
        let score = 0;

        if (title === query) {
          score += 8;
        } else if (title.startsWith(query)) {
          score += 5;
        } else if (title.includes(query)) {
          score += 3;
        }

        if (words.every((word) => searchable.includes(word))) {
          score += 2;
        }

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.item);
  };
  const renderSearchResults = () => {
    const query = normalize(searchInput.value);
    const matches = getMatches();

    searchClear.hidden = !query;
    searchCount.textContent = query
      ? `${matches.length} result${matches.length === 1 ? "" : "s"}`
      : searchScope === "main"
        ? "Search Utiloza"
        : "Search this site";

    if (!matches.length) {
      searchResults.innerHTML = '<p class="suggestion-empty">No matching tools found.</p>';
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (item) => `
          <a class="suggestion-item" href="${item.url}">
            <span class="suggestion-icon" aria-hidden="true">${escapeSearchText(item.icon)}</span>
            <span class="suggestion-copy">
              <strong>${escapeSearchText(item.title)}</strong>
              <span>${escapeSearchText(item.description)}</span>
            </span>
            <span class="suggestion-action">${escapeSearchText(item.type)}</span>
          </a>
        `,
      )
      .join("");
  };
  const openSearch = ({ focus = true } = {}) => {
    const navToggle = siteHeader.querySelector(".nav-toggle");

    siteHeader.classList.remove("nav-open");
    siteHeader.classList.add("search-open");
    headerSearch.classList.add("is-open");
    searchTrigger.setAttribute("aria-expanded", "true");
    searchPanel.hidden = false;
    renderSearchResults();

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }

    if (focus) {
      window.requestAnimationFrame(() => searchInput.focus());
    }
  };
  closeHeaderSearch = () => {
    siteHeader.classList.remove("search-open");
    headerSearch.classList.remove("is-open");
    searchTrigger.setAttribute("aria-expanded", "false");
    searchPanel.hidden = true;
  };
  const openFirstMatch = () => {
    const firstMatch = getMatches()[0];

    if (firstMatch) {
      location.href = firstMatch.url;
    }
  };

  searchTrigger.addEventListener("click", () => {
    if (headerSearch.classList.contains("is-open")) {
      closeHeaderSearch();
    } else {
      openSearch();
    }
  });

  searchInput.addEventListener("focus", () => openSearch({ focus: false }));
  searchInput.addEventListener("input", renderSearchResults);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openFirstMatch();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    renderSearchResults();
  });
  searchResults.addEventListener("click", (event) => {
    if (event.target.closest?.("a")) {
      closeHeaderSearch();
    }
  });
  document.addEventListener("click", (event) => {
    if (!headerSearch.contains(event.target)) {
      closeHeaderSearch();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHeaderSearch();
      searchInput.blur();
    }
  });
}

const themePicker = document.querySelector("[data-theme-picker]");

if (themePicker) {
  const trigger = themePicker.querySelector(".theme-trigger");
  const menu = themePicker.querySelector(".theme-menu");
  const options = [...themePicker.querySelectorAll("[data-theme-choice]")];
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const allowedThemes = ["system", "light", "dark"];
  const isAllowedTheme = (choice) => allowedThemes.includes(choice);
  const isUtilozaHost = location.hostname === "utiloza.top" || location.hostname.endsWith(".utiloza.top");
  const clearHostThemeCookie = () => {
    if (!isUtilozaHost) {
      return;
    }

    try {
      document.cookie = "utiloza-theme=; Max-Age=0; Path=/; SameSite=Lax";
    } catch {
      // Cookie sync is a convenience, not required for the current page.
    }
  };
  const getThemeCookie = () => {
    clearHostThemeCookie();

    const values = document.cookie
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.startsWith("utiloza-theme="))
      .map((item) => decodeURIComponent(item.slice("utiloza-theme=".length)))
      .filter(isAllowedTheme);

    return values.at(-1) || "";
  };
  const getLocalTheme = () => {
    try {
      const value = localStorage.getItem("utiloza-theme") || "";
      return isAllowedTheme(value) ? value : "";
    } catch {
      return "";
    }
  };
  const setLocalTheme = (choice) => {
    try {
      localStorage.setItem("utiloza-theme", choice);
    } catch {
      // Theme still works if localStorage is unavailable.
    }
  };
  const setThemeCookie = (choice) => {
    try {
      if (isUtilozaHost) {
        document.cookie = "utiloza-theme=; Max-Age=0; Path=/; SameSite=Lax";
        document.cookie = `utiloza-theme=${encodeURIComponent(choice)}; Max-Age=31536000; Path=/; Domain=.utiloza.top; SameSite=Lax`;
      } else {
        document.cookie = `utiloza-theme=${encodeURIComponent(choice)}; Max-Age=31536000; Path=/; SameSite=Lax`;
      }
    } catch {
      // Cookie sync is a convenience, not required for the current page.
    }
  };
  const getSavedTheme = () => {
    const cookieTheme = getThemeCookie();
    const localTheme = getLocalTheme();

    if (cookieTheme) {
      setLocalTheme(cookieTheme);
      return cookieTheme;
    }

    if (localTheme) {
      setThemeCookie(localTheme);
      return localTheme;
    }

    return "system";
  };
  const saveTheme = (choice) => {
    setLocalTheme(choice);
    setThemeCookie(choice);
  };
  const resolveTheme = (choice) => (choice === "dark" || (choice === "system" && systemTheme.matches) ? "dark" : "light");
  let currentChoice = getSavedTheme();
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
  saveTheme(currentChoice);

  const syncThemeFromStorage = () => {
    const savedChoice = getSavedTheme();
    if (savedChoice !== currentChoice) {
      applyTheme(savedChoice, { animate: false, save: false });
    }
  };

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

  window.addEventListener("focus", syncThemeFromStorage);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      syncThemeFromStorage();
    }
  });

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
