# UNO Card Design Guide - Pure CSS

## Card Structure

All UNO cards are created using **pure CSS** - no images required! Here's what each card includes:

### Card Anatomy
```
┌─────────────┐
│ 5  ┌─────┐  │  ← Top left corner (small value)
│    │     │  │
│    │  5  │  │  ← Center oval with large value
│    │     │  │
│    └─────┘  │
│         5   │  ← Bottom right corner (rotated)
└─────────────┘
```

## Card Types

### 1. Number Cards (0-9)
- **Colors**: Red, Blue, Green, Yellow
- **Design**: 
  - Colored gradient background
  - White oval in center
  - Number displayed in 3 places (top-left, center, bottom-right)
  - Center oval rotated -20° for authentic UNO look

### 2. Special Cards

#### Skip Card (⊘)
- Symbol: Circle with diagonal line
- Same layout as number cards
- Appears in all 4 colors

#### Reverse Card (⇄)
- Symbol: Double arrow (left-right)
- Same layout as number cards
- Appears in all 4 colors

#### Draw 2 Card (+2)
- Symbol: "+2" text
- Same layout as number cards
- Appears in all 4 colors

### 3. Wild Cards

#### Wild Card (W)
- **Background**: Rainbow gradient (Red → Blue → Green → Yellow)
- Symbol: "W" with gradient text
- Semi-transparent center oval

#### Wild Draw 4 Card (+4)
- **Background**: Rainbow gradient (Red → Blue → Green → Yellow)
- Symbol: "+4" with gradient text
- Semi-transparent center oval

### 4. Card Back
- **Background**: Red radial gradient
- **Design Elements**:
  - Yellow circular border (rotated 45°)
  - Inner yellow circle
  - "UNO" text in yellow
  - Layered design for depth

## CSS Features Used

### Gradients
- `linear-gradient()` for card colors
- `radial-gradient()` for card back
- Multi-stop gradients for wild cards

### Transforms
- `rotate()` for center oval tilt
- `rotate(180deg)` for bottom corner
- `rotate(45deg)` for card back circle

### Shadows
- `box-shadow` for card depth
- `text-shadow` for text readability
- Layered shadows for 3D effect

### Animations
- Glow effect for playable cards
- Hover lift animation
- Pulsing shadow for emphasis

## Color Palette

```css
Red:    #e74c3c → #c0392b
Blue:   #3498db → #2980b9
Green:  #2ecc71 → #27ae60
Yellow: #f1c40f → #f39c12
```

## Responsive Sizing

### Desktop
- Card: 90px × 135px
- Center value: 2.5rem
- Corner value: 1rem

### Mobile
- Card: 65px × 95px
- Center value: 1.8rem
- Corner value: 0.8rem

## Special Effects

1. **Playable Cards**: Golden glow animation
2. **Hover**: Lift up + scale slightly
3. **Card Back**: Layered circles with rotation
4. **Wild Cards**: Gradient text effect using `-webkit-background-clip`

## No Images Needed! 🎨

Everything is rendered with:
- CSS gradients
- CSS transforms
- CSS pseudo-elements (::before, ::after)
- CSS animations
- Unicode symbols (⊘, ⇄)

The result is lightweight, scalable, and looks great on any screen!
