/* projects page filter
   - filter pills toggle visible category
   - cards have data-category="research|data|tools|reading"
   - category headings hide when their category is filtered out or empty
   - counts in pills auto-derived from cards
*/
(function () {
  const filterBar = document.querySelector(".filters");
  if (!filterBar) return;

  const pills = filterBar.querySelectorAll(".filter-pill");
  const cards = document.querySelectorAll(".grid-projects .card");
  const headings = document.querySelectorAll(".category-heading");

  // populate counts on pills
  const counts = { all: cards.length };
  cards.forEach(c => {
    const cat = c.dataset.category;
    counts[cat] = (counts[cat] || 0) + 1;
  });
  pills.forEach(p => {
    const c = counts[p.dataset.filter] || 0;
    const span = p.querySelector(".count");
    if (span) span.textContent = c;
  });

  function applyFilter(filter) {
    cards.forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-filtered-out", !match);
    });
    // hide a heading when its grid has no visible cards under the active filter
    headings.forEach(h => {
      if (filter === "all") {
        h.classList.remove("is-hidden");
      } else {
        h.classList.toggle("is-hidden", h.dataset.category !== filter);
      }
    });
    pills.forEach(p => {
      p.classList.toggle("active", p.dataset.filter === filter);
    });
  }

  pills.forEach(p => {
    p.addEventListener("click", () => applyFilter(p.dataset.filter));
  });

  // boot
  applyFilter("all");
})();
