import { GoogleGenAI } from '@google/genai';

declare const process: { env: { API_KEY?: string } };

interface Flashcard {
  term: string;
  definition: string;
}

const topicInput = document.getElementById('topicInput') as HTMLTextAreaElement;
const generateButton = document.getElementById('generateButton') as HTMLButtonElement;
const flashcardsContainer = document.getElementById('flashcardsContainer') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function parseFlashcards(rawText: string): Flashcard[] {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      // Strip optional bullet/number prefixes or surrounding markdown emphasis if present
      const cleaned = line
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+[.)]\s+/, '')
        .replace(/\*\*/g, '');

      const colonIndex = cleaned.indexOf(':');
      if (colonIndex === -1) {
        return null;
      }

      const term = cleaned.slice(0, colonIndex).trim();
      const definition = cleaned.slice(colonIndex + 1).trim();

      if (!term || !definition) {
        return null;
      }

      return { term, definition };
    })
    .filter((card): card is Flashcard => card !== null);
}

function createFlashcardElement(card: Flashcard): HTMLButtonElement {
  const cardEl = document.createElement('button');
  cardEl.type = 'button';
  cardEl.className = 'flashcard';
  cardEl.setAttribute('aria-pressed', 'false');
  cardEl.setAttribute('aria-label', `Flashcard: ${card.term}. Click to flip.`);

  const innerEl = document.createElement('div');
  innerEl.className = 'flashcard-inner';

  const frontEl = document.createElement('div');
  frontEl.className = 'flashcard-front';
  const termEl = document.createElement('div');
  termEl.className = 'flashcard-term';
  termEl.textContent = card.term;
  frontEl.appendChild(termEl);

  const backEl = document.createElement('div');
  backEl.className = 'flashcard-back';
  const definitionEl = document.createElement('div');
  definitionEl.className = 'flashcard-definition';
  definitionEl.textContent = card.definition;
  backEl.appendChild(definitionEl);

  innerEl.appendChild(frontEl);
  innerEl.appendChild(backEl);
  cardEl.appendChild(innerEl);

  cardEl.addEventListener('click', () => {
    const isFlipped = cardEl.classList.toggle('flipped');
    cardEl.setAttribute('aria-pressed', String(isFlipped));
  });

  return cardEl;
}

generateButton.addEventListener('click', async () => {
  const topic = topicInput.value.trim();

  if (!topic) {
    flashcardsContainer.textContent = '';
    errorMessage.textContent = 'Please enter a topic or some terms and definitions.';
    return;
  }

  flashcardsContainer.textContent = '';
  generateButton.disabled = true;
  errorMessage.textContent = 'Generating flashcards...';

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a list of flashcards for the following topic or input: "${topic}".
Each flashcard should have a concise term and a concise definition.
Format the output strictly as "Term: Definition" pairs, with one pair per line.
Do not include numbering, bullet points, markdown formatting, or extra commentary.
Example:
Hello: Hola
Goodbye: Adiós`;

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
        'No valid flashcards could be parsed from the response. Please check the format or try another topic.';
      return;
    }

    errorMessage.textContent = '';
    const fragment = document.createDocumentFragment();
    for (const card of flashcards) {
      fragment.appendChild(createFlashcardElement(card));
    }
    flashcardsContainer.appendChild(fragment);
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error);
    const details = error instanceof Error ? error.message : 'An unknown error occurred.';
    errorMessage.textContent = `An error occurred: ${details}`;
  } finally {
    generateButton.disabled = false;
  }
});
