(function (global) {
  const { STRING_SETS, QUALITIES, INVERSIONS, FRET_RANGE } = global.CHORD_CONFIG;
  const { generateShape } = global.ChordLogic;

  const stringSetSelect = document.getElementById("stringSet");
  const qualityButtons = Array.from(document.querySelectorAll(".seg-button"));
  const cards = Array.from(document.querySelectorAll(".inversion-card"));
  const liveRegion = document.getElementById("shape-live");

  function getInversionLabel(key) {
    const item = INVERSIONS.find((inv) => inv.key === key);
    return item ? item.label : key;
  }

  function populateStringSets() {
    STRING_SETS.forEach((set) => {
      const opt = document.createElement("option");
      opt.value = set.id;
      opt.textContent = set.label;
      stringSetSelect.appendChild(opt);
    });
    stringSetSelect.value = STRING_SETS[0].id;
  }

  function currentQuality() {
    const active = qualityButtons.find((btn) => btn.classList.contains("is-active"));
    return active ? active.dataset.quality : "maj";
  }

  function qualityClass(qualityKey) {
    return qualityKey === "min" ? "note-minor" : "note-major";
  }

  function renderCard(card, shape, qualityKey) {
    const labelsEl = card.querySelector(".string-labels");
    const grid = card.querySelector(".fret-grid");

    if (!shape) {
      labelsEl.innerHTML = "";
      grid.innerHTML = '<p class="muted-note">No playable shape</p>';
      return;
    }

    const strings = shape.orderedStrings;
    labelsEl.innerHTML = strings.map((s) => `<span>Str ${s}</span>`).join("");

    grid.innerHTML = "";
    const rows = FRET_RANGE.max - FRET_RANGE.min + 1;
    grid.style.setProperty("--rows", rows);

    const pointLookup = new Map(
      shape.points.map((p) => [`${p.string}:${p.fret}`, p])
    );

    for (let fret = FRET_RANGE.min; fret <= FRET_RANGE.max; fret += 1) {
      for (let c = 0; c < strings.length; c += 1) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";

        const key = `${strings[c]}:${fret}`;
        if (pointLookup.has(key)) {
          const note = document.createElement("div");
          note.className = `note ${qualityClass(qualityKey)}`;
          note.textContent = pointLookup.get(key).label;
          cell.appendChild(note);
        }

        grid.appendChild(cell);
      }
    }

    grid.setAttribute(
      "aria-label",
      `${getInversionLabel(shape.inversion)} inversion on strings ${shape.stringSet.label}, ${QUALITIES[qualityKey].label}`
    );
  }

  function render() {
    const setId = stringSetSelect.value;
    const quality = currentQuality();
    const shapes = INVERSIONS.map((inv) => ({
      inversion: inv.key,
      shape: generateShape(setId, quality, inv.key),
    }));

    shapes.forEach(({ inversion, shape }) => {
      const card = cards.find((c) => c.dataset.inversion === inversion);
      if (card) renderCard(card, shape, quality);
    });

    const summary = shapes
      .map(({ inversion, shape }) => {
        if (!shape) return `${getInversionLabel(inversion)}: no shape`;
        const detail = shape.points
          .map((p) => `str ${p.string} fret ${p.fret} (${p.label})`)
          .join(", ");
        return `${getInversionLabel(inversion)}: ${detail}`;
      })
      .join(" | ");

    liveRegion.textContent = `Strings ${setId}, ${QUALITIES[quality].label}. ${summary}`;
  }

  function bindEvents() {
    stringSetSelect.addEventListener("change", render);

    qualityButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        qualityButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        render();
      });
    });
  }

  function init() {
    populateStringSets();
    bindEvents();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
