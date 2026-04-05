# Design System Document: The Architectural Authority

## 1. Overview & Creative North Star
**Creative North Star: "The Diplomatic Atelier"**

This design system rejects the "tax software" aesthetic in favor of a high-end, editorial experience. Visa processing and travel seminars are high-stakes environments; the UI must feel like a bespoke concierge service—authoritative, calm, and impeccably organized. 

We break the standard "template" look through **Intentional Asymmetry** and **Tonal Depth**. By moving away from rigid, bordered grids and toward layered, fluid surfaces, we create a digital environment that feels premium and intentional. The experience is not just functional; it is a curated journey through complex information.

---

## 2. Colors: The Tonal Foundation
Our palette utilizes deep professional blues and sophisticated golds to establish a "New Corporate" feel—where efficiency meets luxury.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section sitting on a `surface` background provides all the definition a user needs without the visual clutter of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine stationery.
*   **Base:** `surface` (#f8f9fa) is your canvas.
*   **The Nesting Principle:** Use the tiered containers to create depth. A `surface-container-lowest` card (Pure White) should sit atop a `surface-container-low` (#f3f4f5) sidebar. This "stacking" tells the eye what is most important without a single drop shadow.

### The "Glass & Gradient" Rule
To elevate the "GoJulito" experience beyond a standard SaaS tool:
*   **Glassmorphism:** Use for floating elements (modals, dropdowns). Apply `surface` at 80% opacity with a `24px` backdrop-blur.
*   **Signature Textures:** For primary CTAs or high-level Seminar headers, use a subtle linear gradient: `primary` (#002c98) to `primary-container` (#1a43bf) at a 135-degree angle. This adds "soul" and prevents the interface from feeling flat.

---

## 3. Typography: Editorial Precision
The system pairs the humanist geometry of **Manrope** for impact with the clinical efficiency of **Inter** for data.

*   **Display & Headline (Manrope):** These are your "Anchors." Large scales (`display-lg` at 3.5rem) should be used with tight letter-spacing (-0.02em) to convey a sense of high-end editorial authority.
*   **Title & Body (Inter):** The "Workhorse." Use `body-md` (0.875rem) for all visa form inputs and administrative tables. It is optimized for long-term readability and rapid data scanning.
*   **The Label Scale:** Use `label-sm` (0.6875rem) in All Caps with +0.05em tracking for secondary metadata or status indicators to provide a sophisticated, "stamped" look.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use light and layering to create "presence."

*   **Ambient Shadows:** If a floating effect is required (e.g., a floating action button), shadows must be extra-diffused. Use a blur of 32px and an opacity of 6% using a tinted version of `on-surface` (#191c1d). It should feel like a soft glow, not a dark smudge.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a border (e.g., high-contrast mode), use the `outline-variant` (#c4c5d6) at **15% opacity**. 100% opaque borders are strictly forbidden.
*   **Depth through Blur:** Use backdrop-blur on navigation sidebars to allow the content of the visa management dashboard to peek through subtly, making the layout feel integrated and expansive.

---

## 5. Components: Refined Utility

### Buttons (The Interaction Signature)
*   **Primary:** `primary` (#002c98) background with `on-primary` (#ffffff) text. Use `xl` (0.75rem) roundedness. No borders. On hover, transition to `primary-container`.
*   **Secondary:** `secondary` (#006a6a) background. Use for Seminar bookings and travel seminars to differentiate from visa processing tasks.

### Cards & Data Organization
*   **Constraint:** Forbid the use of divider lines. 
*   **Alternative:** Separate content using `surface-container-high` strips or generous vertical white space from the spacing scale (e.g., 32px or 48px). 
*   **Visa Status Badges:** Use `tertiary-container` (#694b00) for "Pending" and `secondary-container` (#90efef) for "Approved." Use `full` (9999px) roundedness for a pill shape.

### Input Fields (The Form Experience)
*   **Style:** Minimalist. No bottom line, no full border. Use a subtle `surface-container-highest` background with a `sm` (0.125rem) radius.
*   **Focus State:** The background shifts to `primary-fixed` (#dde1ff) with a 2px "Ghost Border" of `primary`.

### Specialized Components for Visa Management
*   **Document Progress Tracker:** Use a vertical "asymmetric" timeline. Instead of a centered line, use varied weights of `surface-variant` to indicate completed vs. upcoming visa stages.
*   **The Seminar "Ticket" Card:** Use a subtle "cut-out" notch effect (masking) on the left/right edges to evoke a physical seminar pass, utilizing `tertiary` (#4c3500) for the accent.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Whitespace:** Treat negative space as a luxury. A professional visa app should feel calm, not cramped.
*   **Use Subtle Animation:** Animate surface transitions with a custom `cubic-bezier(0.2, 0.0, 0, 1.0)` for a "weighted" and premium feel.
*   **Layer Intentionally:** Always place lighter surfaces on darker ones to pull the user's attention forward.

### Don't:
*   **Never use 100% Black:** Use `on-surface` (#191c1d) for text. Pure black is too harsh for an editorial experience.
*   **Avoid "Generic" Icons:** Use thin-stroke (1.5px) icons that match the `outline` token weight to maintain typographic harmony.
*   **No Grid-Lock:** Allow certain elements (like hero images or seminar titles) to break the container grid to create a custom, high-end layout feel.

---
**Director's Note:** Every pixel in this system must serve the goal of reducing the user's anxiety. We are not just building a form; we are building a gateway to their next destination. Keep it clean, keep it deep, and keep it intentional.