const API_BASE = "http://localhost:5000/api/news";

// State management
let currentCategory = "general";
let currentQuery = "";
let isLoading = false;

// DOM Elements
const articlesContainer = document.getElementById("articles");
const statusDiv = document.getElementById("status");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("btn-search");
const loadMoreBtn = document.getElementById("load-more");
const categoryButtons = document.querySelectorAll(".chip");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
const themeToggle = document.getElementById("theme-toggle");

// Fetch news from backend
async function getNews(query = "tesla", category = "general") {
  try {
    isLoading = true;
    showStatus("Loading news...", "info");
    
    const url = `${API_BASE}?q=${query || category}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "ok" && data.articles) {
      displayArticles(data.articles);
      showStatus(`Loaded ${data.articles.length} articles`, "success");
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Gagal ambil berita", error);
    showStatus(`Error: ${error.message}`, "error");
    articlesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:2rem;">
        <p style="color: var(--muted);">❌ Failed to load news. Please check your backend server.</p>
      </div>
    `;
  } finally {
    isLoading = false;
  }
}

// Display articles in grid
function displayArticles(articles) {
  if (!articles || articles.length === 0) {
    articlesContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:2rem;">
        <p style="color: var(--muted);">No articles found</p>
      </div>
    `;
    return;
  }

  articlesContainer.innerHTML = articles
    .map((article) => {
      const title = article.title || "No title";
      const description = article.description || "No description available";
      const imageUrl = article.urlToImage || "https://via.placeholder.com/640x360?text=No+Image";
      const source = article.source?.name || "Unknown";
      const publishedAt = new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return `
        <article class="card" data-url="${article.url}">
          <figure class="card-media">
            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/640x360?text=No+Image'" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">${title}</h2>
            <p class="card-excerpt">${description.substring(0, 120)}...</p>
            <div class="meta">
              <time datetime="${article.publishedAt}">${publishedAt}</time>
              <span class="source">${source}</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-sm read-more-btn" data-article='${JSON.stringify(article).replace(/'/g, "&apos;")}'>Read more</button>
              <a href="${article.url}" target="_blank" class="btn btn-outline btn-sm">Open source</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Add event listeners to "Read more" buttons
  document.querySelectorAll(".read-more-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const article = JSON.parse(e.target.dataset.article);
      openModal(article);
    });
  });
}

// Show status message
function showStatus(message, type = "info") {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.removeAttribute("hidden");
  
  setTimeout(() => {
    statusDiv.setAttribute("hidden", "");
  }, 3000);
}

// Open modal with article details
function openModal(article) {
  modalBody.innerHTML = `
    <img src="${article.urlToImage || 'https://via.placeholder.com/900x400?text=No+Image'}" alt="${article.title}" />
    <h2>${article.title}</h2>
    <div class="meta" style="margin-bottom: 1rem;">
      <time>${new Date(article.publishedAt).toLocaleString()}</time>
      <span class="source">${article.source?.name || "Unknown"}</span>
    </div>
    <p>${article.description || ""}</p>
    <p style="color: var(--muted); margin-top: 1rem;">${article.content || "Full content available at source."}</p>
    <a href="${article.url}" target="_blank" class="btn" style="margin-top: 1rem; display: inline-block;">Read full article</a>
  `;
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("show");
}

// Close modal
function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("show");
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    currentQuery = query;
    getNews(query, currentCategory);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    
    currentCategory = btn.dataset.category;
    const query = currentQuery || currentCategory;
    getNews(query, currentCategory);
  });
});

loadMoreBtn.addEventListener("click", () => {
  const query = currentQuery || currentCategory;
  getNews(query, currentCategory);
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Theme toggle (dark/light)
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Initial load
getNews("tesla", "general");