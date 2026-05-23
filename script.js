const yearLabel = document.querySelector("[data-year]");
const textInput = document.querySelector("[data-text-input]");
const resultOutput = document.querySelector("[data-result-output]");
const copyButtons = Array.from(document.querySelectorAll("[data-copy-target]"));
const clearButtons = Array.from(document.querySelectorAll("[data-clear-target]"));
const toast = document.querySelector("[data-toast]");

if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.textContent = "";
  }, 1800);
}

function getTarget(selector) {
  return selector ? document.querySelector(selector) : null;
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = getTarget(button.dataset.copyTarget);
    const value = target?.value || target?.textContent || "";
    if (!value) {
      showToast("Nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied.");
    } catch {
      target?.select?.();
      showToast("Select and copy manually.");
    }
  });
});

clearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = getTarget(button.dataset.clearTarget);
    if (!target) return;
    target.value = "";
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.focus();
    showToast("Cleared.");
  });
});

function words(value) {
  return value.trim().match(/\S+/g) || [];
}

function sentences(value) {
  return value.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.filter((item) => item.trim()) || [];
}

function paragraphs(value) {
  return value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
}

function lines(value) {
  return value.split(/\r?\n/);
}

function toTitleCase(value) {
  return value.toLowerCase().replace(/\b[\p{L}\p{N}]/gu, (char) => char.toUpperCase());
}

function toSentenceCase(value) {
  return value
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function toWords(value) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(value) {
  const parts = toWords(value).map((part) => part.toLowerCase());
  return parts
    .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toPascalCase(value) {
  return toWords(value)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function toSeparatedCase(value, separator) {
  return toWords(value).map((part) => part.toLowerCase()).join(separator);
}

function slugify(value, separator = "-") {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`${separator}+`, "g"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}

function updateCounter() {
  if (!document.body.dataset.tool?.includes("counter") || !textInput) return;

  const value = textInput.value;
  const wordCount = words(value).length;
  const characterCount = value.length;
  const noSpaceCount = value.replace(/\s/g, "").length;
  const sentenceCount = value.trim() ? sentences(value).length : 0;
  const paragraphCount = value.trim() ? paragraphs(value).length : 0;
  const lineCount = value ? lines(value).length : 0;
  const readingMinutes = wordCount ? Math.max(1, Math.ceil(wordCount / 225)) : 0;
  const speakingMinutes = wordCount ? Math.max(1, Math.ceil(wordCount / 150)) : 0;

  const stats = {
    words: wordCount,
    characters: characterCount,
    "characters-no-spaces": noSpaceCount,
    sentences: sentenceCount,
    paragraphs: paragraphCount,
    lines: lineCount,
    "reading-time": readingMinutes ? `${readingMinutes} min` : "0 min",
    "speaking-time": speakingMinutes ? `${speakingMinutes} min` : "0 min",
  };

  Object.entries(stats).forEach(([key, valueForKey]) => {
    const node = document.querySelector(`[data-stat="${key}"]`);
    if (node) node.textContent = valueForKey;
  });
}

function updateCaseConverter(mode) {
  if (!document.body.dataset.tool?.includes("case") || !textInput || !resultOutput) return;
  const value = textInput.value;
  const conversions = {
    upper: value.toUpperCase(),
    lower: value.toLowerCase(),
    title: toTitleCase(value),
    sentence: toSentenceCase(value),
    camel: toCamelCase(value),
    pascal: toPascalCase(value),
    snake: toSeparatedCase(value, "_"),
    kebab: toSeparatedCase(value, "-"),
  };

  resultOutput.value = conversions[mode] ?? value;
}

function updateCleaner(action) {
  if (!document.body.dataset.tool?.includes("cleaner") || !textInput || !resultOutput) return;
  const value = textInput.value;
  const transforms = {
    spaces: value.replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").trim(),
    trim: lines(value).map((line) => line.trim()).join("\n"),
    empty: lines(value).filter((line) => line.trim()).join("\n"),
    breaks: value.replace(/\s*\r?\n\s*/g, " ").replace(/[ \t]+/g, " ").trim(),
    duplicates: Array.from(new Set(lines(value))).join("\n"),
    whitespace: value.replace(/\s+/g, " ").trim(),
  };

  resultOutput.value = transforms[action] ?? value;
}

function updateSorter(action) {
  if (!document.body.dataset.tool?.includes("sorter") || !textInput || !resultOutput) return;
  const original = lines(textInput.value).filter((line) => line.length);
  const transforms = {
    az: [...original].sort((a, b) => a.localeCompare(b)),
    za: [...original].sort((a, b) => b.localeCompare(a)),
    reverse: [...original].reverse(),
    length: [...original].sort((a, b) => a.length - b.length || a.localeCompare(b)),
    unique: Array.from(new Set(original)),
    random: [...original].sort(() => Math.random() - 0.5),
  };

  resultOutput.value = (transforms[action] || original).join("\n");
}

function updateSlug() {
  if (!document.body.dataset.tool?.includes("slug") || !textInput || !resultOutput) return;
  const separator = document.querySelector("[data-separator]")?.value || "-";
  resultOutput.value = slugify(textInput.value, separator);
}

function updateFindReplace() {
  if (!document.body.dataset.tool?.includes("find-replace") || !textInput || !resultOutput) return;

  const findValue = document.querySelector("[data-find]")?.value || "";
  const replaceValue = document.querySelector("[data-replace]")?.value || "";
  const caseSensitive = document.querySelector("[data-case-sensitive]")?.checked || false;
  const replaceAll = document.querySelector("[data-replace-all]")?.checked !== false;
  const flags = `${replaceAll ? "g" : ""}${caseSensitive ? "" : "i"}`;
  const escaped = findValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (!findValue) {
    resultOutput.value = textInput.value;
    const matchNode = document.querySelector("[data-match-count]");
    if (matchNode) matchNode.textContent = "0";
    return;
  }

  const expression = new RegExp(escaped, flags);
  const countExpression = new RegExp(escaped, caseSensitive ? "g" : "gi");
  const matches = textInput.value.match(countExpression) || [];

  resultOutput.value = textInput.value.replace(expression, replaceValue);
  const matchNode = document.querySelector("[data-match-count]");
  if (matchNode) matchNode.textContent = String(matches.length);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  updateCaseConverter(action);
  updateCleaner(action);
  updateSorter(action);
});

document.addEventListener("input", () => {
  updateCounter();
  updateSlug();
  updateFindReplace();
});

updateCounter();
updateSlug();
updateFindReplace();
