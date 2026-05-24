(() => {
  const inputText = document.querySelector("#inputText");
  const outputText = document.querySelector("#outputText");
  const pasteButton = document.querySelector("#pasteButton");
  const sampleButton = document.querySelector("#sampleButton");
  const clearButton = document.querySelector("#clearButton");
  const copyButton = document.querySelector("#copyButton");
  const downloadButton = document.querySelector("#downloadButton");
  const advancedToggle = document.querySelector("#advancedToggle");
  const advancedPanel = document.querySelector("#advancedPanel");
  const findText = document.querySelector("#findText");
  const replaceText = document.querySelector("#replaceText");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];
  const switchButtons = [...document.querySelectorAll("[data-setting]")];
  const presetButtons = [...document.querySelectorAll("[data-preset]")];

  if (!inputText || !outputText) {
    return;
  }

  const state = {
    mode: "paragraph",
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
    outputLines: document.querySelector("#outputLines"),
    brokenLinesCount: document.querySelector("#brokenLinesCount"),
    extraSpacesCount: document.querySelector("#extraSpacesCount"),
    blankLinesCount: document.querySelector("#blankLinesCount"),
    duplicateLinesCount: document.querySelector("#duplicateLinesCount")
  };

  function countWords(text) {
    const matches = text.trim().match(/\S+/g);
    return matches ? matches.length : 0;
  }

  function countLines(text) {
    return text.length ? text.split("\n").length : 0;
  }

  function updateTextStats(prefix, text) {
    statLabels[`${prefix}Words`].textContent = String(countWords(text));
    statLabels[`${prefix}Chars`].textContent = String(text.length);
    statLabels[`${prefix}Lines`].textContent = String(countLines(text));
  }

  function isBulletLine(line) {
    return /^\s*(?:[-*\u2022]|[0-9]+[.)]|[a-zA-Z][.)])\s+/.test(line);
  }

  function looksLikeSentenceEnd(line) {
    return /[.!?:;)"'\]]\s*$/.test(line);
  }

  function detectIssues(text) {
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    const seen = new Set();
    let duplicates = 0;
    let broken = 0;

    lines.forEach((line, index) => {
      const current = line.trim();
      const next = lines[index + 1] ? lines[index + 1].trim() : "";

      if (current) {
        const key = current.toLowerCase();
        if (seen.has(key)) {
          duplicates += 1;
        }
        seen.add(key);
      }

      if (
        current &&
        next &&
        !isBulletLine(current) &&
        !isBulletLine(next) &&
        !looksLikeSentenceEnd(current) &&
        current.length > 18
      ) {
        broken += 1;
      }
    });

    return {
      blankLines: lines.filter((line) => !line.trim()).length,
      duplicates,
      extraSpaces: (text.match(/[^\S\r\n]{2,}/g) || []).length,
      broken
    };
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

  function applyFindReplace(text) {
    const findValue = findText.value;

    if (!findValue) {
      return text;
    }

    const flags = state.settings.matchCase ? "g" : "gi";
    const pattern = new RegExp(escapeRegExp(findValue), flags);

    return text.replace(pattern, replaceText.value);
  }

  function cleanText(rawText) {
    let next = normalizeBasic(rawText);
    next = shapeText(next);

    if (state.settings.fixPunctuation) {
      next = fixPunctuationSpacing(next);
    }

    next = applyFindReplace(next);

    return next;
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
    render();
  }

  function updateInsights(text) {
    const issues = detectIssues(text);
    statLabels.brokenLinesCount.textContent = String(issues.broken);
    statLabels.extraSpacesCount.textContent = String(issues.extraSpaces);
    statLabels.blankLinesCount.textContent = String(issues.blankLines);
    statLabels.duplicateLinesCount.textContent = String(issues.duplicates);
  }

  function render() {
    const input = inputText.value;
    const output = cleanText(input);

    outputText.value = output;
    updateTextStats("input", input);
    updateTextStats("output", output);
    updateInsights(input);
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

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      updateModeButtons();
      setPresetActive("");
      render();
    });
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const setting = button.dataset.setting;
      state.settings[setting] = !state.settings[setting];
      updateSwitchButtons();
      setPresetActive("");
      render();
    });
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyPreset(button.dataset.preset);
    });
  });

  inputText.addEventListener("input", render);
  findText.addEventListener("input", render);
  replaceText.addEventListener("input", render);

  pasteButton.addEventListener("click", async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      inputText.value = clipboardText;
      inputText.focus();
      render();
      temporaryButtonText(pasteButton, "Pasted");
    } catch (error) {
      inputText.focus();
      temporaryButtonText(pasteButton, "Paste here");
    }
  });

  sampleButton.addEventListener("click", () => {
    inputText.value = sample;
    inputText.focus();
    render();
  });

  clearButton.addEventListener("click", () => {
    inputText.value = "";
    inputText.focus();
    render();
  });

  copyButton.addEventListener("click", async () => {
    if (!outputText.value) {
      temporaryButtonText(copyButton, "No text");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText.value);
      temporaryButtonText(copyButton, "Copied!");
    } catch (error) {
      outputText.focus();
      outputText.select();
      temporaryButtonText(copyButton, "Select text");
    }
  });

  downloadButton.addEventListener("click", () => {
    if (!outputText.value) {
      temporaryButtonText(downloadButton, "No text");
      return;
    }

    const blob = new Blob([outputText.value], { type: "text/plain;charset=utf-8" });
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
  render();
})();
