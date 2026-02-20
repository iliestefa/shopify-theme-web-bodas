# Shopify Starter Template

Shopify Starter + Alpine.js + Tailwind CSS v4 + Swiper + Vite

## Configuración básica

Los archivos de desarrollo se encuentran en la carpeta `/external`

1. En `package.json` reemplace `YOUR-STORE.myshopify.com` con el slug de su Store
2. `cd external && npm install`

## Comandos

```bash
cd external
npm install
```

Ejecute el servidor de desarrollo de Shopify:

```bash
npm run shopify
```

Compile el javascript y css del proyecto (Output: `assets/main.js` - `assets/main.css`):

```bash
npm run dev
```

Obtener cambios del Customizer:

```bash
npm run shopify:pull
```

## Proyecto

Archivos base en:

1. `/external/src/main.js`
2. `/external/src/main.css`

# ESTILOS

## Contenedor

Utilice la clase `.c-container` para delimitar contenedores en sus secciones. Modifíquelo en `/external/src/css/_globals.css`.

```html
<section>
  <div class="c-container">
```

Puede utilizar el modificador `.wide` para un contenedor más ancho:

```html
<div class="c-container wide">
```

## Tailwind v4

Los tokens de diseño (breakpoints, colores, fuentes) se definen en el bloque `@theme` de `/external/src/main.css`. No hay `tailwind.config.js`.

```css
@theme {
  --color-primary: #000000;
  --font-body: var(--font-body-family);
}
```

## Botones

Utilice las clases de botones de `/external/src/css/_buttons.css`.

```html
<button class="button-primary">...</button>
<a class="button-secondary" href="#">...</a>
```

Modificadores: `.tiny`, `.small`, `.medium`, `.big`, `.no-borders`

## Imágenes

Utilice el snippet `image` — nunca `image_url` + `image_tag` directamente:

```liquid
{%- render 'image', image: section.settings.image, sizes: '(max-width: 768px) 100vw, 50vw', class: 'w-full h-full object-cover' -%}
{%- render 'image', image: product.featured_image, preload: true, max_width: 800 -%}
{%- render 'image', image: block.settings.image, fixed_width: 400, fixed_height: 400, crop: 'center' -%}
```

Parámetros: `image` · `preload` · `priority` · `max_width` · `fixed_width` · `fixed_height` · `crop` · `class` · `alt` · `sizes` · `widths` · `style`

## Iconos

Utilice el snippet `icon` — nunca SVG inline en secciones:

```liquid
{%- render 'icon', icon: 'cart' -%}
{%- render 'icon', icon: 'chevron-down', width: 12, class: 'text-gray-500' -%}
{%- render 'icon', icon: 'arrow', direction_aware: true -%}
```

Iconos disponibles: `account` `arrow` `caret` `chevron-down` `cart` `cart-empty` `close` `close-small` `discount` `error` `filter` `hamburger` `info` `minus` `pause` `play` `plus` `remove` `search` `share` `star` `success` `check` `zoom` `facebook` `instagram` `twitter` `tiktok` `youtube` `pinterest` `snapchat` `tumblr` `vimeo`

## Fuentes

Utilice las clases `.h1, ..., .h6` y `.body-1, ..., .body-6` de `/external/src/css/_fonts.css`.

```html
<p class="body-3">...</p>
<h2 class="h2">...</h2>
```

## Formularios

```html
{%- form 'contact' -%}
  <label class="form__label">...</label>
  <input type="text" class="form__input">
  <select class="form__input"></select>
  <textarea class="form__input"></textarea>
{%- endform -%}
```

## Modal

```liquid
{%- capture modal_content -%}
  {%- render 'your-modal-content' -%}
{%- endcapture -%}

{%- render 'modal',
  modal_content: modal_content,
  id: 'YOUR_MODAL_ID',
  width: 600,
  has_padding: true
-%}

<button data-modal="YOUR_MODAL_ID">...</button>
```

## Carrito

Utilice la clase `.hide-if-cart-empty` para ocultar elementos cuando el carrito esté vacío.

Agregar al carrito — usar clase `.js-add-to-cart`:

```html
{%- form 'product', product -%}
  <button class="button-primary js-add-to-cart">Add to cart</button>
{%- endform -%}
```

## Animaciones

```html
<button class="button-primary" :class="{ 'processing-spinner': isLoading }">
  Some button
</button>
```

## PERFORMANCE

Para diferir scripts de apps no esenciales, ver:
- `snippets/content-for-header.liquid`
- `snippets/lazy-scripts.liquid`
- `snippets/global-listeners.liquid`

## Herramientas útiles

- Performance: [PageSpeed](https://pagespeed.web.dev/) · [GTmetrix](https://gtmetrix.com/)
- Accessibility: [Wave](https://wave.webaim.org/) · [WCAG Checklist](https://webaim.org/standards/wcag/checklist)
