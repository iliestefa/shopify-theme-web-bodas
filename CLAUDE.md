# Shopify Theme — Development Rules

## Stack

Shopify Liquid · Tailwind CSS v4 · Alpine.js v3 · Swiper v11 · Vite v5

## Images

- For Shopify image objects (from `image_picker`): always `{%- render 'image', image: object, class: '...', alt: var -%}` — never `image_url` + `image_tag` directly
- The `image` snippet accepts: `image`, `max_width`, `fixed_width`, `fixed_height`, `widths`, `class`, `alt`, `sizes`, `preload`, `priority`
- Pre-assign `alt` before calling the snippet: `{%- assign item_alt = block.settings.title | escape -%}` then pass `alt: item_alt`
- Static asset fallback (PNG in `assets/`): `<img src="{{ 'file.png' | asset_url }}" width="X" height="X" loading="lazy" alt="...">`
- Every `<img>` tag must have `width`, `height`, `loading`, and `alt` — missing any will fail `shopify theme check`
- Never `placeholder_svg_tag`
- Figma asset URLs expire in 7 days — always download images to `assets/` immediately

## Icons

- Always `{%- render 'icon', icon: 'name' -%}` — never inline SVG in sections
- Available icons: `account` `arrow` `caret` `chevron-down` `cart` `cart-empty` `close` `close-small` `discount` `error` `filter` `hamburger` `info` `minus` `pause` `play` `plus` `remove` `search` `share` `star` `success` `zoom` `facebook` `instagram` `twitter` `tiktok` `youtube` `pinterest`
- To add a new icon: add `{%- when 'name' -%}` in `snippets/icon.liquid` — never create separate snippet files per icon
- **ALWAYS export SVGs from Figma via REST API** — never write SVG paths from memory or use generic icons. Get node IDs from `get_design_context`, export in one call, download the S3 URLs, use the exact paths: `curl -H "X-Figma-Token: $FIGMA_TOKEN" "https://api.figma.com/v1/images/FILE_KEY?ids=ID1,ID2,ID3&format=svg"`

## Alpine.js

- Header, footer, cart, PDP, PLP → register in `external/src/main.js`
- Secondary sections → inline with `{ once: true }` and `section.id` in the component name:
  ```liquid
  <div x-data="myComp_{{ section.id }}"></div>
  <script>
    document.addEventListener('alpine:init', () => {
      Alpine.data('myComp_{{ section.id }}', () => ({ open: false }))
    }, { once: true })
  </script>
  ```
- Cart store: `$store.cart`

## Swiper

- Use `window.Swiper` with Alpine `$refs` for container and pagination

## Tailwind v4

- No `tailwind.config.js` — tokens defined in `@theme {}` inside `external/src/main.css`
- Classes must always be complete — never concatenate dynamic strings
- Dynamic Liquid-generated classes → add via `@source` or `@utility` in `main.css`
- Custom classes used with `@apply` from another file → declare them as `@utility`
- `-down` breakpoints → already defined with `@custom-variant` in `main.css`
- Containers: `.c-container` and `.c-container.wide`
- **No custom `<style>` blocks in sections** — use existing theme classes (`h1`–`h6`, `body-1`–`body-6`, `bg-*`, `text-*`) or Tailwind utilities. Only use `style=""` inline for one-off values (rgba, clamp, drop-shadow) that have no class equivalent
- **Never use arbitrary color values** (`bg-[#e7bc91]`, `text-[#583101]`, etc.) — always check `@theme {}` in `external/src/main.css` first and use the named token (`bg-secondary`, `text-primary`, etc.). If the color is not yet tokenized, add it to `@theme {}` before using it
- **Use theme classes for typography** — `h2`, `h3`, `body-3`, etc. are defined in `external/src/css/_fonts.css` and already loaded globally. Never re-declare font-size, font-weight or color that these classes already provide
- **No re-importing fonts in sections** — Poppins (and all theme fonts) are loaded globally via `snippets/global-style-fonts.liquid`. Never add `<link>` Google Fonts tags inside a section
- Responsive: use Tailwind breakpoint prefixes (`md:`, `lg:`) for structural changes; use `clamp()` in `style=""` for fluid scaling between breakpoints
- **Never use arbitrary `px` values** — every `px` value has a Tailwind v4 canonical equivalent using the formula `px ÷ 4` (e.g. `gap-[35px]` → `gap-8.75`, `h-[300px]` → `h-75`, `py-[60px]` → `py-15`, `rounded-[20px]` → `rounded-5`). The IDE linter flags these as `suggestCanonicalClasses` — fix them immediately after each file write, not at the end
- `suggestCanonicalClasses` warnings come from the IDE linter (VS Code extension), NOT from `shopify theme check` — running only `shopify theme check` will not catch them
- **Never mix** a CSS property in both a Tailwind class and a `style=""` on the same element — specificity conflicts will break the layout

## Liquid

- Variables in `snake_case` — never prefix with `_`
- Schema `url` fields without `"default": ""`
- `<script defer>` — never use the `script_tag` filter
- Every direct `<img>` requires `width`, `height`, `loading`, `alt`
- **No ternary operators** — `condition ? 'a' : 'b'` does not exist in Liquid; use `{%- if -%} ... {%- else -%} ... {%- endif -%}`
- **`image_tag` `style:` parameter is a static string** — cannot contain Liquid expressions; if the value is conditional, use two separate `{%- if -%}` blocks each with a full `image_tag`
- **`| escape` in multiline `image_tag`**: do NOT chain `| escape` inline inside a multiline `image_tag` block — it causes `LiquidHTMLSyntaxError`. Pre-assign the value: `{%- assign item_alt = block.settings.title | escape -%}` then use `alt: item_alt`
- **Schema forbidden fields**: `"tag"` is not a valid Shopify schema field — never add it. Valid top-level keys: `name`, `class`, `settings`, `blocks`, `presets`, `max_blocks`, `templates`, `enabled_on`, `disabled_on`
- **Schema field types for text — NO EXCEPTIONS**:
  - Single-line visible text (titles, labels, button text) → `"type": "inline_richtext"` — NEVER `"type": "text"`
  - Multi-line visible text (descriptions, paragraphs) → `"type": "richtext"` — NEVER `"type": "textarea"`
  - Technical/internal values used as HTML attributes (e.g. `placeholder=""`, asset filenames) → `"type": "text"` is acceptable since they cannot contain HTML
  - The `default:` of a `richtext` field MUST wrap the text in `<p>...</p>` — both in the schema `default:` AND in every preset and `templates/*.json` entry that sets that field. Missing `<p>` tags will throw `InvalidPreset` errors at runtime
  - In Liquid, render `richtext` fields with `<div class="richtext">{{ section.settings.field }}</div>` — never with `<p>`
- **Schema internal fields**: never expose internal-only values (e.g. asset filenames used as fallbacks) as schema fields — hardcode them in Liquid. Exposing them confuses merchants
- **`widths` in `image_tag`**: no spaces between values — `widths: '140,280'` not `widths: '140, 280'`
- **Fonts**: theme fonts load globally via `snippets/global-style-fonts.liquid` — never add `<link>` font tags in sections

## CSS source files

- Source: `external/src/main.css` and `external/src/css/` — compiled by Vite to `assets/main.css`
- **Never edit `assets/main.css` directly** — it is auto-generated and will be overwritten
- Colors → `@theme {}` in `external/src/main.css`
- Typography → `external/src/css/_fonts.css`
- Available theme classes to reuse in sections:
  - Typography: `h1` `h2` `h3` `h4` `h5` `h6` `body-1` `body-2` `body-3` `body-4` `body-5` `body-6`
  - Colors (bg): `bg-primary` `bg-primary-light` `bg-secondary` `bg-secondary-light` `bg-figma-bg`
  - Colors (text): `text-primary` `text-figma-text`

## Git

- Every new feature → create a `dev-iliana-feature-[name]` branch before starting
- Never work directly on `main`
- After finishing: commit on feature branch, then merge to `main` with `--no-ff`

## shopify theme check

- Run `shopify theme check --path .` before every commit
- Must return **0 errors** before committing (pre-existing errors in other files are acceptable if they were there before your change)
- Also fix all `suggestCanonicalClasses` warnings from the IDE linter before committing
- **Run theme check immediately after writing the section** — do not wait until the end. Fix errors before moving to the next step
