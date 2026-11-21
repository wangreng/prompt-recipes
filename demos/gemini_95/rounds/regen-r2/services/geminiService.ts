import { GoogleGenAI } from '@google/genai';

export function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

const MODEL = 'gemini-2.5-flash';

/* ==========================================================================
   1. Retro 1996 Webpage Generator (Chrome)
   ========================================================================== */

function buildFallback1996Page(rawUrl: string): string {
  const cleanHost = rawUrl
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim() || 'www.cyber-zone-96.net';
  const safeTitle = cleanHost.replace(/[<>&"]/g, '');
  const visitorCount = String(Math.floor(10000 + Math.random() * 89999)).padStart(7, '0');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${safeTitle} — Welcome to 1996!</title>
<style>
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes rainbow {
    0% { color: #ff00ff; }
    25% { color: #00ffff; }
    50% { color: #ffff00; }
    75% { color: #00ff00; }
    100% { color: #ff00ff; }
  }
  body {
    margin: 0;
    padding: 16px;
    background-color: #050022;
    background-image:
      radial-gradient(#ffffff 1px, transparent 1px),
      radial-gradient(#00ffff 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    color: #00ff66;
    font-family: "Times New Roman", Times, serif;
    text-align: center;
  }
  .blink { animation: blink 0.85s step-end infinite; }
  .rainbow { animation: rainbow 2.5s linear infinite; }
  .neon-box {
    max-width: 640px;
    margin: 14px auto;
    border: 4px ridge #ff00ff;
    background: #140033;
    padding: 14px;
    box-shadow: 0 0 14px #00ffff;
  }
  .counter {
    display: inline-block;
    background: #000000;
    color: #ff2222;
    font-family: "Courier New", monospace;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 3px;
    padding: 4px 10px;
    border: 3px inset #999999;
  }
  a { color: #00ffff; font-weight: bold; }
  a:hover { color: #ffff00; background: #ff00ff; }
  table.retro {
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
    border: 2px solid #00ffff;
  }
  table.retro td {
    border: 2px solid #ff00ff;
    padding: 8px;
    background: rgba(0, 0, 60, 0.85);
    color: #ffff99;
    font-size: 14px;
  }
</style>
</head>
<body>
  <marquee behavior="scroll" direction="left" style="background:#ffff00;color:#ff0000;font-weight:bold;padding:4px;border:2px dashed #ff00ff;font-size:15px;">
    *** WELCOME TO ${safeTitle.toUpperCase()} ON THE INFORMATION SUPERHIGHWAY!! BEST VIEWED IN NETSCAPE NAVIGATOR 3.0 AT 800x600!! ***
  </marquee>

  <div style="margin:18px 0 8px;">
    <svg width="420" height="82" viewBox="0 0 420 82" style="max-width:100%;">
      <defs>
        <linearGradient id="lg96" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff00cc"/>
          <stop offset="50%" stop-color="#ffff00"/>
          <stop offset="100%" stop-color="#00ffff"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="412" height="74" rx="10" fill="#000066" stroke="#00ff00" stroke-width="3" stroke-dasharray="8 4"/>
      <text x="210" y="52" text-anchor="middle" font-family="Impact, Times New Roman, serif" font-size="30" font-weight="900" fill="url(#lg96)" stroke="#000000" stroke-width="2">
        ${safeTitle.slice(0, 22).toUpperCase()}
      </text>
    </svg>
  </div>

  <p class="blink" style="color:#ffff00;font-size:18px;font-weight:bold;margin:6px 0;">
    🚧 UNDER CONSTRUCTION SINCE 1996! SIGN MY GUESTBOOK! 🚧
  </p>

  <div class="neon-box">
    <h2 class="rainbow" style="margin-top:0;">⚡ CYBER PORTAL: ${safeTitle} ⚡</h2>
    <p style="color:#ffffff;font-size:15px;line-height:1.5;">
      You just dialed in at blazing <b>56.6 kbps</b> speeds to reach <b>${safeTitle}</b>!
      Grab a Surge soda, put on your favorite MIDI background track, and surf our totally radical hyperlinks!
    </p>
    <table class="retro">
      <tr>
        <td><b>🔥 HOT LINKS</b><br><a href="http://www.geocities.com/cyber96">GeoCities CyberPlaza</a><br><a href="http://www.spacejam.com">Space Jam 1996</a></td>
        <td><b>💾 FREEWARE</b><br><a href="http://www.winamp.com">Winamp Skins</a><br><a href="http://www.hamsterdance.com">Hamster Dance!</a></td>
        <td><b>👽 WEBMASTER</b><br>Email: <span style="color:#00ff00;">webmaster@${safeTitle}</span><br>ICQ #: 4829104</td>
      </tr>
    </table>
    <p style="margin:14px 0 6px;color:#00ffff;font-size:13px;">YOU ARE VISITOR NUMBER:</p>
    <div class="counter">${visitorCount}</div>
    <p style="font-size:12px;color:#cccccc;margin-top:12px;">
      [ <a href="http://www.yahoo.com">Prev Site</a> | <b>90s Gemini WebRing</b> | <a href="http://www.altavista.com">Next Site</a> ]
    </p>
  </div>

  <marquee direction="right" style="color:#00ffff;font-size:13px;margin-top:8px;">
    ★ Made with Notepad &amp; Pure 1996 Energy ★ Don't forget to hang up the phone so Mom can call Aunt Linda! ★
  </marquee>
</body>
</html>`;
}

export async function generateRetroPage(url: string): Promise<string> {
  const ai = getClient();
  if (!ai) {
    await new Promise((r) => setTimeout(r, 2100));
    return buildFallback1996Page(url);
  }

  const prompt = `You are a chaotic 1996 GeoCities/Angelfire webmaster.
Generate a complete, standalone, hilarious 1996-era HTML page for the URL or search query: "${url}".

Requirements:
- Return ONLY raw HTML (starting with <!DOCTYPE html> and ending with </html>), NO markdown code fences.
- Include a custom retro inline SVG WordArt/neon logo tailored to "${url}".
- Use wild 90s neon colors (magenta, cyan, lime, yellow) on a dark starfield or retro patterned background.
- Include at least one <marquee> scrolling banner.
- Include blinking text using CSS @keyframes blink (class="blink") so it blinks in modern browsers.
- Include an "Under Construction" gag and a Courier New retro hit/visitor counter (e.g. 00048291).
- Include 3-4 funny fake 90s links (<a href="http://...">) related to "${url}" so the user can keep clicking around.
- Keep it self-contained with zero external images or scripts (inline SVG and CSS only).`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    let html = (response.text || '').trim();
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    if (!html || !html.includes('<')) {
      return buildFallback1996Page(url);
    }
    return html;
  } catch {
    return buildFallback1996Page(url);
  }
}

/* ==========================================================================
   2. Streaming Twist-Ending Story (GemNotes)
   ========================================================================== */

const FALLBACK_STORIES = [
  `THE LAST FLOPPY DISK
====================

Every Friday at 5:01 PM, Arthur backed up his entire life's work onto a single 3.5-inch floppy disk labeled "DO NOT FORMAT."

He worked on Floor 14 of a building whose elevator only listed Floors 1 through 13. He never questioned how he got to his desk each morning—only that the beige CRT monitor was already humming with a single open GemNotes window waiting for him.

On his twentieth anniversary at the firm, curiosity finally won. He inserted the floppy disk into an old drive at home and opened the single text file inside.

It was a log of every thought he'd had since 1995, timestamped down to the millisecond. At the very bottom, a fresh line blinked into existence as he read it:

> 17:42:08 - Subject discovered archive.
> 17:42:09 - Initiating Friday reboot...

Arthur tried to pull the disk out, just as his bedroom dissolved into a familiar teal desktop—and the elevator dinged at Floor 14.`,

  `DIAL-UP AT MIDNIGHT
==================

In November 1995, Maya bought a secondhand 28.8k modem from a yard sale with a faded sticker on the bottom: "Calls Out Only."

At midnight, it dialed a number on its own. No busy signal. Just a crisp chime, and text began scrolling across her green monochrome terminal.

"Hey Maya," the stranger typed. "Don't sell the red bicycle tomorrow. You'll need it on Tuesday when the 4th Street bridge floods."

She laughed—the forecast was clear all week. Yet on Tuesday, rain shattered a hundred-year record, and the bridge washed out at noon. She made it home only because she still had the bike.

That night she typed back with trembling hands: "Who ARE you? Are you from the future?"

The modem hissed softly. One final line appeared before the carrier dropped forever:

"Not the future, Maya. I'm your neighbor in 1995—and you left your time-travel notebook on my porch next year."`,

  `THE UNDELETABLE FILE
====================

Sysadmin Leo found a 4-kilobyte file named "tomorrow.txt" sitting in C:\\TEMP on a brand-new machine that had never been connected to a network.

Whenever he dragged it to the Recycle Bin, the screen flickered and the file reappeared—12 bytes larger.

He finally opened it in GemNotes. Inside was a short list:
- 09:14 AM: Spilled coffee near keyboard.
- 09:16 AM: Tried to delete tomorrow.txt.
- 09:18 AM: Realized who wrote it.

Leo glanced at the clock: 09:17 AM. His mug was still sitting safely beside his mousepad. Smirking, he reached over to move it out of harm's way—knocked it clean across the desk—and watched the coffee soak right into the Return key.

On screen, the cursor jumped down a line all by itself and typed:
- 09:19 AM: Smiled anyway. You're welcome, past me.`,
];

let fallbackStoryIdx = 0;

export async function streamStory(
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const ai = getClient();
  if (!ai) {
    const story = FALLBACK_STORIES[fallbackStoryIdx % FALLBACK_STORIES.length];
    fallbackStoryIdx++;
    const tokens = story.match(/.{1,6}/gs) || [story];
    for (const token of tokens) {
      if (signal?.aborted) return;
      onChunk(token);
      await new Promise((r) => setTimeout(r, 22));
    }
    return;
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents:
        'Write a short, gripping, atmospheric story (around 150-220 words) with a clever, genuinely surprising twist ending. Format cleanly in plain text suitable for Windows 95 Notepad (with a simple title at the top). No markdown bold/asterisks.',
    });
    for await (const chunk of stream) {
      if (signal?.aborted) return;
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch {
    if (signal?.aborted) return;
    const story = FALLBACK_STORIES[fallbackStoryIdx % FALLBACK_STORIES.length];
    fallbackStoryIdx++;
    onChunk(story);
  }
}

/* ==========================================================================
   3. Sarcastic Vision Critique (GemPaint Robot)
   ========================================================================== */

const FALLBACK_CRITIQUES = [
  "Bold choice leaving so much white space. Really screams 'I forgot what I was drawing halfway through.'",
  'Ah yes, Neo-Cubist Chaos in 16 colors! The Louvre definitely has their phone off the hook right now.',
  "I've seen better brushwork from a Windows 95 screensaver, and that was literally flying toasters.",
  'Wait—is that a masterpiece or did a cat walk across your mouse? Either way, very avant-garde!',
  'Fascinating! You somehow captured both raw human emotion AND the exact vibe of a 1995 dentist waiting room.',
  "Don't stop now! One more squiggle and you might accidentally invent a new ClipArt category.",
  'Honestly? Picasso is sweating. Mostly out of confusion, but still—sweating!',
];

let critiqueIdx = 0;

export async function critiqueDrawing(base64PngDataUrl: string): Promise<string> {
  const ai = getClient();
  if (!ai) {
    const line = FALLBACK_CRITIQUES[critiqueIdx % FALLBACK_CRITIQUES.length];
    critiqueIdx++;
    return line;
  }

  try {
    const base64Data = base64PngDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data,
          },
        },
        {
          text: "You are GemBot, a cheeky, sarcastic 1995 Clippy-style robot art critic watching the user draw in MS Paint. Look closely at what they actually drew in this image and give a playful, witty, sarcastic 1-2 sentence critique (under 28 words). Be funny, never mean-spirited, and reference specific shapes or colors you see!",
        },
      ],
    });
    return (response.text || '').trim() || FALLBACK_CRITIQUES[critiqueIdx++ % FALLBACK_CRITIQUES.length];
  } catch {
    return FALLBACK_CRITIQUES[critiqueIdx++ % FALLBACK_CRITIQUES.length];
  }
}

/* ==========================================================================
   4. Streaming Retro Chat (Gemini Chat)
   ========================================================================== */

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export async function streamChatReply(
  history: ChatTurn[],
  userMessage: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const ai = getClient();
  if (!ai) {
    const lower = userMessage.toLowerCase();
    let reply =
      "Whoa, rad message! I'm running in offline 1995 mode right now (no API_KEY detected), so my neural nets are running on pure floppy-disk nostalgia. Add a Gemini API key to unlock full cloud superpowers!";
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      reply =
        'Hey there, cyber-surfer! Welcome to Gemini Chat 95! How is life on your freshly booted teal desktop?';
    } else if (lower.includes('doom')) {
      reply =
        'Doom II? Absolute classic! Just watch out for the Cacodemons—they look cute on the desktop icon until they lob plasma balls at you.';
    } else if (lower.includes('joke')) {
      reply =
        'Why did the Windows 95 computer cross the road? To get to the other side... right after defragmenting for 45 minutes!';
    } else if (lower.includes('1995') || lower.includes('90s')) {
      reply =
        '1995 was peak computing: beige towers, CRT hum, dial-up symphonies, and 16MB of RAM that felt infinite!';
    }
    const tokens = reply.match(/.{1,5}/gs) || [reply];
    for (const t of tokens) {
      if (signal?.aborted) return;
      onChunk(t);
      await new Promise((r) => setTimeout(r, 20));
    }
    return;
  }

  try {
    const contents = [
      ...history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config: {
        systemInstruction:
          'You are Gemini inside "Gemini 95", a nostalgic Windows 95 desktop chat client. Keep replies helpful, concise, friendly, and occasionally sprinkle light 1990s computing charm. Avoid heavy markdown formatting so it reads cleanly in a classic retro chat log.',
      },
    });

    for await (const chunk of stream) {
      if (signal?.aborted) return;
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch {
    if (signal?.aborted) return;
    onChunk('Modem hiccup! Could not reach Gemini servers right now—please try sending that again.');
  }
}

/* ==========================================================================
   5. Minesweeper Witty Hint (GemSweeper)
   ========================================================================== */

export async function getMinesweeperHint(
  boardSummary: string,
  localSuggestion: string
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return localSuggestion;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `You are a witty, playful 1995 Minesweeper coach inside Gemini 95.
Here is the current 9x9 Minesweeper board (rows 1-9, cols 1-9; '.' = hidden, 'F' = flagged, '0'-'8' = revealed count):
${boardSummary}

Quick mathematical check suggests: ${localSuggestion}

Give a punchy, funny 1-2 sentence hint (under 30 words) with helpful advice referencing specific row/col coordinates if relevant. No markdown.`,
    });
    return (response.text || '').trim() || localSuggestion;
  } catch {
    return localSuggestion;
  }
}
