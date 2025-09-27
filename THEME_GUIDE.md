# Theme Toggle Implementation Guide

## Overview
A theme toggle component has been successfully implemented with light and dark mode support using CSS variables.

## Color Schemes Implemented

### Light Mode
- Background: `#F3F4F6`
- Card: `#FFFFFF`
- Card Hover: `#F9FAFB`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Border: `#D1D5DB`
- Accent: `#3B82F6`
- Button: `#3B82F6`
- Button Hover: `#2563EB`

### Dark Mode
- Background: `#03012d`
- Card: `#272541`
- Card Hover: `#312f4b`
- Text Primary: `#d5d4d9`
- Text Secondary: `#aeaeb7`
- Border: `#3d3b5e`
- Accent: `#ff7c0a`
- Button: `#4455da`
- Button Hover: `#2d1c9c`

## Files Modified/Created

### 1. `src/components/ThemeToggle.jsx` (NEW)
- Theme toggle component with sun/moon icons
- Persists theme preference in localStorage
- Respects system preference on first visit
- Smooth transitions between themes

### 2. `src/index.css` (UPDATED)
- Added CSS variables for both light and dark themes
- Updated body styling to use CSS variables
- Added theme toggle button styles
- Updated scrollbar styles to use theme colors
- Added utility classes for easy theme color application

### 3. `src/pages/Home.jsx` (UPDATED)
- Imported and added ThemeToggle component
- Positioned next to UnitsCombobox in header

## CSS Variables Available

You can now use these CSS variables throughout your components:

```css
/* Background Colors */
var(--bg-color)          /* Main background */
var(--card-color)        /* Card background */
var(--card-hover-color)  /* Card hover state */

/* Text Colors */
var(--text-primary)      /* Primary text */
var(--text-secondary)    /* Secondary text */
var(--accent-color)      /* Accent color */

/* UI Elements */
var(--border-color)      /* Borders */
var(--button-color)      /* Button background */
var(--button-hover-color) /* Button hover state */
```

## Utility Classes Available

```css
.bg-main            /* Main background color */
.bg-card            /* Card background color */
.bg-card-hover      /* Card hover background color */
.text-primary       /* Primary text color */
.text-secondary     /* Secondary text color */
.text-accent        /* Accent text color */
.border-theme       /* Theme border color */
.bg-button          /* Button background */
```

## How It Works

1. **Theme Detection**: On first visit, respects user's system preference
2. **Theme Persistence**: Saves user's choice in localStorage
3. **Theme Application**: Toggles `dark` class on document root
4. **CSS Variables**: Automatically switches color values based on theme
5. **Smooth Transitions**: CSS transitions provide smooth color changes

## Usage

The ThemeToggle component is automatically included in the header. Users can click the sun/moon icon to switch between light and dark themes.

## Next Steps (Optional Improvements)

To fully utilize the theme system across all components, you may want to update existing hardcoded colors to use the new CSS variables:

1. **Update component styles**: Replace hardcoded colors like `bg-[#272541ff]` with `bg-card`
2. **Update text colors**: Replace hardcoded text colors with `text-primary` or `text-secondary`
3. **Update border colors**: Use `border-theme` class for consistent borders

The theme system is now fully functional and ready to use!