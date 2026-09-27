# Originality guard

The line: **reuse decisions, never expression.** A hook mechanic, a structure, a rhythm, a format or a colour temperature are decisions anyone can make. Someone else's sentences, story, data, images, template files and personal details are their expression.

## Automatic check (required)

```bash
python3 .claude/skills/trend-dna-remix/scripts/post_dna.py source.txt --compare remix.txt
```

- `trigram_overlap` of 0.15 or less: at most 15% of the remix's 3-word sequences also appear in the source.
- `longest_shared_run_words` of 6 or less: no run of 7 or more consecutive words is copied.
- The script exits with code 2 on failure. A remix that fails is rewritten, not delivered.

Common short phrases ("here's what I learned", "in 2024") can trigger small overlaps, which is fine within the limits. A long shared run always means copying.

## Manual checks (required, because the script can't see these)

1. **Translation copying.** Is the remix the source translated into another language, or into other words, in the same order? If yes, it fails.
2. **Borrowed story.** Is the anecdote, number, client or event the source author's rather than the user's? If yes, it fails.
3. **Signature lines.** Does the remix reuse a catchphrase or coined term that is recognisably the author's (a named framework or a slogan)? Either credit it ("borrowing @Name's framework") or drop it.
4. **Visual copying.** Does the remix reuse the author's photo, template file, exact layout with the same colours, logo, or a recognisable illustration? If yes, it fails. Rebuild it in the user's brand.
5. **Sameness test.** Would a reader who saw both think "that's the same post"? If yes, move toward the "shifted" or "crossbred" distance.

## Crediting

- For inspiration only (DNA), no credit is needed.
- For a named framework, statistic, quote or research, credit the source in the post or in the first comment.
- When the user wants to respond to the original (agree, disagree or build on it), write it as a quote-post or repost with commentary, not as a remix.

## What never happens

- Presenting another person's experience as the user's.
- Invented testimonials, results, client names or screenshots.
- Scraping and republishing someone's carousel or video.
- Impersonating the source author or their brand.
