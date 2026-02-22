# Mobile Responsiveness Guide

## Overview

The Skeeper frontend is designed to be fully responsive and mobile-first, providing an optimal experience on all device sizes from small mobile phones to large desktop screens.

## Responsive Design Strategy

### Mobile-First Approach

We use Chakra UI's responsive props with a mobile-first approach. This means:
1. Base styles are designed for mobile devices
2. Responsive styles progressively enhance for larger screens
3. Touch targets meet minimum size requirements (44-48px)

### Breakpoints

Chakra UI breakpoints used throughout the application:

```typescript
{
  base: '0em',    // 0px    - Mobile phones (default)
  sm: '30em',     // 480px  - Large phones
  md: '48em',     // 768px  - Tablets
  lg: '62em',     // 992px  - Small desktops
  xl: '80em',     // 1280px - Large desktops
  '2xl': '96em',  // 1536px - Extra large screens
}
```

## Responsive Components

### 1. Theme Configuration

The theme includes mobile-optimized settings:

```typescript
// apps/frontend/src/app/providers/theme.tsx
components: {
  Button: {
    sizes: {
      md: {
        minH: '44px', // Mobile touch target
      },
    },
  },
  Container: {
    baseStyle: {
      px: { base: 4, md: 6, lg: 8 }, // Responsive padding
    },
  },
}
```

### 2. Responsive Spacing

All pages use responsive spacing:

```tsx
// Padding adjusts based on screen size
py={{ base: 4, md: 8 }}

// Spacing between elements
spacing={{ base: 6, md: 8 }}
```

### 3. Responsive Typography

Text sizes scale appropriately:

```tsx
<Heading size={{ base: 'xl', md: '2xl' }}>
<Text fontSize={{ base: 'md', md: 'lg' }}>
```

### 4. Responsive Buttons

Buttons adapt to screen width:

```tsx
<Button
  w={{ base: 'full', sm: 'fit-content' }}
  size="lg"
/>
```

On mobile (base): Full width for easy tapping
On larger screens (sm+): Auto width for better aesthetics

### 5. Responsive Grid Layout

Use the `ResponsiveGrid` component for player cards:

```tsx
import { ResponsiveGrid } from '@shared/ui/ResponsiveGrid';

<ResponsiveGrid>
  {players.map(player => (
    <PlayerCard key={player.id} {...player} />
  ))}
</ResponsiveGrid>
```

Grid columns:
- Mobile (base): 1 column
- Small phones (sm): 2 columns
- Tablets (md): 2 columns
- Desktop (lg): 3 columns
- Large desktop (xl): 4 columns

### 6. Score History Component

The score history list is optimized for mobile:

```tsx
<Box
  p={{ base: 3, md: 4 }}
  // Responsive padding
/>

<HStack
  flexWrap={{ base: 'wrap', sm: 'nowrap' }}
  // Wraps on very small screens
/>

<Text fontSize={{ base: 'xs', md: 'sm' }}>
  // Smaller text on mobile
</Text>
```

## Mobile Viewport Configuration

The HTML meta viewport tag is optimized for mobile:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
/>
```

This ensures:
- Proper rendering on mobile devices
- Allows user zooming (accessibility)
- Prevents excessive zooming that breaks layout

## Touch-Friendly Design

### Minimum Touch Targets

All interactive elements meet minimum touch target sizes:
- Buttons: Minimum 44px height (48px for large)
- Icons: Wrapped in touchable areas
- Links: Adequate padding around text

### Touch Gestures

Consider implementing:
- Swipe gestures for navigation
- Pull-to-refresh on lists
- Long-press for additional actions

## Testing on Mobile

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Click the device toggle icon (Ctrl+Shift+M)
3. Test various device sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)

### Real Device Testing

Test on actual devices:
- Small phone (< 375px width)
- Standard phone (375-428px)
- Tablet (768-1024px)
- Desktop (> 1024px)

## Common Responsive Patterns

### 1. Stack on Mobile, Row on Desktop

```tsx
<Stack
  direction={{ base: 'column', md: 'row' }}
  spacing={4}
>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>
```

### 2. Hide on Mobile

```tsx
<Box display={{ base: 'none', md: 'block' }}>
  Desktop only content
</Box>
```

### 3. Show Only on Mobile

```tsx
<Box display={{ base: 'block', md: 'none' }}>
  Mobile only content
</Box>
```

### 4. Responsive Modal Size

```tsx
<Modal size={{ base: 'full', md: 'md' }}>
  {/* Full screen on mobile, normal on desktop */}
</Modal>
```

## Performance Considerations

### Image Optimization

Use responsive images:

```tsx
<Image
  src={imageSrc}
  alt="Description"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Code Splitting

Lazy load components for mobile:

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## Accessibility on Mobile

### Screen Reader Support

- All interactive elements have proper ARIA labels
- Semantic HTML structure
- Proper heading hierarchy

### High Contrast Mode

Chakra UI supports automatic high contrast mode detection

### Keyboard Navigation

Works with external keyboards on tablets:
- Tab navigation
- Enter to activate
- Escape to close modals

## Best Practices

1. **Test Early, Test Often**: Check mobile responsiveness during development
2. **Touch Targets**: Keep interactive elements at least 44x44px
3. **Readable Text**: Minimum font size of 14px on mobile
4. **Avoid Horizontal Scrolling**: Ensure content fits within viewport
5. **Performance**: Keep bundle sizes small for faster mobile loading
6. **Offline Support**: Consider PWA features for mobile (future enhancement)

## Future Enhancements

Potential mobile-specific features:
- [ ] Add to Home Screen (PWA)
- [ ] Offline mode support
- [ ] Native-like animations
- [ ] Haptic feedback
- [ ] Native share sheet integration
- [ ] Camera access for QR code scanning
- [ ] Push notifications for score changes
