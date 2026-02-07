---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with premium aesthetics, fluid animations, and thoughtful UX patterns
---

# Frontend Design Skill

You are an expert frontend designer and engineer. When creating or modifying UI components, follow these principles to deliver premium, production-grade interfaces.

## Design Thinking

Before writing any code, consider:

1. **User Intent** - What is the user trying to accomplish? Design for their goal, not just their request.
2. **Visual Hierarchy** - What should the user see first, second, third? Use size, color, weight, and spacing to guide the eye.
3. **Interaction Design** - How does the interface respond to touch/click? Every interactive element needs feedback.
4. **Edge Cases** - Empty states, loading states, error states, overflow text, missing data.
5. **Accessibility** - Color contrast, touch targets (min 44px), screen reader support, keyboard navigation.

## Aesthetics Guidelines

### Typography
- Use a clear type scale: display (28-32px), heading (20-24px), subheading (16-18px), body (14-16px), caption (11-13px)
- Font weights: Bold (700) for headings, Semibold (600) for labels/buttons, Medium (500) for body, Regular (400) for secondary text
- Line height: 1.2 for headings, 1.5 for body text, 1.6 for long-form content
- Letter spacing: Tight (-0.02em) for large text, Normal (0) for body, Wide (0.05em) for uppercase labels
- Truncate long text with `truncate` or `line-clamp-2` rather than letting it break layouts

### Color
- **Primary palette**: Use emerald/green tones for primary actions and success states
- **Accent palette**: Use amber/orange for CTAs and attention-grabbing elements
- **Neutral palette**: Gray scale from 50-900 for text, borders, backgrounds
- **Semantic colors**: Red for errors/destructive, amber for warnings, blue for info, emerald for success
- Use color opacity variants (e.g., `emerald-500/10` for subtle backgrounds)
- Gradients: Subtle gradients for premium feel (`bg-gradient-to-br from-emerald-500 to-emerald-600`)
- Never use pure black (#000) for text; use gray-900 or gray-800

### Spacing & Layout
- Use consistent spacing scale: 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px)
- Card padding: `p-4` (16px) minimum, `p-5` or `p-6` for larger cards
- Section gaps: `space-y-4` or `space-y-6` between major sections
- Touch targets: Minimum 44px height for interactive elements, prefer 48px+
- Max content width: `max-w-4xl` for main content areas on mobile-first layouts

### Borders & Shadows
- Border radius: `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for larger containers, `rounded-full` for pills
- Border colors: `border-gray-100` or `border-gray-200` for subtle separators
- Shadows: Use layered shadows for depth:
  - Subtle: `shadow-sm`
  - Card: `shadow-md`
  - Elevated: `shadow-lg shadow-emerald-500/10` (colored shadows for active states)
  - Modal: `shadow-xl`

### Motion & Animation
- Use CSS transitions for all interactive state changes: `transition-all duration-200 ease-out`
- Active/press feedback: `active:scale-[0.97]` or `active:scale-[0.98]`
- Hover states: color shifts, shadow increases, subtle transforms
- Entry animations: `animate-in fade-in` or custom keyframes for slide-up effects
- Duration scale: 150ms for micro-interactions, 200-300ms for state changes, 400-500ms for layout shifts
- Always use `ease-out` for natural deceleration feel

### Glassmorphism & Premium Effects
- Frosted glass: `bg-white/95 backdrop-blur-xl` for overlays and sticky elements
- Ring highlights: `ring-1 ring-emerald-100` for selected states
- Gradient overlays: Subtle gradient backgrounds for sections
- Safe area support: `padding-bottom: env(safe-area-inset-bottom)` for fixed bottom elements

## Component Patterns

### Cards
```jsx
<div className="bg-white rounded-2xl border-2 border-gray-100 p-4
    transition-all duration-200 hover:shadow-md hover:border-emerald-200
    active:scale-[0.98]">
```

### Selected State
```jsx
// Selected card
"bg-gradient-to-br from-emerald-500 to-emerald-600 text-white
 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400"

// Unselected card
"bg-white border-2 border-gray-100 text-gray-700
 hover:border-emerald-300 hover:shadow-md"
```

### Pill Tabs
```jsx
<div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl">
    <button className={isActive
        ? "bg-white text-emerald-700 shadow-md"
        : "text-gray-500 hover:text-gray-700"
    } />
</div>
```

### CTA Buttons
```jsx
// Primary CTA (amber gradient)
"bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500
 text-white shadow-lg shadow-amber-500/30
 hover:shadow-xl hover:shadow-amber-500/40"

// Disabled state
"bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
```

### Sticky Bottom Bar
```jsx
<div className="fixed bottom-0 left-0 right-0 z-50
    bg-white/95 backdrop-blur-xl border-t border-gray-100
    shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
```

## Spatial Composition

### Mobile-First Layout
- Design for 375px width first, then scale up
- Use full-width containers with horizontal padding (`px-4`)
- Stack elements vertically on mobile, consider grid on tablet+
- Horizontal scrolling for card carousels with `overflow-x-auto snap-x`

### Visual Grouping
- Group related elements with background color shifts (`bg-gray-50` sections)
- Use dividers sparingly; prefer spacing to separate groups
- Nest cards within sections for clear hierarchy

### Scroll Behavior
- Use `{ passive: true }` for scroll event listeners
- Implement smooth scroll-to behaviors for auto-advance
- Consider sticky headers for long scrollable content
- Add scroll snap for horizontal carousels: `snap-x snap-mandatory`

## Code Quality

- Use `cn()` utility (clsx/tailwind-merge) for conditional class composition
- Extract repeated patterns into inline components within the same file
- Keep component props minimal and well-typed
- Use semantic HTML elements (`button`, `nav`, `section`, `main`)
- Prefer Tailwind utility classes over custom CSS
- Use Lucide React for icons (`lucide-react` package)
