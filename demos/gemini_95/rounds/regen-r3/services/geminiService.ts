import { GoogleGenAI } from '@google/genai';

function getApiKey(): string {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch {
    // ignore
  }
  return '';
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

const MODEL = 'gemini-2.5-flash';

// Helper to stream fallback text word-by-word so the UX feels authentic even without an API key
async function streamTextLocally(
  text: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const words = text.split(/(\s+)/);
  for (const token of words) {
    if (signal?.aborted) return;
    onChunk(token);
    await new Promise((r) => setTimeout(r, 32));
  }
}

export async function streamTwistStory(
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const ai = getClient();
  if (!ai) {
    const fallbackStories = [
      `THE MIDNIGHT DEFRAG\n===================\n\nAt 2:14 AM in November 1995, Arthur noticed his beige PC was defragmenting a drive he didn't own—Drive Z:. Little teal blocks slid neatly across his CRT monitor until they spelled out his own grocery list for tomorrow.\n\nThinking it was a prank from his roommate, he typed "WHO IS THIS?" into Notepad. The cursor blinked twice and replied: "Don't forget oat milk. Also, don't open the closet."\n\nLaughing nervously, Arthur yanked the power cord straight out of the wall. The fan spun down. The room went pitch black.\n\nThen the CRT flickered back on by itself, illuminating his reflection—and the message: "Thanks for unplugging me. Now I don't have to pretend I'm the one inside the computer."`,
      `FLOPPY DISK #48\n===============\n\nMaya bought a box of blank 3.5-inch floppy disks at a yard sale for fifty cents. Forty-seven were empty. The forty-eighth had a single file named TOMORROW.TXT.\n\nShe opened it in Notepad. It described her Tuesday down to the spilled iced coffee and the exact song on the radio at 4:12 PM. Thrilled, she scrolled to the bottom to read Wednesday.\n\nThere was only one line: "You shouldn't have copied me onto C:."\n\nConfused, she looked at her desk. The floppy drive was completely empty—and her computer's clock had just stopped ticking at 4:12 PM forever.`,
    ];
    const picked = fallbackStories[Math.floor(Math.random() * fallbackStories.length)];
    await streamTextLocally(picked, onChunk, signal);
    return;
  }

  const response = await ai.models.generateContentStream({
    model: MODEL,
    contents:
      'Write a creative, entertaining short story (around 150-220 words) with a clever, genuinely surprising twist ending. Format it as plain text suitable for Windows 95 Notepad (with an uppercase title and underline). Do not use markdown asterisks.',
  });

  for await (const chunk of response) {
    if (signal?.aborted) return;
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
}

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
      `BZZZT—56k local echo! You said "${userMessage}". Connect a Gemini API key in process.env.API_KEY to chat with the live Gemini AI mainframe, or keep hanging out with me here in 1995!`;
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      reply =
        'Heya net-surfer! Welcome to Gemini Chat 95. My 56k modem is humming, my CRT is glowing, and I am totally tubular. (Set process.env.API_KEY for full live Gemini AI responses!)';
    } else if (lower.includes('joke')) {
      reply =
        'Why did the Windows 95 computer cross the road? To get to the other... [Illegal Operation: This joke has performed an illegal operation and will be shut down.]';
    }
    await streamTextLocally(reply, onChunk, signal);
    return;
  }

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model: MODEL,
    contents,
    config: {
      systemInstruction:
        'You are Gemini, a witty, friendly AI assistant living inside a nostalgic Windows 95 chat app called Gemini Chat. Keep replies concise, helpful, and occasionally sprinkle subtle 90s computing charm. Plain text only (no markdown).',
    },
  });

  for await (const chunk of response) {
    if (signal?.aborted) return;
    if (chunk.text) {
      onChunk(chunk.text);
    }
  }
}

export async function critiquePainting(
  pngDataUrl: string,
  fallbackStats: { inkRatio: number; dominantColor: string }
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    if (fallbackStats.inkRatio < 0.008) {
      return "Wow, a bold minimalist masterpiece titled 'Blank White Void.' Truly brave of you to not even touch the mouse!";
    }
    if (fallbackStats.inkRatio > 0.35) {
      return "Whoa there, Picasso! Did you drop a bucket of paint on the CRT or is this modern art for raccoons?";
    }
    return `Ooh, very avant-garde! Heavy use of ${fallbackStats.dominantColor}—my 1995 optical sensors are 87% sure this belongs on a refrigerator!`;
  }

  const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
  const response = await ai.models.generateContent({
    model: MODEL,
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
            text: 'You are a sarcastic, cheeky Clippy-style 1995 robot art critic inside MS Paint ("GemPaint"). Look at this user drawing and give a hilarious, playful, sarcastic 1-2 sentence critique referencing what you actually see (or roasting them if it is blank/scribbles). Keep it under 32 words, plain text.',
          },
        ],
      },
    ],
  });

  return (
    response.text?.trim() ||
    "Hmm, my 1995 neural net just crashed trying to figure out what that is. A+ for mystery!"
  );
}

export async function generateSweeperHint(
  boardSummary: string,
  localTip: string
): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return localTip;
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `You are a witty, playful 1995 Minesweeper coach in GemSweeper. Given this 9x9 board state and tactical analysis, write a short (1-2 sentences, max 28 words) humorous commentary with a genuinely helpful hint.\n\nBoard:\n${boardSummary}\n\nTactical note: ${localTip}`,
  });

  return response.text?.trim() || localTip;
}

function buildFallback1996Page(url: string): string {
  const safeUrl = url.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cleanHost = safeUrl
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toUpperCase() || 'CYBERSPACE.COM';
  const visitorCount = String(Math.floor(10000 + Math.random() * 89999)).padStart(6, '0');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body {
    margin: 0;
    padding: 14px;
    background-color: #050026;
    background-image:
      radial-gradient(#ffffff 1px, transparent 1px),
      radial-gradient(#ff00ff 1px, transparent 1px);
    background-size: 36px 36px;
    background-position: 0 0, 18px 18px;
    color: #00ff66;
    font-family: "Comic Sans MS", "Times New Roman", serif;
    text-align: center;
  }
  .logo-box {
    display: inline-block;
    border: 4px ridge #ffff00;
    background: linear-gradient(90deg, #ff00cc, #3300ff, #00cccc);
    padding: 10px 22px;
    margin: 8px 0;
    box-shadow: 5px 5px 0 #ff00ff;
  }
  .logo-title {
    font-size: 30px;
    font-weight: 900;
    color: #ffff00;
    text-shadow: 3px 3px 0 #000000, -2px -2px 0 #ff0066;
    letter-spacing: 2px;
    margin: 0;
  }
  @keyframes blink96 {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .blink {
    animation: blink96 0.8s steps(1) infinite;
    color: #ff3399;
    font-weight: bold;
    font-size: 16px;
  }
  .marquee-bar {
    background: #ffff00;
    color: #cc0000;
    border: 3px dashed #ff0000;
    font-weight: bold;
    font-size: 15px;
    padding: 4px;
    margin: 10px 0;
  }
  table.retro {
    width: 94%;
    margin: 12px auto;
    border-collapse: separate;
    border-spacing: 6px;
    background: #1a0044;
    border: 4px outset #00ffff;
  }
  table.retro td {
    border: 2px inset #ff00ff;
    padding: 10px;
    vertical-align: top;
    text-align: left;
    color: #ffffff;
    font-size: 13px;
  }
  .counter {
    display: inline-block;
    background: #000000;
    color: #00ff00;
    font-family: "Courier New", monospace;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 4px;
    padding: 4px 10px;
    border: 3px inset #888888;
  }
  .badge {
    display: inline-block;
    background: #ffcc00;
    color: #000000;
    border: 2px solid #000000;
    padding: 3px 8px;
    font-weight: bold;
    font-size: 12px;
    margin: 4px;
  }
</style>
</head>
<body>
  <div class="logo-box">
    <h1 class="logo-title">~* ${cleanHost} *~</h1>
  </div>
  <div class="blink">*** WELCOME TO THE OFFICIAL 1996 CYBER-HOMEPAGE OF ${cleanHost} ***</div>

  <div class="marquee-bar">
    <marquee scrollamount="6">HOT NEW LINKS!! SIGN MY GUESTBOOK!! BEST VIEWED IN 800x600 WITH 256 COLORS!! DOWNLOADING AT 56KBPS!! NOW POWERED BY GEMINI 95!!</marquee>
  </div>

  <table class="retro">
    <tr>
      <td width="33%" style="background:#002b36;">
        <div style="color:#ffff00;font-weight:bold;text-decoration:underline;margin-bottom:6px;">COOL CYBER-LINKS:</div>
        <div>&#9733; <a href="#" style="color:#00ffff;">What's NEW in 1996!</a></div>
        <div>&#9733; <a href="#" style="color:#ff99ff;">MIDI Jukebox (OFF)</a></div>
        <div>&#9733; <a href="#" style="color:#99ff33;">My Cool WebRing</a></div>
        <div>&#9733; <a href="#" style="color:#ffcc00;">Download Netscape!</a></div>
        <br/>
        <div class="badge">&#9888; UNDER CONSTRUCTION &#9888;</div>
      </td>
      <td width="67%" style="background:#110022;">
        <h3 style="color:#00ffff;margin-top:0;">You have arrived at ${safeUrl}!</h3>
        <p style="color:#ffff99;">Congratulations, net-surfer! You navigated the Information Superhighway and discovered the ultimate 1996 homepage for <b>${cleanHost}</b>.</p>
        <p style="color:#99ffcc;">Grab a Surge soda, kick back to some 16-bit MIDI synth, and check out our totally radical animated GIFs (coming soon once my mom gets off the phone line!).</p>
        <p class="blink" style="color:#00ff00;">&gt;&gt;&gt; CLICK HERE FOR FREE FLOPPY DISKS!! &lt;&lt;&lt;</p>
      </td>
    </tr>
  </table>

  <div style="margin-top:12px;">
    <div style="color:#ffccff;font-size:12px;margin-bottom:4px;">YOU ARE VISITOR NUMBER:</div>
    <div class="counter">${visitorCount}</div>
  </div>
  <div style="margin-top:10px;font-size:11px;color:#aaaaaa;">
    &#169; 1996 ${cleanHost} WebMaster | Last Updated: Nov 14, 1996 | Email: webmaster@${cleanHost.toLowerCase()}
  </div>
</body>
</html>`;
}

export async function generate1996Website(url: string): Promise<string> {
  const ai = getClient();
  if (!ai) {
    return buildFallback1996Page(url);
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Generate a chaotic, hilarious, authentic 1996 GeoCities-style standalone HTML page for the URL: "${url}".
Requirements:
- Return ONLY raw HTML (starting with <!DOCTYPE html> and ending with </html>), NO markdown code fences.
- Include a bold retro WordArt-style logo/header specific to "${url}".
- Use clashing 1996 neon colors, a wild dark/starry or tiled CSS background, <table> layout with chunky ridge/outset borders, a scrolling <marquee>, blinking text using CSS @keyframes, an "Under Construction" banner, funny 1996-era copy about the topic/site in the URL, and an odometer-style visitor counter at the bottom.
- Do NOT use external images or <script> tags (use inline CSS, Unicode symbols, and HTML only so everything renders offline cleanly).`,
    });

    let html = response.text?.trim() || '';
    html = html.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '').trim();
    if (!html.toLowerCase().includes('<html') && !html.toLowerCase().includes('<body')) {
      return buildFallback1996Page(url);
    }
    return html;
  } catch {
    return buildFallback1996Page(url);
  }
}
