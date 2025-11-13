import { getNews } from "./api.js";
import { displayArticles, showStatus, closeModal, modal, modalClose } from "./ui.js";

let currentCategory = "general";
let currentQuery = "";
let isLoading = false;

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn-search");
const loadMoreBtn = document.getElementById("load-more");
const categoryButtons = document.querySelectorAll(".chip");
const themeToggle = document.getElementById("theme-toggle");

// Fungsi utama memanggil API
async function fetchAndRenderNews(query = "tesla", category = "general") {
  try {
    if (isLoading) return;
    isLoading = true;
    showStatus("Loading news...", "info");

    const articles = await getNews(query, category);
    displayArticles(articles);
    showStatus(`Loaded ${articles.length} articles`, "success");
  } catch (error) {
    showStatus(`Error: ${error.message}`, "error");
  } finally {
    isLoading = false;
  }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    currentQuery = query;
    fetchAndRenderNews(query, currentCategory);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentCategory = btn.dataset.category;
    const query = currentQuery || currentCategory;
    fetchAndRenderNews(query, currentCategory);
  });
});

loadMoreBtn.addEventListener("click", () => {
  fetchAndRenderNews(currentQuery || currentCategory, currentCategory);
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Toggle tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

// Tahun footer
document.getElementById("year").textContent = new Date().getFullYear();

// Load awal
fetchAndRenderNews("tesla", "general");
