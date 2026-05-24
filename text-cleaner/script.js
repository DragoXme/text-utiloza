(() => {
  const inputText = document.querySelector("#inputText");
  const outputPreview = document.querySelector("#outputPreview");
  const pasteButton = document.querySelector("#pasteButton");
  const sampleButton = document.querySelector("#sampleButton");
  const clearButton = document.querySelector("#clearButton");
  const copyButton = document.querySelector("#copyButton");
  const downloadButton = document.querySelector("#downloadButton");
  const advancedToggle = document.querySelector("#advancedToggle");
  const advancedPanel = document.querySelector("#advancedPanel");
  const findText = document.querySelector("#findText");
  const replaceText = document.querySelector("#replaceText");
  const prevMatchButton = document.querySelector("#prevMatchButton");
  const nextMatchButton = document.querySelector("#nextMatchButton");
  const replaceButton = document.querySelector("#replaceButton");
  const replaceAllButton = document.querySelector("#replaceAllButton");
  const matchCounter = document.querySelector("#matchCounter");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];
  const switchButtons = [...document.querySelectorAll("[data-setting]")];
  const presetButtons = [...document.querySelectorAll("[data-preset]")];

  if (!inputText || !outputPreview) {
    return;
  }

  const state = {
    mode: "paragraph",
    currentOutput: "",
    currentMatchIndex: 0,
    settings: {
      trimLines: true,
      normalizeSpaces: true,
      removeBlankLines: true,
      removeDuplicateLines: false,
      fixPunctuation: true,
      matchCase: false
    }
  };

  const presets = {
    pdf: {
      mode: "paragraph",
      settings: {
        trimLines: true,
        normalizeSpaces: true,
        removeBlankLines: true,
        removeDuplicateLines: false,
        fixPunctuation: true
      }
    },
    spaces: {
      mode: "lines",
      settings: {
        trimLines: true,
        normalizeSpaces: true,
        removeBlankLines: true,
        removeDuplicateLines: false,
        fixPunctuation: true
      }
    },
    list: {
      mode: "lines",
      settings: {
        trimLines: true,
        normalizeSpaces: true,
        removeBlankLines: true,
        removeDuplicateLines: true,
        fixPunctuation: true
      }
    },
    caption: {
      mode: "caption",
      settings: {
        trimLines: true,
        normalizeSpaces: true,
        removeBlankLines: false,
        removeDuplicateLines: false,
        fixPunctuation: true
      }
    },
    oneLine: {
      mode: "oneLine",
      settings: {
        trimLines: true,
        normalizeSpaces: true,
        removeBlankLines: true,
        removeDuplicateLines: false,
        fixPunctuation: true
      }
    }
  };

  const sample = `This text was copied from a PDF
and every sentence is broken
in strange places.


It also has     too many spaces  before punctuation .
It also has     too many spaces  before punctuation .

- first item
- second item
- second item

You should be able to paste it,
clean it,
and copy the result fast.`;

  const statLabels = {
    inputWords: document.querySelector("#inputWords"),
    inputChars: document.querySelector("#inputChars"),
    inputLines: document.querySelector("#inputLines"),
    outputWords: document.querySelector("#outputWords"),
    outputChars: document.querySelector("#outputChars"),
    outputLines: document.querySelector("#outputLines")
  };

  function countWords(text) {
    const matches = text.trim().match(/\S+/g);
    return matches ? matches.length : 0;
  }

  function countLines(text) {
    return text.length ? text.split("\n").length : 0;
  }

  function updateTextStats(prefix, text) {
    const values = {
      [`${prefix}Words`]: countWords(text),
      [`${prefix}Chars`]: text.length,
      [`${prefix}Lines`]: countLines(text)
    };

    Object.entries(values).forEach(([key, value]) => {
      if (statLabels[key]) {
        statLabels[key].textContent = String(value);
      }
    });
  }

  function isBulletLine(line) {
    return /^\s*(?:[-*\u2022]|[0-9]+[.)]|[a-zA-Z][.)])\s+/.test(line);
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeBasic(text) {
    let next = text.replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ");

    if (state.settings.normalizeSpaces) {
      next = next.replace(/[ \t]+/g, " ");
    }

    let lines = next.split("\n");

    if (state.settings.trimLines) {
      lines = lines.map((line) => line.trim());
    }

    if (state.settings.removeDuplicateLines) {
      const seen = new Set();
      lines = lines.filter((line) => {
        const clean = line.trim();

        if (!clean) {
          return true;
        }

        const key = clean.toLowerCase();

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
    }

    if (state.settings.removeBlankLines && state.mode !== "paragraph") {
      lines = lines.filter((line) => line.trim());
    }

    return lines.join("\n");
  }

  function joinParagraphLines(block) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return "";
    }

    const bulletCount = lines.filter(isBulletLine).length;

    if (bulletCount >= Math.ceil(lines.length * 0.55)) {
      return lines.join("\n");
    }

    return lines.reduce((result, line) => {
      if (!result) {
        return line;
      }

      if (/-$/.test(result)) {
        return `${result.slice(0, -1)}${line}`;
      }

      return `${result} ${line}`;
    }, "");
  }

  function shapeText(text) {
    if (state.mode === "oneLine") {
      return text.replace(/\s+/g, " ").trim();
    }

    if (state.mode === "caption") {
      return text
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    if (state.mode === "lines") {
      return text.trim();
    }

    const blocks = text
      .split(/\n{2,}/)
      .map(joinParagraphLines)
      .filter(Boolean);

    return blocks.join("\n\n").trim();
  }

  function fixPunctuationSpacing(text) {
    return text
      .replace(/[ \t]+([,.;:!?])/g, "$1")
      .replace(/([({[])[ \t]+/g, "$1")
      .replace(/[ \t]+([)}\]])/g, "$1")
      .replace(/[ \t]{2,}/g, " ");
  }

  function cleanText(rawText) {
    let next = normalizeBasic(rawText);
    next = shapeText(next);

    if (state.settings.fixPunctuation) {
      next = fixPunctuationSpacing(next);
    }

    return next;
  }

  function getMatches(text = state.currentOutput) {
    const query = findText.value;

    if (!query) {
      return [];
    }

    const haystack = state.settings.matchCase ? text : text.toLowerCase();
    const needle = state.settings.matchCase ? query : query.toLowerCase();
    const matches = [];
    let index = 0;

    while (index <= haystack.length) {
      const foundAt = haystack.indexOf(needle, index);

      if (foundAt === -1) {
        break;
      }

      matches.push({
        start: foundAt,
        end: foundAt + query.length
      });
      index = foundAt + query.length;
    }

    return matches;
  }

  function buildHighlightedOutput(matches) {
    if (!state.currentOutput) {
      return "";
    }

    if (!matches.length) {
      return escapeHtml(state.currentOutput);
    }

    let html = "";
    let lastIndex = 0;

    matches.forEach((match, index) => {
      const className = index === state.currentMatchIndex
        ? "output-match is-current"
        : "output-match";

      html += escapeHtml(state.currentOutput.slice(lastIndex, match.start));
      html += `<span class="${className}">${escapeHtml(state.currentOutput.slice(match.start, match.end))}</span>`;
      lastIndex = match.end;
    });

    html += escapeHtml(state.currentOutput.slice(lastIndex));

    return html;
  }

  function setReplaceControlsEnabled(hasMatches) {
    [prevMatchButton, nextMatchButton, replaceButton, replaceAllButton].forEach((button) => {
      if (button) {
        button.disabled = !hasMatches;
      }
    });
  }

  function scrollCurrentMatch() {
    const current = outputPreview.querySelector(".output-match.is-current");

    if (current) {
      current.scrollIntoView({ block: "center", inline: "nearest" });
    }
  }

  function renderOutput(options = {}) {
    const matches = getMatches();

    if (!matches.length) {
      state.currentMatchIndex = 0;
    } else if (state.currentMatchIndex >= matches.length) {
      state.currentMatchIndex = matches.length - 1;
    }

    outputPreview.innerHTML = buildHighlightedOutput(matches);
    outputPreview.classList.toggle("is-empty", !state.currentOutput);
    updateTextStats("output", state.currentOutput);
    setReplaceControlsEnabled(Boolean(matches.length));

    if (!findText.value) {
      matchCounter.textContent = "No search";
    } else if (!matches.length) {
      matchCounter.textContent = "0 matches";
    } else {
      matchCounter.textContent = `${state.currentMatchIndex + 1} of ${matches.length}`;
    }

    if (options.scrollToMatch && matches.length) {
      window.requestAnimationFrame(scrollCurrentMatch);
    }
  }

  function renderFromSource() {
    const input = inputText.value;

    state.currentOutput = cleanText(input);
    state.currentMatchIndex = 0;
    updateTextStats("input", input);
    renderOutput();
  }

  function replaceCurrentMatch() {
    const matches = getMatches();

    if (!matches.length) {
      temporaryButtonText(replaceButton, "No match");
      return;
    }

    const match = matches[state.currentMatchIndex] || matches[0];
    state.currentOutput = `${state.currentOutput.slice(0, match.start)}${replaceText.value}${state.currentOutput.slice(match.end)}`;
    state.currentMatchIndex = Math.min(state.currentMatchIndex, Math.max(getMatches().length - 1, 0));
    renderOutput({ scrollToMatch: true });
    temporaryButtonText(replaceButton, "Replaced");
  }

  function replaceAllMatches() {
    const matches = getMatches();

    if (!matches.length) {
      temporaryButtonText(replaceAllButton, "No match");
      return;
    }

    let next = "";
    let lastIndex = 0;

    matches.forEach((match) => {
      next += state.currentOutput.slice(lastIndex, match.start);
      next += replaceText.value;
      lastIndex = match.end;
    });

    next += state.currentOutput.slice(lastIndex);
    state.currentOutput = next;
    state.currentMatchIndex = 0;
    renderOutput();
    temporaryButtonText(replaceAllButton, "Replaced!");
  }

  function moveMatch(direction) {
    const matches = getMatches();

    if (!matches.length) {
      return;
    }

    state.currentMatchIndex = (state.currentMatchIndex + direction + matches.length) % matches.length;
    renderOutput({ scrollToMatch: true });
  }

  function updateModeButtons() {
    modeButtons.forEach((button) => {
      const isActive = button.dataset.mode === state.mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-checked", String(isActive));
    });
  }

  function updateSwitchButtons() {
    switchButtons.forEach((button) => {
      const setting = button.dataset.setting;
      const isOn = Boolean(state.settings[setting]);
      button.classList.toggle("is-on", isOn);
      button.setAttribute("aria-checked", String(isOn));
    });
  }

  function setPresetActive(presetName) {
    presetButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.preset === presetName);
    });
  }

  function applyPreset(presetName) {
    const preset = presets[presetName];

    if (!preset) {
      return;
    }

    state.mode = preset.mode;
    Object.assign(state.settings, preset.settings);
    updateModeButtons();
    updateSwitchButtons();
    setPresetActive(presetName);
    renderFromSource();
  }

  function temporaryButtonText(button, label, delay = 1500) {
    const original = button.dataset.originalText || button.textContent;
    button.dataset.originalText = original;
    button.textContent = label;
    window.clearTimeout(button.statusTimer);
    button.statusTimer = window.setTimeout(() => {
      button.textContent = original;
    }, delay);
  }

  function selectPreviewText() {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(outputPreview);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      updateModeButtons();
      setPresetActive("");
      renderFromSource();
    });
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const setting = button.dataset.setting;
      state.settings[setting] = !state.settings[setting];
      updateSwitchButtons();

      if (setting === "matchCase") {
        state.currentMatchIndex = 0;
        renderOutput({ scrollToMatch: true });
        return;
      }

      setPresetActive("");
      renderFromSource();
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
    });
  });

  inputText.addEventListener("input", renderFromSource);

  findText.addEventListener("input", () => {
    state.currentMatchIndex = 0;
    renderOutput({ scrollToMatch: true });
  });

  replaceText.addEventListener("input", () => {
    renderOutput();
  });

  prevMatchButton.addEventListener("click", () => moveMatch(-1));
  nextMatchButton.addEventListener("click", () => moveMatch(1));
  replaceButton.addEventListener("click", replaceCurrentMatch);
  replaceAllButton.addEventListener("click", replaceAllMatches);

  pasteButton.addEventListener("click", async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      inputText.value = clipboardText;
      inputText.focus();
      renderFromSource();
      temporaryButtonText(pasteButton, "Pasted");
    } catch (error) {
      inputText.focus();
      temporaryButtonText(pasteButton, "Paste here");
    }
  });

  sampleButton.addEventListener("click", () => {
    inputText.value = sample;
    inputText.focus();
    renderFromSource();
  });

  clearButton.addEventListener("click", () => {
    inputText.value = "";
    inputText.focus();
    renderFromSource();
  });

  copyButton.addEventListener("click", async () => {
    if (!state.currentOutput) {
      temporaryButtonText(copyButton, "No text");
      return;
    }

    try {
      await navigator.clipboard.writeText(state.currentOutput);
      temporaryButtonText(copyButton, "Copied!");
    } catch (error) {
      outputPreview.focus();
      selectPreviewText();
      temporaryButtonText(copyButton, "Select text");
    }
  });

  downloadButton.addEventListener("click", () => {
    if (!state.currentOutput) {
      temporaryButtonText(downloadButton, "No text");
      return;
    }

    const blob = new Blob([state.currentOutput], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clean-text.txt";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    temporaryButtonText(downloadButton, "Downloaded");
  });

  advancedToggle.addEventListener("click", () => {
    const isOpen = advancedToggle.getAttribute("aria-expanded") === "true";
    advancedToggle.setAttribute("aria-expanded", String(!isOpen));
    advancedPanel.hidden = isOpen;
  });

  updateModeButtons();
  updateSwitchButtons();
  renderFromSource();
})();
