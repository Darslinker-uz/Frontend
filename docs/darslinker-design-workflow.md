# Darslinker social/editorial design workflow

Saved from the user's visual references and feedback on 2026-09-17.
Scope: blog cover illustrations and Instagram/Telegram graphics, not website UI.
This is a project workflow, not an installed artifact-template skill.

## Activation

When the user asks for a Darslinker design, post, cover, illustration, or says
"dizayn qil", read this workflow. The user supplies the topic. If the topic is
missing from the request and context, ask for it; do not invent a campaign.
Default to one square 1:1 image unless a count or format is specified.
Use the imagegen skill/tool for finished raster graphics. Follow the current
tool instructions. Do not substitute a coding/UI task for an image request.

## User preference and boundaries

The user prefers conceptual advertising, visual metaphors, surreal photographic
composites, restrained editorial layouts, bold typography, tangible objects,
and cinematic photography. The idea should be understandable at first glance.
Reference-inspired means similar visual reasoning and craft, not copying the
reference's brand, wording, or exact composition.

The first five generated brain-themed covers were explicitly rejected. Avoid
generic pastel clay brains, floating education icons, busy isometric learning
worlds, engraved science-brain covers, and neon glass-brain aesthetics as defaults.
Later generated examples were explorations, not explicitly approved masters.
Do not treat every future topic as motivation, books, brains, or staircases.
The topic determines the metaphor; the visual system remains consistent.

## Brand system

Latest selection (2026-09-17): for the English-learning-duration article the
user selected concept 07, the measuring tape shaped like a question mark.
Hooks and supporting text must relate directly to the visual metaphor, rather
than pasting a generic article title onto every image. Keep the promise accurate
and make the article subject clear. This applies to future designs too.

Verified in src/app/globals.css and src/components/ui/darslinker-logo.tsx:

- Dusty blue: #7ea2d4; pale blue: #e8f0f9.
- Ink: #16181a; fog: #f2f4f5; white: #ffffff.
- Muted gray: #7c8490.
- Consistent, readable `darslinker.uz` wordmark in plain sans-serif, bottom left.
- Do not invent a different logo. If the actual symbol is needed, inspect and
  use the existing brand asset; a plain wordmark is acceptable for concepts.
- Blue is an accent, not a requirement to tint every object. Neutral warm paper,
  natural skin tones and warm light can support the main palette.
- User clarification (2026-09-17): Darslinker colors should participate in every
  image, sometimes as a very small accent and sometimes over a larger area.
  Keep the result restrained, sophisticated and never childish or garish.
  Vary the amount of brand color according to the concept rather than applying
  a uniform blue wash.
- Latest user feedback (2026-09-17), overrides conflicting older references:
  no people, faces, human figures or portraits in images. Use objects, materials,
  typography and visual metaphors instead. Headlines must be large and easy to
  read on mobile, never tiny editorial captions. Brand text must be exactly
  `darslinker.uz`, with consistent plain sans-serif styling and readable size;
  do not use `darslinker` alone or invent a symbol.
- Rejected for the English-learning-duration topic (2026-09-17): the first four
  concepts (letter-filled hourglass, calendar turning into speech bubble,
  0/Hello keycaps, miniature learner inside smartphone). Do not reuse those
  compositions as approved references; explore materially different directions.
- Clear sans-serif typography, deliberate hierarchy, mobile-readable contrast,
  generous safe margins and negative space. No oversized decorative number badges.
- Uzbek Latin copy by default; correct o‘/g‘ spelling. One short topic-specific
  headline; optional supporting line. Use user-supplied exact copy verbatim.

## Reference library — textual observations

Original user-uploaded image files are not archived here. These descriptions
retain the style observations from all 15 supplied references. Do not claim
that the original pixels are available. For exact image matching in a future
session, use an accessible original reference or request its reattachment.

### First reference group

1. Hanging lamps above gray people, one person lit in yellow: repetition,
   selective accent, empty space, one simple metaphor about standing out.
2. Seated headless person on an oversized head: surreal scale and photomontage,
   beige studio, tactile realism, hand-drawn lettering integrated into the idea.
3. Black chess pawn with stronger-piece shadows: minimal monochrome studio,
   symbolic shadows and latent potential; one object carries the concept.
4. Portfolio typography with pins and notes: editorial collage, paper texture,
   oversized type, hand-drawn arrows and small physical accents.
5. A tiny writer's room inside a Delete key: macro miniature storytelling,
   warm practical lamp, dark surroundings and surprising object-as-world scale.

### Second reference group

6. Pixel dinosaur becoming realistic through a door: transformation across a
   threshold; flat-versus-real contrast on a quiet textured background.
7. Floating quotation card with notification: restrained tactile UI metaphor,
   layered typography and controlled depth. Never invent a quote attribution.
8. Oversized cream headline on burgundy with newspaper-reader cutout: bold
   typographic hierarchy, asymmetry, photo cutout and one informal arrow.
   Borrow layout logic, replacing dominant colors with Darslinker's palette.
9. 'Action creates clarity' with selection highlight: minimal type-first
   composition, underline, a single highlighted phrase and subtle handles.
10. Binoculars emerging through torn paper: believable paper fibers, photoreal
    object, visual search/discovery metaphor and abundant empty space.
11. Lone person crossing diagonal golden light: cinematic overhead photography,
    long shadows, grain, atmospheric light and typography placed in free space.

### Latest reference group

12. Minimal 'Reminder today' editorial with two ceramic cups: warm neutral
    still life, small aligned text block, large breathing room, thin rules,
    understated editorial hierarchy. Dates/credits only when actually relevant.
13. 'Coffee is calling' call notification: familiar UI reimagined as a physical
    object; soft realistic shadow, simple witty metaphor, restrained handwritten
    headline. Adapt to topic, not necessarily coffee or a phone call.
14. Green W/E keyboard keys with handwritten 'Who/Are': tactile keycaps,
    typographic wordplay, two objects, informal arrows and quiet background.
    Use blue/neutral keys for Darslinker and ensure Uzbek wordplay makes sense.
15. Black-and-white person looking upward under fading 'Memories' type:
    emotional monochrome photography, film grain, fading type as a meaningful
    effect and expansive sky. Keep essential words legible; no borrowed handles.

## Design workflow

1. Read the supplied topic, exact copy, audience, requested count and format.
   Resolve optional choices yourself; ask only for missing essential information.
2. Choose the most relevant reference mechanism, not its literal subject:
   shadow metaphor, scale shift, miniature world, threshold, torn paper,
   tactile UI, keycap wordplay, still life, bold collage, or cinematic photograph.
3. Build one clear concept around the topic. Avoid unrelated decorative objects.
   Scientific content must not gain invented statistics, unsupported causal
   claims, fake citations, or diagrams masquerading as accurate anatomy.
4. For multiple examples, vary the concept/composition materially, not just the
   colors. Number them discreetly for selection; omit numbers on final covers.
5. Generate each requested image separately with the built-in image tool.
   Use accessible references when available; otherwise use this written brief
   honestly, without pretending to have attached the original images.
6. Inspect text, Uzbek spelling, brand, square format, contrast, object coherence,
   cropping, and excessive visual clutter. Correct material errors.
7. Deliver the images with short style labels. Save project-bound deliverables
   under output/designs/<topic-slug>/ with non-overwriting filenames. Keep final
   prompts alongside saved deliverables for reproducibility. Follow imagegen's
   save policy for preview-only images.
8. Do not modify the production site, SEO metadata, or publish to social media
   merely because a graphic was requested. Implementation/publishing is separate.

## Prompt scaffold for generation

Create a [format, default square 1:1] Darslinker editorial social graphic about
[USER TOPIC]. Concept: [one topic-specific visual metaphor]. Art direction:
[selected reference mechanism], realistic tangible materials, intentional light,
restrained editorial design and generous negative space. Brand colors #7ea2d4,
#16181a, #f2f4f5; readable darslinker.uz wordmark. Exact headline: [UZBEK COPY].
[Optional supporting line]. Mobile-legible typography, safe margins. Avoid
generic education icon clusters, cartoon clay brains, neon glass, unnecessary
ornament, other brands, fabricated claims and unreadable text.

## Short user prompts

> Darslinker workflow bo‘yicha dizayn qil. Mavzu: [mavzu]. 1:1, 3 ta variant.

> docs/darslinker-design-workflow.md asosida dizayn qil. Mavzu: [mavzu].
> Rasmdagi matn: “[aniq sarlavha]”. 1:1, 1 ta variant.

This workflow is automatically discoverable through this repository's AGENTS.md.
In a different project or chat without this workspace, provide this file.
