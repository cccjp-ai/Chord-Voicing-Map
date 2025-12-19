(function (global) {
  const { STRING_SETS, QUALITIES, INVERSIONS, FRET_RANGE } = global.CHORD_CONFIG;
  const { generateShape } = global.ChordLogic;

  const stringSetGroup = document.getElementById("stringSet");
  const stringSetPreviewWrap = document.getElementById("stringSetPreviewWrap");
  const stringSetPreview = document.getElementById("stringSetPreview");
  const qualityButtons = Array.from(document.querySelectorAll(".seg-button[data-quality]"));
  const cards = Array.from(document.querySelectorAll(".inversion-card"));
  const liveRegion = document.getElementById("shape-live");
  let stringSetButtons = [];

  function getInversionLabel(key) {
    const item = INVERSIONS.find((inv) => inv.key === key);
    return item ? item.label : key;
  }

  function populateStringSets() {
    stringSetGroup.innerHTML = "";
    const orderedSets = [...STRING_SETS];
    stringSetButtons = orderedSets.map((set, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seg-button";
      btn.textContent = set.label;
      btn.dataset.stringSet = set.id;
      btn.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      if (index === 0) btn.classList.add("is-active");
      stringSetGroup.appendChild(btn);
      return btn;
    });
  }

  function currentStringSet() {
    const active = stringSetButtons.find((btn) => btn.classList.contains("is-active"));
    return active ? active.dataset.stringSet : STRING_SETS[0].id;
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

    const strings = [...shape.stringSet.strings].sort((a, b) => a - b);
    labelsEl.style.setProperty("--rows", strings.length);
    labelsEl.innerHTML = strings.map((s) => `<span>Str ${s}</span>`).join("");

    grid.innerHTML = "";
    const rows = strings.length;
    const cols = FRET_RANGE.max - FRET_RANGE.min + 1;
    const totalCols = 5;
    const leftPaddingCols =
      (qualityKey === "min" && shape.stringSet.id === "1-3" && shape.inversion === "first") ||
      (qualityKey === "maj" && shape.stringSet.id === "2-4" && shape.inversion === "second")
        ? 2
        : 1;
    const visibleFrets = Math.min(totalCols - leftPaddingCols, cols);
    const maxFret = FRET_RANGE.min + visibleFrets - 1;
    grid.style.setProperty("--rows", rows);
    grid.style.setProperty("--cols", totalCols);

    const pointLookup = new Map(
      shape.points.map((p) => [`${p.string}:${p.fret}`, p])
    );

    for (let r = 0; r < strings.length; r += 1) {
      for (let pad = 0; pad < leftPaddingCols; pad += 1) {
        const spacer = document.createElement("div");
        spacer.className = "grid-cell";
        grid.appendChild(spacer);
      }
      for (let fret = FRET_RANGE.min; fret <= maxFret; fret += 1) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";

        const key = `${strings[r]}:${fret}`;
        if (pointLookup.has(key)) {
          const note = document.createElement("div");
          note.className = `note ${qualityClass(qualityKey)}`;
          const label = pointLookup.get(key).label;
          note.textContent = label;
          if (label === "R") note.classList.add("note-root");
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
    const setId = currentStringSet();
    const quality = currentQuality();
    const shapes = INVERSIONS.map((inv) => ({
      inversion: inv.key,
      shape: generateShape(setId, quality, inv.key),
    }));

    if (stringSetPreview && stringSetPreviewWrap) {
      const set = STRING_SETS.find((item) => item.id === setId);
      if (set) {
        stringSetPreview.src = `img/${set.id}.png`;
        stringSetPreview.alt = `String set ${set.label}`;
        stringSetPreviewWrap.classList.remove("is-hidden");
      } else {
        stringSetPreview.src = "";
        stringSetPreview.alt = "";
        stringSetPreviewWrap.classList.add("is-hidden");
      }
    }

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
    stringSetButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        stringSetButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        render();
      });
    });

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
