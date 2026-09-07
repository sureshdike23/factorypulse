---
name: FactoryPulse Precision System
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#62df7d'
  on-tertiary: '#003914'
  tertiary-container: '#007f36'
  on-tertiary-container: '#c7ffca'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.03em
  mono-data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  mono-data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 0.75rem
  gutter-desktop: 1.5rem
  touch-target-min: 3rem
---

## Brand & Style

This design system delivers an uncompromising, industrial-grade operational interface engineered specifically for the reality of precision manufacturing environments—from grease-streaked tablet screens under high-bay mercury-vapor lighting to executive multi-monitor command desks. 

The aesthetic synthesizes **Industrial High-Contrast Utilitarianism** with **Modern Information Density**. It prioritizes instant visual verification, fail-safe interaction states, and zero latency comprehension. Avoid decorative flourishes, ambiguous gradients, or low-contrast stylistic treatments. Surfaces rely on structural technical grids, physical instrument metaphors (bezels, ruled borders, mechanical toggles), and stark, clear hierarchy. The emotional imprint is mission-critical durability, absolute dimensional accuracy, and rugged operational authority.

## Colors

The palette is anchored by deep industrial slate and charcoal foundations optimized for high ambient glare conditions and eye comfort across 12-hour shifts, punctuated by razor-sharp steel highlights and ANSI/OSHA-inspired physical safety accents.

### Color Tokens & Assignments
- **Primary Operational (`#2563EB` / `#1E40AF`):** Cobalt blue reserved strictly for deliberate interactive affordances (primary actions, active telemetry controls, focus indicators).
- **Dark Foundations (`#0B0F19` base, `#111827` surface-default, `#0F172A` surface-raised):** The bedrock of the interface. Provides absolute light absorption behind data visualizations and high-density telemetry tables.
- **Steel White & Neutral Highs (`#FFFFFF` text-primary, `#F8FAFC` text-bright, `#94A3B8` text-muted):** High-luminance contrast text and active structural rules, maintaining a minimum 7:1 contrast ratio against base layers.
- **Safety Status Tiers (Machine State Protocol):**
  - **Nominal / Running Green (`#16A34A` base / `#22C55E` luminous accent):** Indicates optimal cycle times, cleared tolerances, and active spindle uptime.
  - **Caution / Parameter Drift Amber (`#D97706` base / `#F59E0B` luminous accent):** Depicts tool wear thresholds, feed overrides, or maintenance schedules approaching limit.
  - **Critical Halt / Breakdown Red (`#DC2626` base / `#EF4444` luminous accent):** Emergency stops, G-code execution errors, spindle over-torques, and physical interlock breaks. Must command immediate visual focus across the floor.

## Typography

The typographic hierarchy enforces immediate legibility through two complementary engines:
- **Inter** handles narrative, system UI, column headers, and structural workflow labels. Its clean grotesque terminals provide zero optical distortion at skewed viewing angles.
- **JetBrains Mono** is mandatory for all numerical instrumentation, G-code blocks, serial identifiers, heat lots, tolerances, feeds/speeds, and machine telemetry. Tabular numbers align columns down to the exact sub-millimeter, preventing vertical eye wandering during rapid inspection runs.

All technical labels and diagnostic tags leverage `label-caps` in JetBrains Mono with uppercase styling to guarantee visual separation from human-readable narrative descriptions.

## Layout & Spacing

This design system uses a strict **8px/4px base technical grid**. Space is treated as functional real estate; layouts maintain high data density without feeling cluttered by adhering to structured mechanical alignment.

### Grid & Breakpoints
- **Shop Floor Mobile / Tablet (360px – 1023px):** Single to 4-column dynamic fluid layouts. Touch targets expand to `touch-target-min` (48px) to support gloved hands and physical field entry. Toolbars remain pinned to the lower visual field for thumb-reach ergonomics.
- **Production Desk & Workstation (1024px – 1439px):** 8-column structured fluid grid with standard 16px gutters. Collapsible contextual drawer for shift-over logs and tool calibration.
- **Command Center & Multi-Monitor Desktop (1440px+):** 12-to-16-column fixed-margin layout optimized for side-by-side data grids, CAD/CAM telemetry viewers, and live Gantt-style production scheduling lines.

Dense metrics must avoid excessive margins; components rely on internal padding of `0.5rem` to `0.75rem` to keep machine parameters tightly bound to their parent context.

## Elevation & Depth

This design system deliberately eschews soft blurred drop shadows, which wash out on factory-floor screens and introduce visual fuzziness. Hierarchy is instead communicated through **structural tonal layering and high-contrast technical borders**:

- **Floor Layer (Z-0):** Absolute dark slate canvas (`#0B0F19`).
- **Instrument Container (Z-1):** Panel surface (`#111827`) enclosed by a crisp 1px mechanical perimeter rule (`#1E293B`).
- **Interactive & Raised Cells (Z-2):** Elevated interactive components and table cell hover states (`#1E293B`) framed by a sharp inner highlight border (`#334155`).
- **Critical Dialog & Machine Alert Overlays (Z-3):** Modal containers surface with an absolute opaque background (`#0F172A`), enclosed by a deliberate 2px structural warning border (`#2563EB` for operational changes, `#DC2626` for emergency overrides).
- **Physical Hard-Edge Accent:** When an active card or modal requires physical separation, apply a zero-blur, directional offset rule: `box-shadow: 2px 2px 0px 0px #000000`.

## Shapes

The shape vocabulary is strictly **sharp and geometric (0px corner radius)**. Rounded, bubbly UI patterns contradict precision engineering and waste valuable pixel space across dense CNC coordinate tables. 

Every button, card, input cell, tab, and status indicator exhibits square, sheared corners reminiscent of calibrated industrial measurement blocks and panel-mount digital readouts. Badges and chips use 0px rectangular containment with explicit inner 1px structural framing.

## Components

### Buttons
- **Primary Action:** Solid cobalt background (`#2563EB`), crisp white bold label, 0px border radius, 48px height on mobile/tablet (min 40px on desktop). Hover transitions to `#1D4ED8` with a 1px solid steel-white boundary line.
- **Destructive / Emergency Stop:** Solid breakdown red (`#DC2626`), high-contrast white text. When armed or active, utilizes a pulsating 2px border accent.
- **Secondary / Workpiece Utility:** Transparent slate background with a 1px border (`#334155`), white text. Focus state evokes a razor-sharp high-visibility `#2563EB` ring with 0 offset.

### Metric Chips & Status Indicators
- Rectangular blocks with a 1px solid perimeter. Left-side mechanical indicator pip (6px square block, not a circle).
- State green (`#16A34A`), amber (`#D97706`), or breakdown red (`#DC2626`) fill at 15% opacity with 100% solid stroke and monospace text label.

### Data Tables & Multi-Column Ledgers
- Alternating row zebra banding (`#111827` and `#0F172A`) with 1px hairline horizontal grid lines (`#1E293B`).
- Numerical column cells strictly right-aligned using `mono-data-md`, ensuring decimal points align along vertical axes.
- Headers are sticky, locked in `label-caps` typography with an explicit bottom boundary (`#334155`).

### Form Inputs & Telemetry Adjusters
- Recessed background styling (`#0B0F19`) surrounded by a 1px industrial slate outline (`#334155`).
- Dedicated increment/decrement stepper controls for direct numeric changes, sized with large tactile tap zones for tablet touchscreens.
- Active focus invokes a solid 2px primary cobalt stroke (`#2563EB`) with zero glow.

### Machine Cards
- Modular grid containers housing real-time spindle status, part cycle progress bars, and operator badges.
- Top border features a 3px status strip indicating operational readiness: green (active), amber (idle/setup), red (faulted).
- Content split into partitioned mechanical cells using internal structural dividers.