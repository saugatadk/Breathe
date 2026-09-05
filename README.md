# Breathe

A single page of short, evidence-based things to do during a study break. Fourteen techniques,
grouped by what your body is actually asking for, each with a timer built to its own shape and an
honest note about how strong the evidence really is.

## Opening it

Double-click `index.html`. That's the whole install. No Node, no build step, no server — it runs
straight from disk, and it keeps working offline (the web fonts fall back to system faces).

## What's inside

- `index.html` — page structure, the source list, the medical caveat
- `styles.css` — the design tokens and both themes (dim by default, bright on request)
- `app.js` — the fourteen techniques, their evidence notes, and the timing engines

The evidence notes live in the `EV` map in `app.js`; the techniques themselves are the `T` array
just above it. Editing a duration means editing one number in `T` — the pacer, the clock and the
progress line all derive from it.

## The four pacers

Each family of exercise gets a different instrument, because a square perimeter is the wrong shape
for an uneven breath: a **square** traced at four equal counts (box breathing), a **filling column**
for uneven patterns like the physiological sigh and 4-7-8, a **scrolling wave** for continuous
coherent breathing, and a **depleting ring** for the exercises where you are simply waiting out a
duration.

## Evidence tiers

The three bars beside each technique measure the literature, not how nice the technique feels:
three bars means it has been tested in randomised trials, two means the mechanism is solid but
outcome evidence is thinner, one means it is used in practice but has not been trial-tested. Where
the popular version of a technique contradicts the research — coherent breathing failing against a
sham condition, micro-breaks not improving performance, the NSDR dopamine claim resting on eight
people — the page says so on the technique itself.

Every claim traces to a named source listed at the foot of the page.

## Privacy

Nothing is collected, stored or sent anywhere. The writing exercise keeps your text in the page and
nowhere else; closing the tab discards it. The only thing saved locally is your theme and sound
preference.

## Not medical care

This is a study aid. Paced breathing can make you lightheaded — stop if it does. If stress or
anxiety is affecting your daily life, that's worth taking to a doctor or your university's
counselling service.
