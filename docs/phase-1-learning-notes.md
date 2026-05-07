# Wedly Phase 1 Learning Notes

## How image was translated to layout
- Built the page in strict order from the reference: `hero -> stats strip -> create/form split -> 3-step flow -> preview -> CTA band -> footer`.
- Replicated hero composition with a full-bleed background, dark brown gradient overlay, left-anchored content block, and subtle floral line-art on the right.
- Used an overlapping negative margin for the stats panel so it visually floats over the hero bottom edge, matching the reference layering.
- Preserved left-heavy text density and right-heavy visual weight in split sections to keep the same premium rhythm.

## Spacing system used
- Standardized content width with `.section-shell` (`max-width: 1200px` with responsive side gutters).
- Section spacing is intentionally generous (`py-20` to `py-24`) to keep the luxury feel and avoid template-like compression.
- Key overlap and hierarchy control:
  - Hero has extra bottom padding so content clears the stats overlay.
  - Stats uses `-mt-20` to float into hero.
  - Form section starts with large top padding to maintain separation from the strip.

## Tailwind structure choices
- Centralized palette in `app/globals.css` with explicit CSS variables:
  - `background`, `cream`, `sand`, `rose`, `terracotta`, `deep`, `muted`.
- Used semantic utility composition instead of ad-hoc per-element colors, keeping tone consistency across sections.
- Avoided default component styling:
  - Inputs/textarea use custom backgrounds, borders, radius, and focus states.
  - Buttons use handcrafted radius, fill, shadow, and contrast.

## Why components are split this way
- `components/site/navbar.tsx`, `components/site/footer.tsx`
  - Reusable site-level framing components.
- `components/wedly/hero-section.tsx`
  - Owns cinematic hero stack and floating nav integration.
- `components/wedly/stats-strip.tsx`
  - Isolated overlap panel; easy to tune numbers/icons without touching hero.
- `components/wedly/create-event-form.tsx`
  - Contains both intro copy and primary UX form card for focused iteration.
- `components/wedly/how-it-works.tsx`
  - Encapsulates 3-step process and connector-line visual.
- `components/wedly/preview-section.tsx`
  - Holds copy + device mockup composition and pre-footer CTA band.
