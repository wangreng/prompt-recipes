import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';

declare const process: {
  env: {
    API_KEY?: string;
  };
};

interface FlashcardItem {
  id: number;
  term: string;
  definition: string;
}

function getApiKey(): string {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
}

function cleanText(value: string): string {
  return value
    .trim()
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/^[-*•]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .trim();
}

function parseFlashcards(rawText: string): FlashcardItem[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const cards: FlashcardItem[] = [];
  let nextId = 1;

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) {
      continue;
    }

    const term = cleanText(line.slice(0, colonIndex));
    const definition = cleanText(line.slice(colonIndex + 1));

    if (term.length > 0 && definition.length > 0) {
      cards.push({ id: nextId++, term, definition });
    }
  }

  return cards;
}

function Flashcard({ item }: { item: FlashcardItem }) {
  const [flipped, setFlipped] = useState(false);

  const handleToggle = () => {
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={`flashcard${flipped ? ' flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? `Definition: ${item.definition}` : `Term: ${item.term}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <div className="flashcard-inner">
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-text">{item.term}</span>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-text">{item.definition}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [input, setInput] = useState('');
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setFlashcards([]);
      setStatusMessage('Please enter a topic or some terms and definitions.');
      return;
    }

    setFlashcards([]);
    setIsLoading(true);
    setStatusMessage('Generating flashcards...');

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setStatusMessage('API key is not configured. Unable to contact the Gemini API.');
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate a list of concise flashcards based on the following input.
Format each flashcard strictly as "Term: Definition" with one pair per line.
Do not include numbering, bullet points, markdown formatting, or any introductory or concluding text.
If the input is a topic, generate 6 to 10 key flashcards covering the topic.
If the input is already a list of terms and definitions, format or refine each one cleanly as "Term: Definition" (one per line).

Input:
${trimmedInput}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response?.text?.trim() ?? '';

      if (!responseText) {
        setStatusMessage('Failed to generate flashcards or received an empty response. Please try again.');
        return;
      }

      const parsedCards = parseFlashcards(responseText);

      if (parsedCards.length === 0) {
        setStatusMessage('No valid flashcards could be generated. Please try rephrasing your input.');
        return;
      }

      setFlashcards(parsedCards);
      setStatusMessage('');
    } catch (error) {
      const detail = error instanceof Error && error.message ? ` (${error.message})` : '';
      setStatusMessage(`An error occurred while generating flashcards${detail}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="container" aria-label="Flashcard Generator">
        <h1 className="heading">Flashcard Generator</h1>
        <p className="subtitle">
          Enter a topic or a list of terms and definitions to generate flashcards using the Gemini API.
        </p>

        <textarea
          className="topic-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter topic (e.g., Ancient Rome) or 'Term: Definition' pairs (one per line)"
          aria-label="Topic or Term and Definition pairs"
          rows={5}
        />

        <button
          type="button"
          className="generate-button"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          Generate Flashcards
        </button>

        <div className="status-message" role="status" aria-live="polite">
          {statusMessage}
        </div>

        <div className="flashcards-grid" aria-label="Generated flashcards">
          {flashcards.map((item) => (
            <Flashcard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
