(function (global) {
  const STRING_TUNINGS = {
    1: 64, // E4
    2: 59, // B3
    3: 55, // G3
    4: 50, // D3
    5: 45, // A2
    6: 40, // E2
  };

  const STRING_SETS = [
    { id: "1-3", label: "1–3", strings: [1, 2, 3] },
    { id: "2-4", label: "2–4", strings: [2, 3, 4] },
    { id: "3-5", label: "3–5", strings: [3, 4, 5] },
    { id: "4-6", label: "4–6", strings: [4, 5, 6] },
  ];

  const QUALITIES = {
    maj: {
      label: "Maj",
      intervals: {
        root: [0, 4, 7],
        first: [0, 3, 8],
        second: [0, 5, 9],
      },
      degrees: {
        root: ["R", "3", "5"],
        first: ["3", "5", "R"],
        second: ["5", "R", "3"],
      },
    },
    min: {
      label: "min",
      intervals: {
        root: [0, 3, 7],
        first: [0, 4, 9],
        second: [0, 5, 8],
      },
      degrees: {
        root: ["R", "m3", "5"],
        first: ["m3", "5", "R"],
        second: ["5", "R", "m3"],
      },
    },
  };

  const FRET_RANGE = { min: 0, max: 4 };

  const INVERSIONS = [
    { key: "root", label: "Root" },
    { key: "first", label: "1st" },
    { key: "second", label: "2nd" },
  ];

  global.CHORD_CONFIG = {
    STRING_TUNINGS,
    STRING_SETS,
    QUALITIES,
    FRET_RANGE,
    INVERSIONS,
  };
})(window);
