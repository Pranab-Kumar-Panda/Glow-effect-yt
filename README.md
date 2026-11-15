# Reel Glow

A small Chrome extension that fills the black side bars of **Instagram Reels** and **YouTube Shorts** on desktop with a live glow that matches the video's colors.

## What is it?

When you watch Reels or Shorts on a PC, the video is a thin vertical strip in the middle of a wide screen, and the rest is just empty black space.

Reel Glow fills that space with a soft glow taken from the video itself. The colors change as the video changes, the glow starts exactly at the edge of the video with no gap or bezel, and it fades smoothly to black as it moves away.

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

I wanted something that looks like the ambient lighting on a TV: the video stays sharp in the middle and its colors spill softly into the empty space around it. I could not find one that only touched Reels and Shorts and sat flush against the video edge, so I built it.

## What can you expect from me?

This is a personal project, so here is what is realistic:

- Fixes when Instagram or YouTube change their layout and the glow breaks
- Small improvements, like an on/off button and a strength slider
- Simple code that is easy to read and edit, with all settings at the top of `content.js`

If something looks wrong or you have an idea, open an issue and I will take a look.

## Settings

Edit the `CFG` object at the top of `content.js`, reload the extension, then press F5.

| Option       | Default | What it does                                   |
|--------------|---------|------------------------------------------------|
| `opacity`    | `0.75`  | Glow strength (0 to 1)                         |
| `saturate`   | `1.4`   | How vivid the colors are                       |
| `brightness` | `0.7`   | Glow brightness (lower = darker, more subtle)  |
| `fps`        | `12`    | Glow updates per second (lower = lighter)      |
| `scale`      | `2.0`   | Glow size (1.5 = small, 2.5 = large)           |

To use it on YouTube Shorts only, change this line in `manifest.json`:

```json
"matches": ["https://www.youtube.com/*"],
```

## Version history

### v1.1.2 (current)
- Glow is now **smaller** and no longer fills the whole width of the screen. Its size is controlled by the new `scale` setting.
- Glow is **darker and less bright**, so it looks like a background and not a copy of the video (`brightness` 0.7, `opacity` 0.75).
- Glow now **fades to black** as it moves away from the video. Before, it turned whitish far from the video.
- Settings changed: `minScale` was renamed to `scale`, and the `blur` setting was removed.

### v1.1.1
- Fixed the **laptop slowdown** and the **blurry Shorts** caused by a heavy glow effect.
- Removed the big CSS blur filter. The glow now comes from a tiny 32px canvas that the browser smooths by itself.
- The glow is now two small side panels (left and right) and never sits on top of the video.
- Styles are updated only when the video size or position changes, not on every frame.
- Default `fps` lowered from 20 to 12, and nothing is redrawn while the video is paused.

### v1.1.0
- Added the extension **icon** (16, 32, 48 and 128 px) and a **description**.
- The icon now shows in the Chrome toolbar with a tooltip.
- Added the `README.md`.

### v1.0.0
- First version.
- Live glow around Instagram Reels and YouTube Shorts, taken from the real pixels of the video.
- The glow is cut out around the video so it touches the video edge with no gap or bezel.
- Runs only on Reels and Shorts, not on normal YouTube pages.

## Coming in the next version

These are planned and may change:

- A toolbar popup with an **on/off switch**
- **Sliders** for glow size, brightness and strength, so you do not need to edit `content.js`
- Choose where it works: Instagram, YouTube Shorts, or both
- Better support for light theme

Have an idea? Open an issue.

## Notes

- Works best in dark mode. In light themes the glow looks washed out.
- If the layout of Instagram or YouTube changes, video detection may need an update.

## Enjoying it?

If you all enjoy it, make sure to **star this repo**. It really helps and keeps me motivated to improve it.