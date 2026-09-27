# Getting the source, and tools that help

Tool availability depends on which connectors are enabled in the session. Check what is connected before promising a step, and fall back to asking the user to paste the content.

## Getting the source post

| Source | How to get it |
|---|---|
| LinkedIn post | Ask the user to paste the text and the visible numbers (reactions, comments, reposts), or share a screenshot. LinkedIn blocks automated fetching and scraping violates its terms, so don't try to scrape it. For carousels, ask for screenshots of the slides or the PDF. |
| X, Threads | Pasted text or a screenshot. Web fetch sometimes works for public posts. |
| Blog, article, public web page | Web fetch the URL. |
| TikTok, Instagram Reel, YouTube or Short | Use a video-understanding tool if one is connected (for example NEXLEV `watch_tiktok_video_and_ask`, `watch_instagram_video_and_ask`, `watch_youtube_video_and_ask`) and ask it for the hook in the first 2 seconds, the on-screen text, the cut rhythm, the structure and the CTA. Otherwise ask for a transcript and screenshots. |
| Screenshot or image | Read the image directly and extract both the text and the visual DNA. |
| A file (PDF carousel, deck) | Read it with the `markitdown` skill or the PDF tools. |

## Finding what is trending (when there is no source post)

- `recent-discourse-sweep`: what people are saying about a topic in a dated window, with sources.
- `social-media-monitor`, `brand-monitoring`, `community-radar`: mentions and trends across platforms.
- Web search, limited to the last 7-30 days, for the niche plus "LinkedIn post" or "viral".
- NEXLEV tools for YouTube outliers (`youtube_channel_outliers`, `search_viral_videos_small_channels`), which show proven formats in the niche.
- Higgsfield `tiktok_music_trending` for trending audio on TikTok.

## Scoring and predicting

- Higgsfield `virality_predictor` can score a video draft. Treat the result as one signal, not a verdict.
- The user's own history is the best predictor. Ask for their last 10 posts and their numbers when available.

## Making the visual

- Image generation: Higgsfield `generate_image`, Everygen `generate_image`, or ElevenLabs `creative_generate_image`. Use whichever is connected, with the prompt from the delivery.
- Brand consistency: ElevenLabs brand kits (`creative_create_brand_kit_from_website`), or the user's brand colours and fonts stated in the prompt.
- Resizing and format conversion: the `image-editing` skill (for example 1080x1350 for a LinkedIn or Instagram portrait, 1080x1080 square, 1920x1080 landscape).
- Carousels or documents: build the slides as HTML and export them to PDF, or use the `pptx` skill and export. Design review: the `visual-argument-review` skill.
- Repurposing a trending video into Arabic: the `krillinai-subtitle`, `krillinai-tts` and `krillinai-render-vertical` skills can transcribe it, translate it, dub it, and render a vertical cut with bilingual subtitles. They need the KrillinAI CLI (see `krillinai-cli`), and the right to reuse the footage.
- Short video: `remotion-motion-graphics`, `hyperframes`, `embedded-captions` (which has its own visual DNA registry for captions), `talking-head-recut`, or Everygen and Higgsfield video generation.

## Related skills to chain

- `linkedin-ghostwriting`: when the remix is for an executive with a voice card and post ledger.
- `viral-linkedin-lead-magnet-post`: when the source DNA is a "comment X to get it" giveaway.
- `anti-ai-slop-writing` and `human-mannerisms`: the finishing pass on every draft.
- `linkedin-post-to-newsletter`: to extend the winning remix into an email.
- `multi-account-content-fleet`: when several accounts will each post a remix, so they don't all sound the same.
