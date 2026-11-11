# Reel Glow

A small Chrome extension that fills the black side bars of **Instagram Reels** and **YouTube Shorts** on desktop with a live glow that matches the video's colors.

## What is it?

When you watch Reels or Shorts on a PC, the video is a thin vertical strip in the middle of a wide screen, and the rest is just empty black space.

Reel Glow fills that space with a soft, blurred glow taken from the video itself. The colors change as the video changes, and the glow starts exactly at the edge of the video, so there is no gap or bezel between them.

- Works only on Instagram Reels and YouTube Shorts
- Normal YouTube videos, home page and search are not touched
- Reads the real pixels of the video, so the glow always matches
- No permissions, no tracking, no network requests

## How to install (on your local computer)

1. Download this project and extract it, so you have the `reel-glow` folder.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right corner).
4. Click **Load unpacked** and select the `reel-glow` folder.
5. Open Instagram Reels or YouTube Shorts.
6. **Press F5** (or the refresh button) to reload the page.

### Why F5?

Chrome only injects an extension into pages that are loaded *after* it is installed. A page that was already open does not know the extension exists yet. Refreshing with F5 loads the page again, and the glow starts working. You also need F5 after you reload or update the extension.

Keep the `reel-glow` folder where it is. If you delete or move it, the extension stops working.

## Why I made this

Watching Reels and Shorts on a big monitor feels wasteful. About two thirds of the screen is plain black, and that makes the video feel small and boring.

I wanted something that looks like the ambient lighting on a TV: the video stays sharp in the middle and its colors spill into the empty space around it. I could not find one that only touched Reels and Shorts and sat flush against the video edge, so I built it.

## What can you expect from me?

This is a personal project, so here is what is realistic:

- Fixes when Instagram or YouTube change their layout and the glow breaks
- Small improvements, like an on/off button and a strength slider
- Simple code that is easy to read and edit, with all settings at the top of `content.js`

If something looks wrong or you have an idea, open an issue and I will take a look.

## Settings

Edit the `CFG` object at the top of `content.js`, reload the extension, then press F5.

| Option       | Default | What it does                              |
|--------------|---------|-------------------------------------------|
| `opacity`    | `0.95`  | Glow strength (0 to 1)                    |
| `blur`       | `18`    | Softness of the glow, in px               |
| `saturate`   | `1.8`   | How vivid the colors are                  |
| `brightness` | `1.1`   | Glow brightness                           |
| `fps`        | `20`    | How often the glow updates                |
| `minScale`   | `1.5`   | How far the glow spreads past the video   |

To use it on YouTube Shorts only, change this line in `manifest.json`:

```json
"matches": ["https://www.youtube.com/*"],
```

## Notes

- Works best in dark mode. In light themes the glow looks washed out.
- If the layout of Instagram or YouTube changes, video detection may need an update.

## Enjoying it?

If you all enjoy it, make sure to **star this repo**. It really helps and keeps me motivated to improve it.