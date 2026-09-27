---
name: trend-dna-remix
title: Trend DNA remix
description: |
  Use this skill when someone wants to take a post that is trending or performing well - on LinkedIn, X, Instagram, TikTok, Facebook or anywhere online - and make their own post "with the same DNA": the same hook mechanic, structure, rhythm, emotional arc, format and visual language, but their own topic, story, proof and voice. Triggers on "remix this viral post", "make me a post like this one", "why did this post go viral", "extract the formula of this post", "same style as this LinkedIn post", "recreate this trend for our brand", "اعمل منشور بنفس DNA", "نفس أسلوب هذا المنشور", "حلل هذا الترند", "ليه المنشور ده انتشر". Produces a DNA card (text, visual and engagement DNA, with measured fingerprint), three ranked remixes for the target platform with visual direction and an image prompt, and an originality check proving nothing was copied. Never publishes.
category: Content
tags: [Marketing, Social, LinkedIn, Trends, Design]
---

Applies when a person points at a post that worked and wants their own post built on the same pattern. Produces a DNA card, three ranked remixes, a visual brief, and an originality report. It never posts anything.

A post's "DNA" is the set of decisions that made it work, separable from what it is about: how the hook creates a gap, how the body is paced, where the turn lands, what the reader is asked to do, and what the visual signals before a word is read. The content (the story, the numbers, the claims, the wording) belongs to the original author. This skill copies the decisions, never the content.

## Required inputs

Gather these before extracting anything. A remix without a real story of the user's own comes out generic.

- **The source post(s)** - the full text pasted, a screenshot, a URL, or a video link. LinkedIn blocks automated reading, so for LinkedIn ask for pasted text or a screenshot. How to get each source type, and which connected tools help, is in `references/sources-and-tools.md`.
- **Why it counts as a trend** - reactions, comments, reposts, author follower count, and post age if visible. A post with 2,000 reactions from an account with 500,000 followers is not an outlier; one with 800 from an account with 3,000 is. If there are no numbers, say the DNA is unverified.
- **The user's raw material** - the real story, number, lesson, client case, or opinion the remix will carry. Ask for it. Never invent a personal story, a statistic, a client or a result.
- **Target platform, language and account** - LinkedIn by default. Arabic, English, or both. Personal profile or company page. Brand colors, fonts and logo if a graphic is needed.

## The play

1. **Qualify the trend.** Check the numbers against the author's normal performance (the outlier test above). If several posts are available, prefer two or three that share a pattern over one lucky post. For "what is trending right now" questions with no source post, run `recent-discourse-sweep` first to find the posts, then come back here.
2. **Fingerprint the text.** Save the post to a file and run `python3 .claude/skills/trend-dna-remix/scripts/post_dna.py source.txt`. This measures the countable DNA: length, line rhythm, whitespace, hook size, list items, emoji, hashtags, CTA type.
3. **Extract the DNA card.** Fill every field of `templates/dna-card.md`: hook mechanic, structure skeleton, emotional arc, tension-and-turn, voice markers, proof type, CTA mechanic, visual DNA, and engagement DNA. Name each element with the vocabulary in `references/dna-schema.md`. Then mark the **load-bearing genes**, the two to four elements that most likely explain the result, and say why. Everything else is optional.
4. **Separate DNA from content.** List what cannot be reused: the author's story, numbers, named people, phrases, jokes and images. If the post's power comes from a fact only that author owns (their exit, their layoff, their famous client), say so. The remix then needs an equivalent true fact from the user, not a borrowed one.
5. **Map the user's material onto the skeleton.** Match the user's real story to each slot of the structure. If a slot has no true material, change the slot or pick a different DNA. Never fill it with invention. Platform rules (LinkedIn "see more" fold, length bands, link placement, carousel and document posts) are in `references/platform-patterns.md`. Arabic and bilingual rules are in `references/arabic-and-bilingual.md`.
6. **Draft three remixes, each a different distance from the source:**
   - **Close:** same skeleton and hook mechanic, new everything else.
   - **Shifted:** same load-bearing genes, a different format or angle (for example a text post becomes a carousel, or a list becomes a story).
   - **Crossbred:** the load-bearing genes combined with one gene from the user's own best past post, so it still sounds like them.
7. **Finish each draft.** Strip AI tells with the `anti-ai-slop-writing` rules, then add one or two real human touches from the user's material. Match the fingerprint on purpose: run `post_dna.py source.txt --compare remix.txt` for each draft. Aim for a structure match of 75 or more.
8. **Run the originality gate.** Every remix must pass the script check: 3-word overlap of 15% or less, and no shared run longer than 6 words. The script exits with code 2 on failure. Then run the manual checks in `references/originality-guard.md`, which include translation copying the script cannot detect. A remix that fails is rewritten, not delivered.
9. **Brief the visual.** For each remix, state the format (text only, single image, carousel or document, short video) and describe the visual DNA to reuse: layout, text-on-image ratio, colour temperature, face or no face, and type style. Hand over a ready-to-paste image prompt in the user's brand, never in the source author's brand. For a carousel, give slide-by-slide copy. The `visual-argument-review` skill can review the final design. Generation tools are listed in `references/sources-and-tools.md`.
10. **Score, rank and deliver.** Score each remix from 1 to 5 on hook strength, fit with the user's voice, proof, and why it matters now. Deliver in the order of `templates/delivery.md`: DNA card, then three ranked remixes with visuals, then the originality report, then a suggested first comment and a posting-time note. Close the loop by asking the user to report the post's numbers after 48 hours. Record which genes worked in their own DNA library at `content-dna/library.md` in the repo if they want one kept.

## What good looks like

- **What the best operator notices first:** most viral posts are carried by two or three genes. Usually that is a hook that opens a specific gap, one concrete number or scene, and a turn in the second half that reframes the start. The rest is decoration. Copying the decoration (emoji, line breaks, "Here's what I learned:") while missing the load-bearing gene is the most common way remixes flop.
- **The common mistake:** paraphrasing the original, where the same story gets new words. That is plagiarism, readers notice, and LinkedIn audiences often saw the original. The second mistake is inventing a story to fill the skeleton. One fake anecdote costs more trust than ten mediocre posts.
- **How you know it worked:** someone who saw the original would recognise the energy of the remix but not the post. The remix passes the originality gate, matches the fingerprint at 75 or more, carries only true material from the user, and reads aloud like the user.

## Rules

- MUST fill the DNA card and name the load-bearing genes before drafting.
- MUST run `post_dna.py --compare` on every remix and deliver only remixes that pass.
- MUST use only true material the user supplied or approved. Invented stories, numbers, clients and testimonials are never allowed.
- MUST keep the user's brand in visuals. The source author's photos, logos, templates, names and exact layouts are never reused.
- MUST say when a trend is unverified (no numbers) or not an outlier.
- NEVER translate the original post and call it a remix. Cross-language copying is still copying.
- NEVER post, schedule, comment, or reach out to the original author on the user's behalf. Deliver drafts for a human to post.
- NEVER claim that a remix "will go viral". Give the reasons it could, and the numbers to watch.
