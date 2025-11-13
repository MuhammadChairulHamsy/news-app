export const articlesContainer = document.getElementById("articles");
export const statusDiv = document.getElementById("status");
export const modal = document.getElementById("modal");
export const modalBody = document.getElementById("modal-body");
export const modalClose = document.getElementById("modal-close");

// Menampilkan pesan status
export function showStatus(message, type = "info") {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.removeAttribute("hidden");

  setTimeout(() => {
    statusDiv.setAttribute("hidden", "");
  }, 3000);
}

// Menampilkan daftar artikel
export function displayArticles(articles) {
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
            <img src="${imageUrl}" alt="${title}" 
              onerror="this.src='https://via.placeholder.com/640x360?text=No+Image'" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">${title}</h2>
            <p class="card-excerpt">${description.substring(0, 120)}...</p>
            <div class="meta">
              <time datetime="${article.publishedAt}">${publishedAt}</time>
              <span class="source">${source}</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-sm read-more-btn" 
                data-article='${JSON.stringify(article).replace(/'/g, "&apos;")}'>Read more</button>
              <a href="${article.url}" target="_blank" 
                class="btn btn-outline btn-sm">Open source</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Tambahkan event ke setiap tombol “Read more”
  document.querySelectorAll(".read-more-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const article = JSON.parse(e.target.dataset.article);
      openModal(article);
    });
  });
}

// Tampilkan modal artikel
export function openModal(article) {
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

// Tutup modal
export function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("show");
}
