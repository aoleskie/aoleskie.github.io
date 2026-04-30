/* reading page — interactive map + searchable list */

(async function () {
  const [books, world] = await Promise.all([
    fetch("data/books.json").then(r => r.json()),
    fetch("data/world-50m.json").then(r => r.json()),
  ]);

  // index by topojson numeric id (zero-padded string e.g. "032")
  const byId = new Map(books.map(b => [b.id, b]));

  // ─── meta line ─────────────────────────────────────────
  const ratings = books.map(b => b.rating).filter(r => r !== null);
  const readN = ratings.length;
  const totalN = books.length;
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  document.getElementById("meta-progress").textContent = `${readN} of ${totalN}`;
  document.getElementById("meta-avg").textContent = `avg rating ${avg.toFixed(1)}`;

  // ─── color scale ───────────────────────────────────────
  // matches the 5-stop legend in the CSS: low magenta-teal → high
  const colorScale = d3.scaleLinear()
    .domain([2, 4, 6, 8, 10])
    .range(["#145068", "#2b7d8a", "#88a39c", "#d68aa3", "#ff2e6e"])
    .clamp(true);

  function fillFor(b) {
    if (!b) return "#ede4d3";
    if (b.status === "read") return colorScale(b.rating);
    if (b.status === "arrived") return "#b8aa8e";
    return "#ede4d3";
  }

  // ─── map ───────────────────────────────────────────────
  const mapEl = document.getElementById("map");
  const tooltipEl = document.getElementById("tooltip");
  const W = mapEl.clientWidth;
  const H = mapEl.clientHeight;

  const svg = d3.select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Natural Earth (equirectangular-ish) with the antarctic region trimmed
  // by clipping the projection's vertical extent
  const projection = d3.geoNaturalEarth1()
    .fitExtent([[6, 6], [W - 6, H - 6]],
               { type: "Sphere" });
  const path = d3.geoPath(projection);

  svg.append("path")
    .datum({ type: "Sphere" })
    .attr("class", "sphere")
    .attr("d", path);

  svg.append("path")
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path);

  const countriesGeo = topojson.feature(world, world.objects.countries);

  const countries = svg.append("g")
    .selectAll("path")
    .data(countriesGeo.features)
    .join("path")
    .attr("class", d => {
      const b = byId.get(d.id);
      if (!b) return "country";
      return `country ${b.status}`;
    })
    .attr("fill", d => fillFor(byId.get(d.id)))
    .attr("d", path)
    .on("mousemove", (event, d) => {
      const b = byId.get(d.id);
      if (!b) return;  // a region we don't track (e.g. antarctica, w. sahara)
      showTooltip(event, b);
    })
    .on("mouseout", hideTooltip)
    .on("click", (event, d) => {
      const b = byId.get(d.id);
      if (!b) return;
      focusCountry(b.id);
    });

  function showTooltip(event, b) {
    const rect = mapEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let html = `<div class="tt-country">${escapeHtml(b.country)}</div>`;
    if (b.book) {
      html += `<div class="tt-title">${escapeHtml(b.book)}</div>`;
      if (b.author) html += `<div class="tt-author">${escapeHtml(b.author)}</div>`;
    } else {
      html += `<div class="tt-title">—</div>`;
    }
    if (b.rating !== null) {
      html += `<div class="tt-rating">rated ${b.rating}/10</div>`;
    } else {
      html += `<div class="tt-status">${b.status}</div>`;
    }
    tooltipEl.innerHTML = html;
    tooltipEl.classList.add("visible");

    // position with bounds checking
    const tt = tooltipEl.getBoundingClientRect();
    let left = x + 14;
    let top = y + 14;
    if (left + tt.width > rect.width - 8) left = x - tt.width - 14;
    if (top + tt.height > rect.height - 8) top = y - tt.height - 14;
    tooltipEl.style.left = left + "px";
    tooltipEl.style.top = top + "px";
  }
  function hideTooltip() {
    tooltipEl.classList.remove("visible");
  }

  // ─── filter pills ──────────────────────────────────────
  const mapBtns = document.querySelectorAll(".map-btn");
  mapBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      mapBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const show = btn.dataset.show;
      countries.classed("dimmed", d => {
        const b = byId.get(d.id);
        if (show === "all") return false;
        if (!b) return true;
        if (show === "read") return b.status !== "read";
        if (show === "unread") return b.status === "read";
        return false;
      });
    });
  });

  // ─── list ──────────────────────────────────────────────
  const listEl = document.getElementById("book-list");
  function renderList(records) {
    listEl.innerHTML = records.map(b => {
      const swatch = `<span class="swatch-cell" style="background: ${fillFor(b)}"></span>`;
      const country = `<span class="country-cell">${escapeHtml(b.country)}</span>`;
      let bookCell;
      if (b.book) {
        bookCell = `<span class="book-cell"><span class="title">${escapeHtml(b.book)}</span>${b.author ? ` <span class="author">— ${escapeHtml(b.author)}</span>` : ""}</span>`;
      } else {
        bookCell = `<span class="book-cell"><span class="empty">no entry yet</span></span>`;
      }
      const rating = b.rating !== null
        ? `<span class="rating-cell">${b.rating}/10</span>`
        : `<span class="rating-cell"><span class="none">${b.status}</span></span>`;
      return `<li id="row-${b.id}" data-id="${b.id}">${swatch}${country}${bookCell}${rating}</li>`;
    }).join("");
  }

  // sort options
  const sortFns = {
    alpha: (a, b) => a.country.localeCompare(b.country),
    "rating-desc": (a, b) => {
      const ar = a.rating === null ? -Infinity : a.rating;
      const br = b.rating === null ? -Infinity : b.rating;
      return br - ar || a.country.localeCompare(b.country);
    },
    "rating-asc": (a, b) => {
      const ar = a.rating === null ? Infinity : a.rating;
      const br = b.rating === null ? Infinity : b.rating;
      return ar - br || a.country.localeCompare(b.country);
    },
    status: (a, b) => {
      const order = { read: 0, arrived: 1, planned: 2, none: 3 };
      return order[a.status] - order[b.status] || a.country.localeCompare(b.country);
    },
  };

  let currentRecords = [...books].sort(sortFns.alpha);
  renderList(currentRecords);

  document.getElementById("sort").addEventListener("change", e => {
    currentRecords = [...currentRecords].sort(sortFns[e.target.value]);
    renderList(currentRecords);
    applySearch(document.getElementById("search").value);
  });

  function applySearch(q) {
    q = q.trim().toLowerCase();
    document.querySelectorAll("#book-list li").forEach(li => {
      if (!q) { li.classList.remove("is-hidden"); return; }
      const text = li.textContent.toLowerCase();
      li.classList.toggle("is-hidden", !text.includes(q));
    });
  }
  document.getElementById("search").addEventListener("input", e => applySearch(e.target.value));

  // ─── click-from-map → scroll to row ────────────────────
  function focusCountry(id) {
    document.querySelectorAll(".book-list li").forEach(li => li.classList.remove("highlighted"));
    countries.classed("focused", d => d.id === id);
    const row = document.getElementById("row-" + id);
    if (row) {
      row.classList.add("highlighted");
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => row.classList.remove("highlighted"), 2400);
    }
  }

  // ─── helpers ───────────────────────────────────────────
  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
