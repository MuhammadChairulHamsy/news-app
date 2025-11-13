const API_BASE = "http://localhost:5000/api/news";

export async function getNews(query = "tesla", category = "general") {
  try {
    const url = `${API_BASE}?q=${query || category}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (data.status === "ok" && data.articles) {
      return data.articles;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Gagal ambil berita", error);
    throw error;
  }
}
