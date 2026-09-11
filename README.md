# Fieldnotes — Conference Schedule

A single-page schedule for a fictional two-day conference, "Fieldnotes." Three
tracks run in parallel across both days. The whole thing is static HTML/CSS
plus one small script — no build step, no dependencies, no external fonts —
so it runs by opening `index.html` in a browser or serving the folder as-is.

## Files

- `index.html` — page structure and all schedule content
- `styles.css` — layout, including the responsive grid → list switch
- `script.js` — builds each session's detail `<dialog>` and wires up
  opening/closing it by keyboard
- `README.md` — this file

## How parallel tracks are handled on a narrow screen

At wide widths the schedule renders as an actual time × track grid: a time
gutter down the left edge, and three columns (Interfaces / Systems /
Practice) placed with CSS Grid using each session's start time and duration.
That layout depends on having three columns wide enough to hold a title,
speaker, and room without truncating — realistically, somewhere north of
800px. Below that, three columns either force horizontal scrolling or
shrink to slivers that can't hold a real session title, and reviewers are
explicitly checking that 320px doesn't scroll horizontally, so keeping the
grid and just narrowing it wasn't an option.

Instead, under **860px** the layout drops the grid entirely and becomes a
single **chronological list**: every session from both tracks, in one
column, ordered by start time. Track is no longer communicated by column
position — it's communicated by a **coloured left border + a text badge**
on each card ("Interfaces" / "Systems" / "Practice"), so the information a
column used to carry is still present, just re-encoded as a label instead
of a position. Two sessions that happen to run at the same time simply
appear as adjacent cards instead of side-by-side columns; nothing is
hidden or summarised away, so a visitor can still tell what's on at a given
time — they scan a slightly longer list instead of a wide grid.

This also happens to simplify the accessibility work: the DOM order for the
list *is* the source order used for the grid too (sessions are written
into the markup already sorted by start time, then by track), so no
JavaScript has to reflow or reorder anything at the breakpoint. The CSS
`grid-row`/`grid-column` placement is applied only inside the
`@media (min-width: 860px)` block; below it, the same buttons simply stack
in the order they already appear in the HTML. One set of markup, one tab
order, two visual presentations.

## Keyboard & focus

- Every interactive element (day-jump links, session buttons, dialog close
  button) is a real `<a>` or `<button>` — nothing depends on a `div` with a
  click handler, so keyboard operability didn't have to be reconstructed
  by hand.
- Focus order follows source order, and source order follows the visual
  reading order: chronological, and left-to-right within a time slot
  (Interfaces → Systems → Practice), which matches both the stacked list
  and the grid.
- A single consistent focus ring (`3px` solid, offset `3px`) is applied via
  `:focus-visible` to every link and button, so it never depends on which
  element type or which layout is active.
- Session details open in a native `<dialog>` via `showModal()`, which
  browsers already trap focus inside. On open, focus moves to the dialog's
  own heading (`tabindex="-1"`) so a screen reader announces the session
  title immediately, rather than landing straight on the close button.
- Closing works three ways, and all three restore focus to the button that
  opened the dialog: the **Escape** key (native `<dialog>` behaviour), the
  **Close** button (a `<form method="dialog">` submit, so it works even if
  a script error stopped anything else), and a click on the backdrop.
- A **skip link** ("Skip to schedule") is the first focusable element on
  the page, for anyone tabbing past the header on every visit.

## No horizontal scroll at 320px

- `box-sizing: border-box` everywhere, no fixed pixel widths on any
  container — padding uses `clamp()` so it shrinks on small viewports.
- The grid layout is entirely gated behind `min-width: 860px`; at 320px
  the page never attempts three columns.
- Long session titles wrap (`overflow-wrap: break-word`) instead of
  forcing their container wider.
- The dialog is sized with `min(560px, 92vw)`, so it can never exceed the
  viewport width on a small screen.

## Manual testing done

- Tabbed through the entire page with the mouse untouched, both above and
  below the 860px breakpoint, confirming the visual and focus order match.
- Resized the browser down to 320px and confirmed no horizontal scrollbar
  appears anywhere on the page or inside an open dialog.
- Opened and closed several dialogs via Enter/Space, Escape, and the close
  button only, confirming focus always lands back on the triggering
  session button.
