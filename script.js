const yearLabel = document.querySelector("[data-year]");

if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}
