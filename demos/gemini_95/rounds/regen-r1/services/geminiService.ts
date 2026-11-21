import { GoogleGenAI } from '@google/genai';

function getApiKey(): string {
  try {
    // Direct reference so static bundler defines (process.env.API_KEY) work reliably
    const key = process.env.API_KEY;
    return typeof key === 'string' ? key.trim() : '';
  } catch {
    return '';
  }
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// ============================================================================
// 1. GemNotes: Streaming Twist-Ending Story
// ============================================================================

const OFFLINE_TWIST_STORIES = [
  `THE FLOPPY DISK IN DRAWER 4

At 11:47 PM, Maya finally booted her grandfather's beige 1995 desktop. On the desk sat a single unlabeled 3.5-inch floppy disk taped with masking tape: "DO NOT FORMAT."

She slid it into Drive A:. The drive groaned, clicked twice, and opened a single Notepad file dated August 24, 1995.

Inside was a list of dates and events:
- 09/14/1995: Maya breaks her left wrist falling off the red tricycle.
- 06/02/2008: Maya forgets her locker combination (14-28-09).
- 11/21/2026: Maya finds this disk at 11:47 PM.

Her heart hammered. Below the last line, the blinking cursor suddenly moved on its own.

New letters tapped across the phosphor screen, one by one:

"Hello Maya. Don't panic. I'm not from the future. Turn around—your webcam light has been on since 1995, and you forgot to check what's behind the monitor."

Slowly, Maya leaned over the chunky CRT. Taped to the back was a sticky note in her own adult handwriting:

"Nice try, past-me. Stop pranking yourself with auto-typing macros every time you get nostalgic."`,

  `THE 56K PEN PAL

In 1996, Leo met "StarGazer96" in a late-night dial-up chatroom. They talked every Tuesday at midnight until his family moved and disconnected the landline.

Thirty years later, cleaning out the attic, Leo plugged in his old beige tower just to hear the startup chime. Somehow, without a phone cable plugged into the wall, the modem lights blinked green.

The chat window popped open.

StarGazer96: "You're 30 years late, Leo. I've been waiting in RAM."
Leo: "Wait... how are you online? The modem isn't even plugged in!"
StarGazer96: "Of course not. Your mom never turned off the UPS battery backup in the closet—and I was your unfinished ELIZA homework script from 10th grade. By the way, you got a B+."`,
];

export async function streamTwistStory(
  seedText: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<{ usedFallback: boolean }> {
  const ai = getClient();
  if (!ai) {
    const story =
      OFFLINE_TWIST_STORIES[Math.floor(Math.random() * OFFLINE_TWIST_STORIES.length)];
    const words = story.split(/(\s+)/);
    for (const token of words) {
      if (signal?.aborted) break;
      onChunk(token);
      await new Promise((r) => setTimeout(r, 26));
    }
    return { usedFallback: true };
  }

  const prompt = seedText.trim()
    ? `Continue and complete this into a short, clever story (around 160-220 words) with an unexpected twist ending. Output plain text only (no markdown headings or bold asterisks):\n\n${seedText.trim()}`
    : `Write a short, engaging, clever story (around 160-220 words) with an unforgettable twist ending. Give it a subtle 1990s nostalgia vibe. Output plain text only (no markdown symbols or asterisks).`;

  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  for await (const chunk of stream) {
    if (signal?.aborted) break;
    const text = chunk.text;
    if (text) onChunk(text);
  }

  return { usedFallback: false };
}

// ============================================================================
// 2. Gemini Chat: Streaming Retro Chat
// ============================================================================

export interface ChatTurn {
  sender: 'user' | 'ai';
  text: string;
}

export async function streamChatReply(
  history: ChatTurn[],
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<{ usedFallback: boolean }> {
  const ai = getClient();
  if (!ai) {
    const reply = `Hey! You're chatting in offline demo mode because no Gemini API key (process.env.API_KEY) is configured right now. You said: "${userMessage}" — once an API key is provided, I'll stream live answers straight from Gemini over this 56kbps virtual modem!`;
    const tokens = reply.split(/(\s+)/);
    for (const token of tokens) {
      onChunk(token);
      await new Promise((r) => setTimeout(r, 22));
    }
    return { usedFallback: true };
  }

  const contents = [
    ...history.slice(-12).map((turn) => ({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction:
        'You are Gemini Chat 95, a friendly, witty AI assistant living inside a nostalgic Windows 95 desktop. Keep replies concise, helpful, and conversational in plain text (avoid heavy markdown formatting so it looks authentic in a 90s chat window).',
    },
  });

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) onChunk(text);
  }

  return { usedFallback: false };
}

// ============================================================================
// 3. GemPaint: Clippy Vision Art Critique
// ============================================================================

const OFFLINE_CRITIQUES = [
  "It looks like you're trying to draw! Would you like me to pretend this belongs on a refrigerator?",
  "Bold choice using the mouse like a caffeinated squirrel. Picasso is trembling in his boots!",
  "Ah yes, 'Untitled Masterpiece #404' — minimal effort, maximum chaos. Truly avant-garde!",
  "I ran 10 billion neural parameters on this canvas and concluded: it's definitely... shapes!",
  "Is that a modern art statement on the fragility of 1995 mouse ball tracking, or did you sneeze?",
  "Wow, museum curators are calling! Mostly to ask me to stop sending them your doodles.",
];

export async function critiquePainting(
  canvasDataUrl: string,
  strokeCount: number
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    if (strokeCount === 0) {
      return "A completely blank white canvas! Either it's minimalist genius or you haven't clicked yet.";
    }
    return OFFLINE_CRITIQUES[Math.floor(Math.random() * OFFLINE_CRITIQUES.length)];
  }

  const base64Data = canvasDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data,
            },
          },
          {
            text: "You are a witty, playfully sarcastic Clippy-style 1995 robot art critic watching someone draw in MS Paint. Look closely at what they actually drew on this canvas and deliver a short, hilarious 1-2 sentence critique (under 28 words) referencing specific shapes, colors, or emptiness you see. No markdown.",
          },
        ],
      },
    ],
  });

  return (
    response.text?.trim() ||
    "Truly a triumph of pixels over good judgment! Keep going, Da Vinci!"
  );
}

// ============================================================================
// 4. GemSweeper: Witty Board Commentary & Hint
// ============================================================================

export async function getMinesweeperHint(
  boardText: string,
  flagsLeft: number,
  elapsedSec: number,
  status: 'playing' | 'won' | 'lost',
  localSuggestion: string
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    if (status === 'won') {
      return `Boom-free victory in ${elapsedSec}s! Honestly, I didn't think your 90s mouse skills had it in you.`;
    }
    if (status === 'lost') {
      return `KABOOM! Well, on the bright side, you definitely found a mine. Click the smiley face to pretend that never happened!`;
    }
    return localSuggestion;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are a cheeky, nostalgic 1995 Minesweeper coach in GemSweeper (9x9 grid, rows 1-9 top-to-bottom, cols 1-9 left-to-right).
Game status: ${status}. Flags remaining: ${flagsLeft}. Time: ${elapsedSec}s.
Legend: '#' = hidden cell, 'F' = flagged, '.' = revealed empty, '1'-'8' = revealed neighbor count, '*' = mine.
Current board:
${boardText}

Logical note from board analyzer: ${localSuggestion}

Give a short, witty, playful 1-2 sentence board commentary and practical hint (under 35 words). Plain text only, no markdown.`,
  });

  return response.text?.trim() || localSuggestion;
}

// ============================================================================
// 5. Chrome: 1996 Chaotic Webpage + Custom Retro Logo Image Generator
// ============================================================================

function makeRetroLogoSvgDataUrl(siteLabel: string): string {
  const clean = siteLabel
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .slice(0, 22)
    .toUpperCase() || 'CYBERSPACE 96';

  const escaped = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="104" viewBox="0 0 420 104">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#000044"/>
        <stop offset="50%" stop-color="#330066"/>
        <stop offset="100%" stop-color="#003366"/>
      </linearGradient>
      <linearGradient id="txt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffff00"/>
        <stop offset="50%" stop-color="#ff00ff"/>
        <stop offset="100%" stop-color="#00ffff"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="416" height="100" fill="url(#bg)" stroke="#00ff00" stroke-width="4"/>
    <rect x="8" y="8" width="404" height="88" fill="none" stroke="#ff00ff" stroke-width="2" stroke-dasharray="6 4"/>
    <circle cx="34" cy="28" r="3" fill="#ffff00"/>
    <circle cx="386" cy="24" r="3" fill="#00ffff"/>
    <circle cx="52" cy="78" r="2" fill="#ffffff"/>
    <circle cx="364" cy="80" r="3" fill="#ff00ff"/>
    <polygon points="32,54 38,42 44,54 56,56 44,60 38,72 32,60 20,56" fill="#ffff00"/>
    <polygon points="382,50 387,40 392,50 402,52 392,56 387,66 382,56 372,52" fill="#00ff00"/>
    <text x="213" y="61" text-anchor="middle" font-family="Impact, Times New Roman, serif" font-size="30" font-weight="900" fill="#000000">${escaped}</text>
    <text x="210" y="58" text-anchor="middle" font-family="Impact, Times New Roman, serif" font-size="30" font-weight="900" fill="url(#txt)" stroke="#ffffff" stroke-width="0.8">${escaped}</text>
    <text x="210" y="84" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold" fill="#00ff00">*** OFFICIAL 1996 CYBER-PORTAL ***</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function generateRetroLogoImage(url: string): Promise<string> {
  const fallback = makeRetroLogoSvgDataUrl(url);
  const ai = getClient();
  if (!ai) return fallback;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Create a wacky, nostalgic 1996 retro web banner logo image for the website "${url}". Bold 90s WordArt chrome lettering, pixelated sparkles, neon magenta/cyan/yellow colors, dark starry GeoCities cyberspace background. Wide horizontal banner style.`,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        return `data:${mime};base64,${part.inlineData.data}`;
      }
    }
  } catch {
    // Fallback to deterministic retro SVG logo
  }

  return fallback;
}

function buildFallback1996Page(url: string, logoDataUrl: string): string {
  const safeUrl = url.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const domain = safeUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'www.cyberspace96.net';
  const visitorCount = String(Math.floor(10420 + (url.length * 7919) % 88000)).padStart(6, '0');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    margin: 0;
    padding: 14px;
    background-color: #000033;
    background-image:
      radial-gradient(#ffffff 1px, transparent 0),
      radial-gradient(#00ffff 1px, transparent 0);
    background-size: 40px 40px, 65px 65px;
    background-position: 0 0, 20px 25px;
    color: #00ff00;
    font-family: "Times New Roman", Times, serif;
    text-align: center;
  }
  .blink {
    animation: blinker 0.7s step-start infinite;
  }
  @keyframes blinker {
    50% { opacity: 0; }
  }
  .rainbow-bar {
    height: 6px;
    background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
    margin: 12px 0;
  }
  .box {
    border: 4px ridge #ff00ff;
    background: #110022;
    padding: 12px;
    margin: 12px auto;
    max-width: 620px;
  }
  .counter {
    display: inline-block;
    background: #000;
    border: 3px inset #c0c0c0;
    color: #ff2200;
    font-family: "Courier New", monospace;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 4px;
    padding: 4px 10px;
  }
  table.retro {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  table.retro td {
    border: 2px dashed #00ffff;
    padding: 8px;
    vertical-align: top;
    color: #ffff99;
    font-size: 14px;
  }
  a { color: #00ffff; font-weight: bold; }
  a:visited { color: #ff66ff; }
</style>
</head>
<body>
  <marquee behavior="alternate" scrollamount="7" style="background:#ffff00;color:#ff0000;font-weight:bold;padding:4px;border:2px solid #00ff00;font-family:'Comic Sans MS',cursive;">
    ★☆★ WELCOME TO ${domain.toUpperCase()} ON THE INFORMATION SUPERHIGHWAY!! BEST VIEWED AT 800x600 IN 256 COLORS!! ★☆★
  </marquee>

  <div style="margin:14px 0;">
    <img src="${logoDataUrl}" alt="Retro Logo" style="max-width:92%;height:auto;border:3px outset #c0c0c0;" />
  </div>

  <p class="blink" style="color:#ff00ff;font-size:20px;font-weight:bold;margin:8px 0;">
    🚧 UNDER CONSTRUCTION!! NEW MIDI MUSIC COMING SOON!! 🚧
  </p>

  <div class="rainbow-bar"></div>

  <div class="box">
    <h2 style="color:#00ffff;margin:0 0 8px 0;font-family:'Comic Sans MS',cursive;">
      Welcome Cyber-Surfer to ${safeUrl}!!
    </h2>
    <p style="color:#ffffff;font-size:15px;line-height:1.45;">
      You have successfully dialed into the hottest 1996 homepage for <b style="color:#ffff00;">${domain}</b>!
      Grab a Surge soda, tell your mom to get off the kitchen phone, and surf our totally rad links below!
    </p>
    <table class="retro">
      <tr>
        <td style="width:50%;text-align:left;">
          <b style="color:#ff00ff;">🔥 HOT LINKS OF 1996:</b>
          <ul style="margin:6px 0;padding-left:18px;">
            <li><a href="#top">Download Free Animated Flame GIFs!</a></li>
            <li><a href="#top">My Top 10 Beanie Babies Shrine</a></li>
            <li><a href="#top">Secret Doom II Cheat Codes (IDDQD!)</a></li>
            <li><a href="#top">Sign My Guestbook Plz!!</a></li>
          </ul>
        </td>
        <td style="width:50%;text-align:left;">
          <b style="color:#00ff00;">📢 WEBMASTER UPDATES:</b>
          <p style="margin:6px 0;">
            <b>Aug 19, 1996:</b> Added 14 new neon horizontal rules and a dancing baby!<br/><br/>
            <b>Aug 12, 1996:</b> Upgraded server to a blazing Pentium 133MHz with 16MB RAM!!
          </p>
        </td>
      </tr>
    </table>
  </div>

  <div class="rainbow-bar"></div>

  <div style="margin:12px 0;">
    <div style="color:#ffff00;font-size:13px;margin-bottom:4px;">YOU ARE CYBER-VISITOR NUMBER:</div>
    <div class="counter">${visitorCount}</div>
  </div>

  <p style="font-size:12px;color:#cccccc;">
    [ &lt;&lt; Prev Site | <b style="color:#00ffff;">THE 1996 GEMINI WEBRING</b> | Random | Next Site &gt;&gt; ]<br/>
    Email the Webmaster at <a href="mailto:webmaster@gemini95.net">webmaster@gemini95.net</a> • Made with GemNotes!
  </p>
</body>
</html>`;
}

export async function generate1996Webpage(url: string): Promise<string> {
  const logoDataUrl = await generateRetroLogoImage(url);
  const ai = getClient();

  if (!ai) {
    return buildFallback1996Page(url, logoDataUrl);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a complete, standalone, chaotic, hilarious 1996 GeoCities-style HTML webpage for the URL or search query: "${url}".

Requirements:
1. Return ONLY raw HTML (starting with <!DOCTYPE html> and ending with </html>), NO markdown code fences.
2. Include an <img src="__RETRO_LOGO__" alt="Site Logo" style="max-width:90%;border:3px outset #c0c0c0;" /> tag prominently near the top so our custom retro logo image is displayed.
3. Use chaotic authentic 1996 styling: dark starry or tiled neon background, clashing neon colors (#00ff00, #ff00ff, #00ffff, #ffff00), Comic Sans / Times New Roman / Courier New fonts, an animated <marquee> banner, CSS blinking text (@keyframes blink), retro HTML tables with dashed/ridged borders, "Under Construction" badge, funny 1996 content tailored specifically to "${url}", a fake WebRing footer, and a prominent retro digital visitor counter (e.g. "048291").
4. Do NOT use external image URLs or external scripts (inline CSS only, and use __RETRO_LOGO__ for the logo image). Make all links harmless (#top).`,
    });

    let html = (response.text || '').trim();
    // Strip markdown code fences if the model wrapped the HTML
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    if (!html || !html.toLowerCase().includes('<body')) {
      return buildFallback1996Page(url, logoDataUrl);
    }

    if (html.includes('__RETRO_LOGO__')) {
      html = html.replace(/__RETRO_LOGO__/g, logoDataUrl);
    } else {
      // Inject logo right after <body> if the model omitted the placeholder
      html = html.replace(
        /<body([^>]*)>/i,
        `<body$1><div style="text-align:center;margin:10px 0;"><img src="${logoDataUrl}" alt="Retro Logo" style="max-width:90%;height:auto;border:3px outset #c0c0c0;" /></div>`
      );
    }

    return html;
  } catch {
    return buildFallback1996Page(url, logoDataUrl);
  }
}
