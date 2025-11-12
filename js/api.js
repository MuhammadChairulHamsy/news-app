const BASE_URL = "https://newsapi.org/v2/everything";
const API_KEY = "a96b36ec4cf54815881fb3431f092f0a";

export const getNews = async () => {
  try {
    const url = `${BASE_URL}?q=tesla&from=2025-10-12&sortBy=publishedAt&apiKey=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Data tidak Ditemukan");
    }
    const data = await res.json();

    console.log(data);
    return data;
  } catch (error) {
    console.error("Gagal ambil data", error.message);
  }
};
getNews();
