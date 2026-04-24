# Design Guide for Eshopbd

This document outlines the design patterns and guidelines for the Eshopbd e-commerce platform. All user-facing pages should follow these patterns to ensure a consistent, modern, and appealing user experience.

## Color Scheme

- **Primary Color**: #3B82F6 (Blue-500) - Used for buttons, links, and accents.
- **Secondary Color**: #6B7280 (Gray-500) - Used for secondary elements and text.
- **Background**: #FFFFFF (White) - Main background color.
- **Surface**: #F9FAFB (Gray-50) - Card backgrounds and secondary surfaces.
- **Text Primary**: #111827 (Gray-900) - Main text color.
- **Text Secondary**: #6B7280 (Gray-500) - Secondary text.
- **Error**: #EF4444 (Red-500) - Error states.
- **Success**: #10B981 (Emerald-500) - Success states.

## Typography

- **Font Family**: Inter (or system default sans-serif).
- **Headings**: 
  - H1: 2.25rem (36px), bold, primary text color.
  - H2: 1.875rem (30px), bold, primary text color.
  - H3: 1.5rem (24px), semibold, primary text color.
- **Body Text**: 1rem (16px), normal, text primary.
- **Small Text**: 0.875rem (14px), normal, text secondary.

## Buttons

- **Primary Button**:
  - Background: Primary color.
  - Text: White.
  - Padding: 0.5rem 1rem (8px 16px).
  - Border Radius: 0.375rem (6px).
  - Font: Semibold, 0.875rem (14px).
  - Hover: Darken background by 10%, add subtle shadow.
  - Active: Darken further, scale down slightly.
  - Disabled: Opacity 50%, cursor not-allowed.

- **Secondary Button**:
  - Background: White.
  - Border: 1px solid secondary color.
  - Text: Secondary color.
  - Same padding, radius, font as primary.
  - Hover: Background to surface color, border to primary.
  - Active: Same as primary.

- **Outline Button**:
  - Background: Transparent.
  - Border: 1px solid primary.
  - Text: Primary.
  - Same padding, radius, font.
  - Hover: Background to primary, text to white.

## Inputs

- **Text Input**:
  - Background: White.
  - Border: 1px solid #D1D5DB (Gray-300).
  - Padding: 0.5rem 0.75rem (8px 12px).
  - Border Radius: 0.375rem (6px).
  - Font: 1rem, text primary.
  - Focus: Border to primary, add ring (primary with 20% opacity).
  - Placeholder: Text secondary.
  - Error: Border to error color.

- **Select/Dropdown**:
  - Same as text input.
  - Add chevron icon on the right.

- **Textarea**:
  - Same as text input, but min-height 4rem (64px).

## Cards

- **Product Card**:
  - Background: Surface.
  - Border: 1px solid #E5E7EB (Gray-200).
  - Border Radius: 0.5rem (8px).
  - Padding: 1rem (16px).
  - Shadow: Subtle on hover (0 4px 6px -1px rgba(0, 0, 0, 0.1)).
  - Image: Rounded top corners, aspect ratio 1:1.
  - Title: H3 style, primary text.
  - Price: Primary color, bold.
  - Button: Primary style.

- **General Card**:
  - Same as product card, adjust content accordingly.

## Layout

- **Container**: Max width 1200px, centered, padding 1rem on sides.
- **Grid**: Use CSS Grid or Flexbox for responsive layouts.
- **Spacing**: Use Tailwind spacing (rem units): 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, etc.
- **Responsive**: Mobile-first, breakpoints at sm (640px), md (768px), lg (1024px).

## Interactions

- **Hover Effects**: Subtle transitions (0.2s ease-in-out) for color changes, shadows, scales.
- **Focus States**: Visible focus rings for accessibility.
- **Loading States**: Skeleton loaders or spinners for async actions.
- **Animations**: Minimal, purposeful animations (e.g., fade-in for new content).

## Accessibility

- Ensure 4.5:1 contrast ratio for text.
- Keyboard navigation support.
- Screen reader friendly (proper ARIA labels).
- Focus management.

## Implementation Notes

- Use Tailwind CSS classes for styling.
- Leverage shadcn/ui components where possible.
- Maintain consistency across all user-facing pages.
- Test on multiple devices and browsers.

This guide will be updated as the design evolves.

## Layout Structure

- **Route Groups**: User-facing pages organized in `(home)` route group
- **Shared Layout**: `(home)/layout.js` provides navbar, main content area, and footer
- **Page Components**: Individual pages only contain their specific content
- **DRY Principle**: Changes to navbar/footer apply globally via layout

## Navigation

- **Desktop Navbar**: Horizontal layout with logo on left, nav links on right.
- **Mobile Navbar**: Hamburger menu that toggles an overlay menu (fixed positioning, doesn't shift content).
- **Mobile Menu**: Full-screen overlay with vertical link list, closes on link click.
- **Z-index**: Navbar has z-50, mobile menu has z-40 for proper layering.

## Layout Updates

- **Sticky Footer**: Use flexbox with min-h-screen and mt-auto on footer for always-bottom positioning.