import { GoogleGenAI } from '@google/genai';

declare const process: {
  env: {
    API_KEY?: string;
  };
};

interface Flashcard {
  term: string;
  definition: string;
}

const topicInput = document.getElementById('topicInput') as HTMLTextAreaElement | null;
const generateButton = document.getElementById('generateButton') as HTMLButtonElement | null;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement | null;
const flashcardsContainer = document.getElementById('flashcardsContainer') as HTMLDivElement | null;

function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function parseFlashcards(responseText: string): Flashcard[] {
  return responseText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const cleaned = line.replace(/^(?:[-*•]|\d+[.)])\s+/, '');
      const colonIndex = cleaned.indexOf(':');
      if (colonIndex <= 0) {
        return null;
      }

      const term = cleaned
        .slice(0, colonIndex)
        .replace(/^\*\*|\*\*$/g, '')
        .trim();
      const definition = cleaned
        .slice(colonIndex + 1)
        .replace(/^\*\*|\*\*$/g, '')
        .trim();

      if (!term || !definition) {
        return null;
      }

      return { term, definition };
    })
    .filter((card): card is Flashcard => card !== null);
}

function renderFlashcards(flashcards: Flashcard[]): void {
  if (!flashcardsContainer) return;

  flashcardsContainer.innerHTML = '';

  flashcards.forEach((cardData) => {
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Flashcard: ${cardData.term}. Click to flip.`);

    const inner = document.createElement('div');
    inner.className = 'flashcard-inner';

    const front = document.createElement('div');
    front.className = 'flashcard-front';
    const frontText = document.createElement('div');
    frontText.className = 'flashcard-text';
    frontText.textContent = cardData.term;
    front.appendChild(frontText);

    const back = document.createElement('div');
    back.className = 'flashcard-back';
    const backText = document.createElement('div');
    backText.className = 'flashcard-text';
    backText.textContent = cardData.definition;
    back.appendChild(backText);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    const toggleFlip = (): void => {
      const isFlipped = card.classList.toggle('flipped');
      card.setAttribute('aria-pressed', String(isFlipped));
    };

    card.addEventListener('click', toggleFlip);
    card.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFlip();
      }
    });

    flashcardsContainer.appendChild(card);
  });
}

async function handleGenerate(): Promise<void> {
  if (!topicInput || !generateButton || !errorMessage || !flashcardsContainer) {
    return;
  }

  const topic = topicInput.value.trim();
  if (!topic) {
    flashcardsContainer.innerHTML = '';
    errorMessage.textContent = 'Please enter a topic or some terms and definitions.';
    return;
  }

  flashcardsContainer.innerHTML = '';
  generateButton.disabled = true;
  errorMessage.textContent = 'Generating flashcards...';

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      errorMessage.textContent =
        'API key is missing. Please provide a Gemini API key to generate flashcards.';
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a list of flashcards for the topic or notes below. Each flashcard should have a concise term and a clear, concise definition. Format the output strictly as "Term: Definition", with one flashcard per line, and no numbering, bullet points, or extra text.\n\n${topic}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response?.text ?? '';
    if (!responseText.trim()) {
      errorMessage.textContent =
        'Failed to generate flashcards or received an empty response. Please try again.';
      return;
    }

    const flashcards = parseFlashcards(responseText);
    if (flashcards.length === 0) {
      errorMessage.textContent =
        'No valid flashcards could be parsed from the response. Please check the format or try again.';
      return;
    }

    errorMessage.textContent = '';
    renderFlashcards(flashcards);
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    errorMessage.textContent = `An error occurred while generating flashcards: ${details}`;
  } finally {
    generateButton.disabled = false;
  }
}

if (generateButton) {
  generateButton.addEventListener('click', () => {
    void handleGenerate();
  });
}

if (topicInput) {
  topicInput.addEventListener('keydown', (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !generateButton?.disabled) {
      event.preventDefault();
      void handleGenerate();
    }
  });
}
