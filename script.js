/**
 * Fieldnotes schedule — session detail dialogs.
 *
 * Each `.session` button already carries everything a person needs to
 * scan the schedule (time, track, title, speaker, room) as plain text
 * in the DOM. This script only adds the *extra* detail — the abstract —
 * and wires up a native <dialog> per session so that detail is reachable
 * by keyboard, closable by keyboard, and never causes the page itself
 * to scroll or reflow.
 *
 * Dialogs are built once, on load, and inserted right after each
 * trigger button — before any interaction happens — so there is no
 * race condition around "does the dialog exist yet".
 */

const ABSTRACTS = {
  'd1-keynote': "A look at how reach, grip, and attention vary across real users, and why \u201Cmobile-first\u201D should really mean \u201Cthumb-first.\u201D",
  'd1-s1-int': "Tab order isn't a QA checkbox; it's part of the layout brief. A walkthrough of designing source order alongside visual order from the first wireframe.",
  'd1-s1-sys': "Stale reads, thundering herds, and the small set of rules that keep an edge cache predictable in production.",
  'd1-s1-prac': "The five-line structure that gets a bug triaged in minutes instead of ignored for a sprint.",
  'd1-s2-int': "Passing a contrast checker isn't the same as being legible in sunlight, at dusk, or on a cracked screen. Field notes from testing outdoors.",
  'd1-s2-sys': "A practical, jargon-light tour of when an index helps, when it hurts, and how to tell the difference with EXPLAIN.",
  'd1-s2-prac': "Handoff notes, async pairing, and the one daily overlap hour that made a nine-hour-offset team work.",
  'd1-s3-int': "Why the components people avoid are usually the ones designed without their workflow in mind, and how to fix that.",
  'd1-s3-sys': "Backoff strategies, dead-letter queues, and deciding when a retry is helping versus quietly making things worse.",
  'd1-s3-prac': "A first-week plan that trades a long document for a short list of real, low-stakes tasks.",
  'd1-s4-int': "Unplugging the mouse for a day changed how this team reviews every pull request. A demo of the habit.",
  'd1-s4-sys': "A lifecycle for flags, from rollout to deletion, so last year's experiment doesn't outlive its usefulness.",
  'd1-s4-prac': "The facilitation moves that keep a retro focused on the system, not the person who happened to touch it last.",
  'd1-s5-int': "Designing a page-load sequence and a reduced-motion fallback that both feel intentional, not like an afterthought.",
  'd1-s5-sys': "The three dashboards worth checking before a normal deploy, and the two alerts worth waking someone up for.",
  'd1-s5-prac': "Scoping conversations that turn \u201Cwe need it by Friday\u201D into an honest, shared decision.",
  'd1-s6-int': "Inline validation, undo, and error messages that explain the fix instead of just naming the failure.",
  'd1-s6-sys': "Dual-writes, backfills, and the cutover checklist from a migration nobody noticed happened.",
  'd1-s6-prac': "What makes a README worth bookmarking, and the three questions every doc should answer up front.",
  'd1-closing': "Five speakers from the day answer the question they wish someone had asked them earlier in their careers.",

  'd2-keynote': "A retrospective on the components that survived a decade of redesigns, and the ones that didn't.",
  'd2-s1-int': "Treating theme as design tokens instead of a CSS class, so dark mode stops being a second design pass.",
  'd2-s1-sys': "Per-user, per-IP, and per-key limits, and why the right one depends on who you're actually trying to slow down.",
  'd2-s1-prac': "A rough sizing method for the unfamiliar task that still holds up when someone asks for a date.",
  'd2-s2-int': "FLIP, compositor-only properties, and a short list of what to animate and what to leave alone.",
  'd2-s2-sys': "Chunked backfills, throttling, and watching the right metric so a backfill doesn't become an incident.",
  'd2-s2-prac': "A structured interview that tests for the job, not for who's seen the puzzle before.",
  'd2-s3-int': "Grid navigation, announced month changes, and the keyboard shortcuts a date picker needs to earn its complexity.",
  'd2-s3-sys': "Why a retried payment shouldn't charge twice, told through an order that gets shouted at the counter twice.",
  'd2-s3-prac': "Comment patterns that pass on context instead of just approving or blocking.",
  'd2-s4-int': "What surprised this sighted developer in their first hour with VoiceOver, and what they fixed because of it.",
  'd2-s4-sys': "A decision framework based on throughput, ordering, and how much operational overhead the team can take on.",
  'd2-s4-prac': "Threads, statuses, and the small norms that keep an always-on channel from becoming always-urgent.",
  'd2-closing': "Where the speakers think platform, tooling, and accessibility are headed, and what they're each betting on."
};

function buildDialog(button) {
  const id = button.dataset.session;
  const dialog = document.createElement('dialog');
  dialog.className = 'session-dialog';
  dialog.id = 'dlg-' + id;

  const titleId = 'dlg-title-' + id;
  const abstract = ABSTRACTS[id] || '';

  dialog.innerHTML =
    '<form method="dialog" class="dialog-form">' +
      '<div class="dialog-header">' +
        '<p class="dialog-track">' + button.dataset.track + '</p>' +
        '<button type="submit" class="dialog-close" aria-label="Close session details">' +
          '<span aria-hidden="true">\u00D7</span>' +
        '</button>' +
      '</div>' +
      '<h2 id="' + titleId + '" tabindex="-1">' + button.dataset.title + '</h2>' +
      '<p class="dialog-meta">' + button.dataset.time + ' &middot; ' + button.dataset.room + '</p>' +
      '<p class="dialog-speaker">' + button.dataset.speaker + '</p>' +
      '<p class="dialog-abstract">' + abstract + '</p>' +
    '</form>';

  dialog.setAttribute('aria-labelledby', titleId);
  button.insertAdjacentElement('afterend', dialog);
  return dialog;
}

document.querySelectorAll('.session').forEach((button) => {
  const dialog = buildDialog(button);
  const heading = dialog.querySelector('h2');

  button.addEventListener('click', () => {
    dialog.showModal();
    // Move focus to the dialog's own heading first, so a screen reader
    // announces what was opened before landing on the close button.
    heading.focus();
  });

  // Fires for every close path: the close button (form[method=dialog]),
  // the Escape key (native default on <dialog>), and our own .close()
  // call below for backdrop clicks. One listener covers all three.
  dialog.addEventListener('close', () => {
    button.focus();
  });

  // Clicking outside the dialog's content (on the ::backdrop area) closes it.
  // The click target is the <dialog> element itself only when the click
  // landed outside the rendered content box.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});
