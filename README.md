# Chord Voicing Map

A simple guitar tool to visualize **close triad voicings** by inversion  
on **three consecutive strings**.

This app focuses on **practical, playable shapes only**,  
not exhaustive theoretical possibilities.

---

## Overview

- Displays **triad voicings (Major / Minor)** on guitar
- Shows **Root / 1st / 2nd inversion**
- Each inversion displays **one representative, playable shape**
- No fret numbers are shown — only relative shapes on the fretboard

The goal is to understand **how inversions map onto the fretboard**,  
not to list every possible fingering.

---

## Fixed Constraints (Important)

These constraints are intentional and define the entire system.

- Standard tuning only: **EADGBE**
- **Triads only** (Root, 3rd, 5th)
- **Close voicings only**
  - No octave duplication
  - No open or spread voicings
- **Three consecutive strings only**
  - String sets: `1–3`, `2–4`, `3–5`, `4–6`
- **Fret span ≤ 4**
  - Only shapes that fit within 4 frets are considered playable
- **One representative shape per inversion**
  - Chosen by minimal stretch

Anything outside these rules is deliberately excluded.

---

## User Controls

- **String Set**
  - `1–3`, `2–4`, `3–5`, `4–6`
- **Chord Quality**
  - `Maj` / `min`
  - Default on load: `Maj`
- **Inversions**
  - `Root`, `1st`, `2nd`
  - Always displayed together

---

## Inversion Definition

Inversion is defined **only by the lowest note**:

- `Root` : Root is the bass
- `1st`  : 3rd is the bass
- `2nd`  : 5th is the bass

The ordering of the other two notes does **not** affect inversion,  
but it does affect the **shape**.

---

## Shape Generation Logic (Summary)

Shapes are generated algorithmically, not hard-coded.

- For each inversion, interval sets (from bass) are fixed:

### Major
- Root: `[0, 4, 7]`
- 1st:  `[0, 3, 8]`
- 2nd:  `[0, 5, 9]`

### Minor
- Root: `[0, 3, 7]`
- 1st:  `[0, 4, 9]`
- 2nd:  `[0, 5, 8]`

- All fret combinations within `0..4` are brute-forced
- Valid shapes must satisfy:
  - Actual pitch strictly increases from low → high string
  - No duplicated chord tones
  - Total fret span ≤ 4

If multiple candidates exist, the **most compact** shape is selected:
- Lowest total fret sum
- Then lowest maximum fret

---

## Display Rules

- Fret numbers are **not displayed**
- Shapes are shown on a **3×5 grid**
- Only string numbers are shown
- Each pressed position is marked with a dot:
  - Major: `R`, `3`, `5`
  - Minor: `R`, `m3`, `5`

This keeps the focus on **structure**, not position memorization.

---

## Non-goals

The following are intentionally out of scope:

- 7th chords or tensions
- Open voicings
- Alternate tunings
- Wide stretches (>4 frets)
- Multiple shapes per inversion

These may be added later, but are excluded from the core design.

---

## Design Philosophy

This project prioritizes:

- Playability over completeness
- Clarity over flexibility
- Structural understanding over raw chord lookup

The app is meant to show **why** shapes work, not just **what** to play.
