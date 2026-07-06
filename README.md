# Next.js + MUI Starter Base

This is the reusable framework layer extracted from a full site migration — the
project-agnostic scaffolding, with all business-specific content stripped out.
Everything here is meant to be a starting point for a *new* project.

## What's included

**Page pattern** (`app/page.tsx` + `src/shared/layout/main-layout.tsx`)
Every page follows: lazy-load `MainLayout` + a page component, export
`metadata` via `buildPageMetadata`, pass `menuCode`/`actionCode`/`blurNav`
props. Copy `app/page.tsx` as the template for new routes.

**Styling** (`src/utils/define-styles/`)
Thin typed wrapper around MUI's `sx` objects — supports both static styles and
style-factory functions that take arguments (e.g. `styles.button(isActive)`).
See the README inside that folder for usage patterns.

**Forms** (`src/utils/forms/`, `src/shared/utilities/form/`)
Zod schema + `react-hook-form` integration. `create-form.ts`/`schema.ts`
build typed schemas, `form.tsx` is the `<Form>` wrapper component,
`fields/` are pre-wired `FormTextField`/`FormTextArea`/`FormSelect` that
plug into any schema. `validation/schemas/contact.schema.ts` is a worked
example — copy the pattern for new forms.

**API layer** (`src/helper/base-helper.ts`, `src/config/api.ts`)
`BaseHelper` is a callback-style axios wrapper (`getBase`/`postBase`) that
every concrete helper extends with just a `static url` and a couple of
methods. `auth-helper.ts` is a worked example (token caching + login,
de-duplicates concurrent calls). `config/api.ts` is a one-line template —
fill in your real base URL and endpoints.

**SSR/theming plumbing** (`src/lib/emotion-registry.tsx`, `src/config/theme.tsx`)
Required boilerplate for MUI + Next App Router SSR (avoids style flash/
hydration mismatch). Theme is generic MUI defaults — reskin to your brand.

**Small utilities** (`src/lib/`)
`credential.ts` (SSR-safe token storage, guards `typeof window`),
`metadata.ts` (`buildPageMetadata` helper for consistent SEO tags),
`rich-text.ts` (CMS rich-text decode/strip via `he`), `scroll-to.ts`
(ref-based smooth scroll).

**Modal** (`src/shared/components/modal/index.tsx`)
`AppModal` — a Dialog on desktop, bottom-sheet Drawer on mobile, same API.

**SVG-as-component** (`next.config.ts`, `src/types/svg.d.ts`)
`@svgr/webpack` wired up so `import Icon from "./icon.svg"` gives you a
React component (default export = component). If you need the raw file URL
instead (e.g. for `<img src=... >` or CSS `background-image`), put the file
in `/public` and reference it by path string — don't import it.

## What you need to fill in

- **`src/config/api.ts`** — currently a one-endpoint template. Add your real
  base URL and endpoints.
- **`src/consts/menu-code.const.ts`** — trimmed to 3 generic values. Replace
  with your site's actual top-level pages.
- **`src/shared/components/navbar/index.tsx`** and **`footer/index.tsx`** —
  both are bare stubs (`<nav />` / `<footer />`). Build your real nav/footer;
  `MainLayout` already wires them up with `activeMenu`/`blurNav` props.
- **`src/components/home/index.tsx`** — placeholder "Welcome to Next.js"
  content, replace with your real homepage.
- **`src/config/theme.tsx`** — generic MUI palette, reskin to your brand
  colors/typography.

## Not included (was project-specific)

Models, concrete API helpers beyond `auth-helper.ts`, navbar/footer content,
and all page components beyond the `home` stub were specific to the site this
was extracted from and aren't reusable as-is — the *patterns* they followed
are preserved above instead.
