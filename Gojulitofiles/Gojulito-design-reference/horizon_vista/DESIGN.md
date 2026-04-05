# Design System Specification

## 1. Overview & Creative North Star

### Creative North Star: "The Modern Diplomat"
The design system for this operational management suite is built upon the concept of **"The Modern Diplomat."** In the high-stakes world of visa processing and international travel seminars, the UI must act as an authoritative yet serene guide. We move beyond the "SaaS template" by rejecting harsh lines and cluttered grids in favor of an editorial, high-end experience that feels more like a private concierge service than a database.

**Signature Intent:**
We break the traditional "admin dashboard" mold through:
*   **Intentional Asymmetry:** Strategic use of whitespace to guide the eye toward critical action paths.
*   **Tonal Depth:** Utilizing deep, layered blues to create a sense of infinite space and focused calm.
*   **Typographic Authority:** Using high-contrast scales where large, elegant displays meet hyper-legible, functional labels.

---

## 2. Colors

The color palette is anchored in a sophisticated "Midnight & Amber" contrast, designed to provide maximum visual comfort during long operational sessions.

### Core Palette
*   **Primary (`#c0c6d9`):** A muted steel blue used for secondary actions and structural elements.
*   **Tertiary/Accent (`#ffba3a`):** The "Success" and "Key Action" color. This amber/gold tone represents the "Golden Seal" of approval in travel documents.
*   **Surface/Background (`#051426`):** A deep, ink-like navy that serves as the foundation for the entire ecosystem.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are strictly prohibited for sectioning.** 
*   **Defining Boundaries:** Use background shifts. A `surface-container-low` component should sit on a `surface` background to define its edges. 
*   **The Signature Gradient:** Use a subtle linear gradient (from `primary` to `primary_container` at 15% opacity) for hero sections and primary CTAs to add a sense of "physicality" and soul.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent layers:
1.  **Base Layer:** `surface` (`#051426`) - The canvas.
2.  **Level 1 (Sections):** `surface_container_low` (`#0d1c2f`).
3.  **Level 2 (Cards/Interaction):** `surface_container` (`#122033`).
4.  **Level 3 (Floating/Active):** `surface_container_highest` (`#273649`) with a 20px backdrop-blur.

---

## 3. Typography

The system utilizes a dual-font strategy to balance bureaucratic precision with executive elegance.

| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | **Manrope** | 3.5rem | Bold, authoritative, minimal tracking. |
| **Headline** | `headline-md` | **Manrope** | 1.75rem | Medium weight, used for section starts. |
| **Title** | `title-md` | **Inter** | 1.125rem | Semi-bold, high legibility for data points. |
| **Body** | `body-md` | **Inter** | 0.875rem | Regular, optimized for form labels/data. |
| **Label** | `label-sm` | **Inter** | 0.6875rem | Uppercase, +5% tracking for metadata. |

**Editorial Choice:** Manrope provides a geometric, modern warmth for high-level information, while Inter ensures that complex visa data remains surgical and error-free.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is achieved through **Tonal Layering**. Instead of using shadows to "lift" objects, we use color value. An inner form field should be `surface_container_lowest` nested inside a `surface_container` card. This creates a "recessed" look that feels integrated into the interface.

### Ambient Shadows
When a component must float (e.g., a Modal or a Tooltip), use an "Ambient Deep Sea" shadow:
*   **Color:** `rgba(1, 15, 33, 0.6)`
*   **Blur:** 40px - 60px
*   **Spread:** -5px
This mimics a soft light source rather than a harsh drop shadow.

### Glassmorphism & Ghost Borders
*   **The Glass Rule:** For global navigation or floating action bars, use `surface_container_highest` at 80% opacity with a `12px` backdrop-blur. 
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary (Amber):** Background `tertiary`, text `on_tertiary_fixed`. Rounded `0.375rem`. No border.
*   **Secondary (Steel):** Background `secondary_container`, text `on_secondary_container`.
*   **State:** On `:hover`, apply a subtle inner glow rather than a dark overlay.

### Input Fields & Forms
*   **Structure:** Forbid lines. Use `surface_container_lowest` for the input well.
*   **Typography:** Labels use `label-md` in `on_surface_variant`. 
*   **Focus State:** A 2px "Ghost Border" using the `tertiary` (Amber) color at 40% opacity.

### Cards (The "Visa Dossier" Card)
*   **Layout:** No dividers. Use `24px` vertical padding to separate header from content.
*   **Progress States:** Use a custom "Amber Glow" for progress bars. The background of the bar should be `surface_variant`, and the progress indicator should have a subtle outer glow of 4px in the `tertiary` color.

### Data Tables
*   **The "Soft Row" Rule:** Instead of divider lines, use a `surface_container_high` background on `:hover`.
*   **Density:** Maintain high breathing room (16px padding minimum) to reflect the premium nature of the service.

---

## 6. Do's and Don'ts

### Do
*   **Do** use Manrope for large numbers (e.g., "45 Days Remaining") to give them a "Designed" feel.
*   **Do** use "surface-on-surface" nesting to create hierarchy.
*   **Do** use large, soft-corner radii (`0.75rem`) for main dashboard containers to soften the "operational" feel.

### Don't
*   **Don't** use 100% black (#000) or pure white (#FFF). Always use the themed surface and "on-surface" tokens.
*   **Don't** use standard "Success Green" or "Error Red" at 100% saturation. Tint them with the `primary` navy to keep them within the "Modern Diplomat" color space.
*   **Don't** use dividers to separate list items. Use whitespace (`12px` to `16px` gaps).
*   **Don't** use "Drop Shadows" on cards. Rely on color value shifts.

---
*Document end.*