# Scene transitions

## Reference analysis

Studied the supplied [ABWedding repository](https://github.com/BrahmanshK10/ABWedding), specifically `js/page.js` (`paintBackdrop`, `updateFx`, `updatePassages`) and `css/main.css` passage, thread, and layered-stage rules. The useful distinction is the space between ceremonies: backdrop changes and independently moving layers connect the functions. The previous repeated section masks were removed.

This implementation is authored for Pavgun and Ashmeet in React/GSAP. Reference artwork, family content, and source code are not embedded.

## Motion direction

Focal sequence: move from one ceremony atmosphere into the next through dedicated passages. The old and new paintings share the viewport during the change; a short connecting line and two drawn gold threads create a pause in the invitation.

| Destination | Passage |
| --- | --- |
| Engagement | Emerald velvet wings close and open onto the ballroom |
| Sagan | Maroon curtains conceal the evening and part onto the courtyard |
| Jaggo | Daylight drains into violet; stars rise before the night painting arrives |
| Haldi & Mehendi | A sun rises through indigo and its pool of light reveals the garden |
| Anand Karaj | A moving floral layer gathers, then clears into the quiet morning |
| Wedding Celebration | Blush blossoms part at the sides as the floral pavilion opens from the centre |

Continuity: passages hold their stage in view while scroll controls the sequence. Reversing scroll reverses the transition. Ceremony headings remain visible; there is no repeated heading entrance. Ambient motion differs by ceremony: crystal sway, hanging marigolds, rising embers, garden petals, jasmine sway, and tumbling rose confetti.

Navigation: header shortcuts jump directly to ceremony content. Desktop Continue links lead through the next passage. Transition anchors support direct links such as `#transition-jaggo`. Reduced motion collapses passages to zero-height anchor targets, preserving the consecutive readable invitation.

Budget: reuse the existing responsive paintings; animate transforms, opacity, bounded masks and the passage background. Ambient loops pause offscreen and when hidden. No new imagery or animation dependency is required.

## Browser evidence

Inspected curtain and dusk midpoints on desktop using actual native scrolling; inspected sunrise, floral clearing and pavilion opening at 390 px. Dusk midpoint showed an intermediate backdrop, partially arrived stars and drawn threads. Sunrise midpoint showed a partially expanded incoming painting mask. Phone document width equalled its scroll width. Direct transition links were checked after reload. Build/typecheck and existing automated checks are separate from this visual evidence.
