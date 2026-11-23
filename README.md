# Birds Murmur Camp — homepage demo

A responsive React + Vite homepage concept for Birds Murmur Camp in Njayappilli, Thattekad, Kerala.

## Run locally

Node.js 20 or later is recommended. From this directory:

```powershell
corepack pnpm install
corepack pnpm dev
```

Run `corepack pnpm run build` for a production build.

## Property information and media

Property details, contact information, current tariff, and testimonial excerpts were aligned with the official Birds Murmur Camp website. The displayed tariff is the rate published there, marked valid through 30 June 2027; confirm current availability and pricing with the camp. The official contact numbers, email, address, social accounts, maps link, room photographs, camp photos, and wildlife photograph are included.

The hero carousel cycles through camp photographs every 6.5 seconds, with manual previous/next and slide controls. It pauses automatic motion for visitors who prefer reduced motion. The booking CTA opens an email draft addressed to the camp; it does not confirm a reservation.

## Stack

React, TypeScript, Vite, GSAP ScrollTrigger, Lenis, Lucide React, and lightweight CSS motion. Three.js is listed as a dependency for future scene work; the page currently uses CSS and parallax effects rather than rendering a Three.js scene.
