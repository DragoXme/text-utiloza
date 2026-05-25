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
      icon: "calculator",
      keywords: ["calculator", "math", "arithmetic", "percentage", "numbers"],
    },
    {
      title: "BMI Calculator",
      type: "Tool",
      description: "Estimate adult body mass index with metric or US units.",
      url: "https://calculator.utiloza.top/bmi-calculator/",
      icon: "bmi",
      keywords: ["bmi", "body mass index", "weight", "height", "health", "calculator"],
    },
    {
      title: "Age Calculator",
      type: "Tool",
      description: "Find exact age, total days, total weeks, total months, and next birthday.",
      url: "https://calculator.utiloza.top/age-calculator/",
      icon: "age",
      keywords: ["age", "birthday", "date", "years", "months", "days", "calculator"],
    },
    {
      title: "Image Converter",
      type: "Tool",
      description: "Convert PNG, JPG, and WebP images in your browser.",
      url: "https://convert.utiloza.top/image-converter/",
      icon: "imageConverter",
      keywords: ["image", "converter", "convert", "png", "jpg", "jpeg", "webp", "photo"],
    },
    {
      title: "PDF Merger",
      type: "Tool",
      description: "Combine multiple PDF files into one PDF in your browser.",
      url: "https://convert.utiloza.top/pdf-merger/",
      icon: "pdfMerger",
      keywords: ["pdf", "merge", "merger", "combine", "documents", "files"],
    },
    {
      title: "Text Cleaner",
      type: "Tool",
      description: "Clean copied text, fix spacing, broken lines, blanks, and duplicates.",
      url: "https://text.utiloza.top/text-cleaner/",
      icon: "text",
      keywords: ["text", "clean", "pdf", "spacing", "replace", "lines"],
    },
    {
      title: "Gradient Background Generator",
      type: "Tool",
      description: "Create gradient images for posts, wallpapers, thumbnails, and designs.",
      url: "https://color.utiloza.top/gradient-background-generator/",
      icon: "gradient",
      keywords: ["gradient", "background", "color", "image", "wallpaper"],
    },
  ],
  text: [
    {
      title: "Text Cleaner",
      type: "Tool",
      description: "Clean copied text, fix spacing, broken lines, blanks, and duplicates.",
      url: "https://text.utiloza.top/text-cleaner/",
      icon: "text",
      keywords: ["text", "clean", "pdf", "spacing", "replace", "lines"],
    },
  ],
  color: [
    {
      title: "Gradient Background Generator",
      type: "Tool",
      description: "Create gradient images for posts, wallpapers, thumbnails, and designs.",
      url: "https://color.utiloza.top/gradient-background-generator/",
      icon: "gradient",
      keywords: ["gradient", "background", "color", "image", "wallpaper"],
    },
  ],
  convert: [
    {
      title: "Image Converter",
      type: "Tool",
      description: "Convert PNG, JPG, and WebP images in your browser.",
      url: "https://convert.utiloza.top/image-converter/",
      icon: "imageConverter",
      keywords: ["image", "converter", "convert", "png", "jpg", "jpeg", "webp", "photo"],
    },
    {
      title: "PDF Merger",
      type: "Tool",
      description: "Combine multiple PDF files into one PDF in your browser.",
      url: "https://convert.utiloza.top/pdf-merger/",
      icon: "pdfMerger",
      keywords: ["pdf", "merge", "merger", "combine", "documents", "files"],
    },
  ],
  calculator: [
    {
      title: "Basic Calculator",
      type: "Tool",
      description: "Everyday arithmetic, percentages, copied results, and recent history.",
      url: "https://calculator.utiloza.top/basic-calculator/",
      icon: "calculator",
      keywords: ["calculator", "math", "arithmetic", "percentage", "numbers"],
    },
    {
      title: "BMI Calculator",
      type: "Tool",
      description: "Estimate adult body mass index with metric or US units.",
      url: "https://calculator.utiloza.top/bmi-calculator/",
      icon: "bmi",
      keywords: ["bmi", "body mass index", "weight", "height", "health", "calculator"],
    },
    {
      title: "Age Calculator",
      type: "Tool",
      description: "Find exact age, total days, total weeks, total months, and next birthday.",
      url: "https://calculator.utiloza.top/age-calculator/",
      icon: "age",
      keywords: ["age", "birthday", "date", "years", "months", "days", "calculator"],
    },
  ],
};
const iconSet = {
  calculator:
    '<img src="/assets/basic-calculator-mark.svg" alt="">',
  bmi:
    '<img src="/assets/bmi-calculator-mark.svg" alt="">',
  age:
    '<img src="/assets/age-calculator-mark.svg" alt="">',
  imageConverter:
    '<img src="/assets/image-converter-mark.svg" alt="">',
  pdfMerger:
    '<img src="/assets/pdf-merger-mark.svg" alt="">',
  text:
    '<img src="/assets/text-cleaner-mark.svg" alt="">',
  gradient:
    '<img src="/assets/gradient-background-generator-mark.svg" alt="">',
  request:
    '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 21h4"></path><path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2Z"></path><path d="M12 8v4"></path><path d="M10 10h4"></path></svg>',
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

  if (host.startsWith("convert.")) {
    return "convert";
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

  if (brandContext.includes("convert")) {
    return "convert";
  }

  return "main";
};
const escapeSearchText = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const getIcon = (name) => iconSet[name] || iconSet.text;
const siteSearchScope = getSearchScope();
let closeHeaderSearch = () => {};

const normalizePathname = (pathname) => pathname.replace(/\/index\.html$/, "/") || "/";
const scrollToSection = (target, { smooth = true } = {}) => {
  target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });

  if (history.replaceState) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
};
const getSamePageSection = (href) => {
  if (!href || !href.includes("#")) {
    return null;
  }

  let url;

  try {
    url = new URL(href, location.href);
  } catch {
    return null;
  }

  if (url.origin !== location.origin || normalizePathname(url.pathname) !== normalizePathname(location.pathname)) {
    return null;
  }

  const id = decodeURIComponent(url.hash.slice(1));

  if (!id) {
    return null;
  }

  return document.getElementById(id);
};

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("a[href*='#']");
  const target = link ? getSamePageSection(link.getAttribute("href")) : null;

  if (!target) {
    return;
  }

  event.preventDefault();
  closeHeaderSearch();
  scrollToSection(target);
});

if (location.hash) {
  const initialTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));

  if (initialTarget) {
    window.requestAnimationFrame(() => scrollToSection(initialTarget, { smooth: false }));
  }
}

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
  const searchScope = siteSearchScope;
  const searchItems = searchCatalog.main;
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
      <input class="header-search-input" type="search" aria-label="Search tools" placeholder="Search tools" autocomplete="off" spellcheck="false">
      <button class="search-clear" type="button" hidden>Clear</button>
    </form>
    <div class="header-search-panel" id="${panelId}" data-header-search-panel hidden>
      <div class="search-panel-header">
        <span data-search-count>Search tools</span>
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
  const requestSourceLabels = {
    main: "Utiloza",
    text: "Text Utiloza",
    color: "Color Utiloza",
    calculator: "Calculator Utiloza",
    convert: "Convert Utiloza",
  };
  const normalize = (value) => value.toLowerCase().trim();
  const getToolRequestUrl = (requestText) => {
    const source = requestSourceLabels[searchScope] || requestSourceLabels.main;
    const searchedLine = requestText ? `I searched for: ${requestText}\n\n` : "";
    const body = `Tool idea:\n\n${searchedLine}What should it do:\n\nWhy would it be useful:\n`;

    return `mailto:hello@utiloza.top?subject=${encodeURIComponent(`Tool request from ${source}`)}&body=${encodeURIComponent(body)}`;
  };
  const renderRequestResult = (requestText) => `
    <a class="suggestion-item suggestion-request" href="${escapeSearchText(getToolRequestUrl(requestText))}">
      <span class="suggestion-icon" aria-hidden="true">${getIcon("request")}</span>
      <span class="suggestion-copy">
        <strong>Request this tool</strong>
        <span>Send the tool idea you wanted to find.</span>
      </span>
      <span class="suggestion-action">Request</span>
    </a>
  `;
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
    const rawQuery = searchInput.value.trim();
    const query = normalize(rawQuery);
    const matches = getMatches();

    searchClear.hidden = !query;
    searchCount.textContent = query
      ? `${matches.length} result${matches.length === 1 ? "" : "s"}`
      : "Search tools";

    if (!matches.length) {
      searchResults.innerHTML = `
        <p class="suggestion-empty">No matching tools found.</p>
        ${renderRequestResult(rawQuery)}
      `;
      return;
    }

    searchResults.innerHTML = matches
      .map(
        (item) => `
          <a class="suggestion-item" href="${item.url}">
            <span class="suggestion-icon" aria-hidden="true">${getIcon(item.icon)}</span>
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

const featuredCarousel = document.querySelector("[data-featured-carousel]");

if (featuredCarousel) {
  const slides = [...featuredCarousel.querySelectorAll("[data-featured-slide]")].slice(0, 6);
  const dots = [...featuredCarousel.querySelectorAll("[data-featured-dot]")].slice(0, slides.length);
  const previousButton = featuredCarousel.querySelector("[data-featured-prev]");
  const nextButton = featuredCarousel.querySelector("[data-featured-next]");
  const viewport = featuredCarousel.querySelector("[data-featured-viewport]");
  const indexLabel = featuredCarousel.querySelector("[data-featured-index]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const duration = 6000;
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let progressMs = 0;
  let lastTick = performance.now();
  let isHoverPaused = false;
  let isFocusPaused = false;
  let isKeyboardFocusIntent = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isPointerDown = false;
  let suppressNextClick = false;

  const clampProgress = (value) => Math.max(0, Math.min(1, value));
  const updateProgress = (value = 0) => {
    dots.forEach((dot, index) => {
      dot.style.setProperty("--featured-progress", index === activeIndex ? clampProgress(value) : 0);
    });
  };
  const isPaused = (now) =>
    reducedMotion.matches || isHoverPaused || isFocusPaused || document.hidden;
  const setActiveSlide = (nextIndex) => {
    if (!slides.length) {
      return;
    }

    activeIndex = (nextIndex + slides.length) % slides.length;
    progressMs = 0;
    updateProgress(0);

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.tabIndex = isActive ? 0 : -1;

      if (isActive) {
        slide.setAttribute("aria-current", "true");
        slide.removeAttribute("aria-hidden");
      } else {
        slide.removeAttribute("aria-current");
        slide.setAttribute("aria-hidden", "true");
      }
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("is-active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (indexLabel) {
      indexLabel.textContent = String(activeIndex + 1);
    }
  };
  const goToSlide = (nextIndex) => {
    if (!slides.length) {
      return;
    }

    setActiveSlide(nextIndex);
  };
  const tick = (now) => {
    const delta = Math.min(120, now - lastTick);
    lastTick = now;

    if (!isPaused(now) && slides.length > 1) {
      progressMs += delta;

      if (progressMs >= duration) {
        setActiveSlide(activeIndex + 1);
      } else {
        updateProgress(progressMs / duration);
      }
    }

    window.requestAnimationFrame(tick);
  };

  if (slides.length > 0) {
    featuredCarousel.classList.add("is-initializing");
    featuredCarousel.classList.add("is-ready");
    setActiveSlide(activeIndex);
    window.requestAnimationFrame(() => {
      featuredCarousel.classList.remove("is-initializing");
      lastTick = performance.now();
      window.requestAnimationFrame(tick);
    });
  }

  previousButton?.addEventListener("click", () => goToSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") {
        isKeyboardFocusIntent = true;
      }
    },
    true,
  );
  featuredCarousel.addEventListener(
    "pointerdown",
    () => {
      isKeyboardFocusIntent = false;
      isFocusPaused = false;
    },
    true,
  );
  featuredCarousel.addEventListener("mouseenter", () => {
    isHoverPaused = true;
  });
  featuredCarousel.addEventListener("mouseleave", () => {
    isHoverPaused = false;
  });
  featuredCarousel.addEventListener("focusin", () => {
    isFocusPaused = isKeyboardFocusIntent;
  });
  featuredCarousel.addEventListener("focusout", (event) => {
    if (!featuredCarousel.contains(event.relatedTarget)) {
      isFocusPaused = false;
    }
  });
  featuredCarousel.addEventListener("keydown", (event) => {
    isKeyboardFocusIntent = true;
    isFocusPaused = true;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(activeIndex + 1);
    }
  });
  featuredCarousel.addEventListener(
    "click",
    (event) => {
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressNextClick = false;
      }
    },
    true,
  );

  viewport?.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    isPointerDown = true;
  });
  viewport?.addEventListener("pointerup", (event) => {
    if (!isPointerDown) {
      return;
    }

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    isPointerDown = false;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      suppressNextClick = true;
      goToSlide(activeIndex + (deltaX < 0 ? 1 : -1));
      window.setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
  });
  viewport?.addEventListener("pointercancel", () => {
    isPointerDown = false;
  });

  document.addEventListener("visibilitychange", () => {
    lastTick = performance.now();
  });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", () => updateProgress(0));
  } else if (reducedMotion.addListener) {
    reducedMotion.addListener(() => updateProgress(0));
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
