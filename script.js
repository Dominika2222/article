import { format } from "https://cdn.skypack.dev/date-fns";

const SUPABASE_URL = "https://ikgygbhwmdttsomkfxiy.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZ3lnYmh3bWR0dHNvbWtmeGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjAyMTMsImV4cCI6MjA2MzIzNjIxM30.6F0ZtryV1Io7aH3EIUQqy_CkAtgIsN-NdFZoSklYRYc";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function fetchArticles(orderBy = "created_at.desc") {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/article?select=*&order=${orderBy}`,
    { headers }
  );
  const articles = await res.json();

  const container = document.getElementById("articles");
  container.innerHTML = "";

  articles.forEach((article) => {
    const formattedDate = format(new Date(article.created_at), "dd-MM-yyyy");

    container.innerHTML += `
      <article>
        <h2>${article.title}</h2>
        <h3>${article.subtitle}</h3>
        <p><strong>Autor:</strong> ${article.author}</p>
        <p><strong>Data:</strong> ${formattedDate}</p>
        <p>${article.content}</p>
        <hr/>
      </article>
    `;
  });
}

document.getElementById("sortSelect").addEventListener("change", (e) => {
  fetchArticles(e.target.value);
});

document.getElementById("articleForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    title: form.title.value,
    subtitle: form.subtitle.value,
    author: form.author.value,
    content: form.content.value,
    created_at: form.created_at.value,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/article`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (res.ok) {
    form.reset();
    fetchArticles();
  } else {
    alert("Błąd podczas dodawania artykułu.");
  }
});

fetchArticles();