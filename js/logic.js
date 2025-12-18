(function (global) {
  const { STRING_TUNINGS, STRING_SETS, QUALITIES, FRET_RANGE } = global.CHORD_CONFIG;

  const cache = new Map();

  const pitchOrder = (strings) => [...strings].sort((a, b) => b - a); // low pitch (largest number) -> high pitch

  const strictlyAscending = (values) => {
    for (let i = 1; i < values.length; i += 1) {
      if (values[i] <= values[i - 1]) return false;
    }
    return true;
  };

  const arraysEqual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

  const scoreFrets = (frets) => {
    const vals = Object.values(frets);
    return {
      sum: vals.reduce((acc, n) => acc + n, 0),
      max: Math.max(...vals),
      min: Math.min(...vals),
    };
  };

  function normalizeIds(stringSetId, qualityKey) {
    const set = STRING_SETS.find((s) => s.id === stringSetId) || STRING_SETS[0];
    const quality = QUALITIES[qualityKey] ? qualityKey : "maj";
    return { set, quality };
  }

  function generateShape(stringSetId, qualityKey, inversionKey) {
    const cacheKey = `${stringSetId}:${qualityKey}:${inversionKey}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const { set, quality } = normalizeIds(stringSetId, qualityKey);
    const intervals = QUALITIES[quality].intervals[inversionKey];
    const degrees = QUALITIES[quality].degrees[inversionKey];
    if (!intervals || !degrees) return null;

    const orderedStrings = pitchOrder(set.strings);
    const intervalToDegree = {};
    intervals.forEach((intv, idx) => {
      intervalToDegree[intv] = degrees[idx];
    });

    let best = null;
    const [s0, s1, s2] = set.strings;

    for (let f0 = FRET_RANGE.min; f0 <= FRET_RANGE.max; f0 += 1) {
      for (let f1 = FRET_RANGE.min; f1 <= FRET_RANGE.max; f1 += 1) {
        for (let f2 = FRET_RANGE.min; f2 <= FRET_RANGE.max; f2 += 1) {
          const frets = { [s0]: f0, [s1]: f1, [s2]: f2 };
          const span = Math.max(f0, f1, f2) - Math.min(f0, f1, f2);
          if (span > 4) continue;

          const pitches = orderedStrings.map((s) => STRING_TUNINGS[s] + frets[s]);
          if (!strictlyAscending(pitches)) continue;

          const rel = pitches.map((p) => p - pitches[0]);
          if (!arraysEqual(rel, intervals)) continue;

          const score = scoreFrets(frets);
          if (
            !best ||
            score.sum < best.score.sum ||
            (score.sum === best.score.sum && score.max < best.score.max)
          ) {
            best = {
              frets,
              basePitch: pitches[0],
              orderedStrings,
              score,
            };
          }
        }
      }
    }

    if (!best) {
      cache.set(cacheKey, null);
      return null;
    }

    const points = orderedStrings.map((string) => {
      const fret = best.frets[string];
      const interval = STRING_TUNINGS[string] + fret - best.basePitch;
      return {
        string,
        fret,
        label: intervalToDegree[interval] || "",
      };
    });

    const result = {
      stringSet: set,
      quality,
      inversion: inversionKey,
      points,
      orderedStrings,
      frets: best.frets,
    };

    cache.set(cacheKey, result);
    return result;
  }

  global.ChordLogic = {
    generateShape,
  };
})(window);
