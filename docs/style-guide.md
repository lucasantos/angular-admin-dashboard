# Component style guide

## Introduction

If you hardcode hex values like `#fff` or `#333`, the app will "break" visually when the theme changes. To ensure **Global Adoption**, you must use the **Material 3 (M3) Token System**.

Here is your **Component Style Guide** for using M3 CSS variables. Following this guide ensures that when you change a theme (or even pick a Custom Color), your Sidebar, Cards, and Tables update instantly.

---

### 1. Essential Background Tokens

Instead of `background: white`, use these tokens to ensure the background shifts from light to dark (or to your custom brand color) correctly.

| **Element**              | **M3 Token**                               | **Description**                                            |
| ------------------------ | ------------------------------------------ | ---------------------------------------------------------- |
| **Main Page Background** | `var(--mat-sys-surface)`                   | The lowest level background (usually white/near-black).    |
| **Sidebar / Drawer**     | `var(--mat-sys-surface-container)`         | A slightly "elevated" surface to create depth.             |
| **Cards / Modals**       | `var(--mat-sys-surface-container-high)`    | Used for elements that should pop out from the background. |
| **Active/Hover State**   | `var(--mat-sys-surface-container-highest)` | The most prominent surface level.                          |

#### Example (Sidebar Styling)

```scss
.app-sidebar {
  background-color: var(--mat-sys-surface-container);
  border-right: 1px solid var(--mat-sys-outline-variant);
}
```

---

### 2. Typography & Text Tokens

Never use `color: black`. Using these tokens ensures text remains readable (e.g., turning white on a dark background).

| **Intent**         | **M3 Token**                        | **Usage**                                          |
| ------------------ | ----------------------------------- | -------------------------------------------------- |
| **Primary Text**   | `var(--mat-sys-on-surface)`         | Main headers and body text.                        |
| **Secondary Text** | `var(--mat-sys-on-surface-variant)` | Descriptions, timestamps, and placeholder text.    |
| **Text on Brand**  | `var(--mat-sys-on-primary)`         | Text that sits on top of a primary-colored button. |

---

### 3. Brand & Action Tokens

These are the tokens that will change when the user selects a **Custom Color** in your "Custom Brand Identity" menu.

| **Element**           | **M3 Token**                       | **Usage**                                                 |
| --------------------- | ---------------------------------- | --------------------------------------------------------- |
| **Primary Actions**   | `var(--mat-sys-primary)`           | Main buttons, active tab indicators, and primary icons.   |
| **Selection / Focus** | `var(--mat-sys-primary-container)` | Background for selected list items (usually a soft tint). |
| **Borders**           | `var(--mat-sys-outline)`           | Standard input borders and dividers.                      |

---

### 4. Implementation Example: A Custom Dashboard Card

Here is how you would write the SCSS for a custom component to make it "Theme-Aware."

`custom-card.scss`

```scss
.dashboard-card {
  // Use tokens for the surface and text
  background-color: var(--mat-sys-surface-container-high);
  color: var(--mat-sys-on-surface);
  
  border-radius: 16px; // M3 standard rounded corners
  padding: 24px;
  border: 1px solid var(--mat-sys-outline-variant);
  
  .card-title {
    color: var(--mat-sys-primary); // Adopts brand color
    font: var(--mat-sys-title-large); // Adopts M3 typography
  }
  
  .card-description {
    color: var(--mat-sys-on-surface-variant); // Dims for secondary info
  }
  
  &:hover {
    background-color: var(--mat-sys-surface-container-highest);
    border-color: var(--mat-sys-primary); // Highlights on hover
  }
}
```

---

### 5. Transitioning the Entire Body

To make the theme switch feel professional and "app-like" rather than a harsh flash, add this to your `styles.scss` (which we touched upon in the documentation):

```scss
body {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
  
  // This ensures every component inheriting these tokens 
  // animates smoothly during a theme change
  transition: 
    background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
    color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.4s ease;
}
```

---

## Summary Checklist for your Components

When creating a new component, ask yourself:

1. **Is the background a token?** (Use `surface-container`)
2. **Is the text a token?** (Use `on-surface`)
3. **Are the borders tokens?** (Use `outline-variant`)
4. **Is the primary color a token?** (Use `primary`)

By sticking to this list, your application will achieve the "Global Adoption" you're looking for, making the "Custom Identity" mode feel like a native part of the experience.
