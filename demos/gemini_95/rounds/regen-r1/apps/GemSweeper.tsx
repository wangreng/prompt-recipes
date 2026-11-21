import React, { useEffect, useState } from 'react';
import { SmileyIcon } from '../components/PixelIcons';
import { getMinesweeperHint } from '../services/geminiService';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacent: number;
  exploded?: boolean;
}

const NUM_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#606060',
};

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacent: 0,
    }))
  );
}

function getNeighbors(r: number, c: number): [number, number][] {
  const list: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        list.push([nr, nc]);
      }
    }
  }
  return list;
}

function populateMines(board: Cell[][], safeR: number, safeC: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if ((r === safeR && c === safeC) || next[r][c].isMine) continue;
    next[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].isMine) continue;
      let count = 0;
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (next[nr][nc].isMine) count++;
      }
      next[r][c].adjacent = count;
    }
  }
  return next;
}

function serializeBoard(board: Cell[][]): string {
  return board
    .map((row) =>
      row
        .map((c) => {
          if (c.isFlagged) return 'F';
          if (!c.isRevealed) return '#';
          if (c.isMine) return '*';
          return c.adjacent === 0 ? '.' : String(c.adjacent);
        })
        .join(' ')
    )
    .join('\n');
}

function analyzeBoardLocally(board: Cell[][], initialized: boolean): string {
  if (!initialized) {
    return 'Bold strategy: staring at a blank board! Click the center square (Row 5, Col 5) to open things up safely!';
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.isRevealed || cell.adjacent <= 0) continue;
      const nbrs = getNeighbors(r, c);
      const flagged = nbrs.filter(([nr, nc]) => board[nr][nc].isFlagged);
      const hidden = nbrs.filter(
        ([nr, nc]) => !board[nr][nc].isRevealed && !board[nr][nc].isFlagged
      );

      if (flagged.length === cell.adjacent && hidden.length > 0) {
        const [sr, sc] = hidden[0];
        return `Aha! Row ${r + 1}, Col ${c + 1} already has all its mines flagged—so Row ${sr + 1}, Col ${sc + 1} is 100% safe to click!`;
      }
      if (hidden.length > 0 && flagged.length + hidden.length === cell.adjacent) {
        const [mr, mc] = hidden[0];
        return `Psst! Look closely at Row ${r + 1}, Col ${c + 1}—Row ${mr + 1}, Col ${mc + 1} is practically screaming "I'M A MINE!" Right-click to flag it!`;
      }
    }
  }

  return "Hmm, tricky board! Try working the edges around your lowest revealed numbers—and maybe hold your breath just in case.";
}

function formatLed(val: number): string {
  const clamped = Math.max(-99, Math.min(999, val));
  if (clamped < 0) {
    return `-${String(Math.abs(clamped)).padStart(2, '0')}`;
  }
  return String(clamped).padStart(3, '0');
}

export const GemSweeper: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard());
  const [initialized, setInitialized] = useState<boolean>(false);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timer, setTimer] = useState<number>(0);
  const [isPressingTile, setIsPressingTile] = useState<boolean>(false);

  const [hintText, setHintText] = useState<string>(
    'Click any square to begin! Stuck? Hit "Hint" and Gemini will judge your strategy.'
  );
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);

  useEffect(() => {
    if (!initialized || status !== 'playing') return;
    const id = window.setInterval(() => {
      setTimer((t) => (t < 999 ? t + 1 : 999));
    }, 1000);
    return () => window.clearInterval(id);
  }, [initialized, status]);

  const flagsPlaced = board
    .flat()
    .filter((cell) => cell.isFlagged).length;
  const flagsRemaining = MINES - flagsPlaced;

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setInitialized(false);
    setStatus('playing');
    setTimer(0);
    setIsPressingTile(false);
    setHintText(
      'Fresh minefield! Left-click to sweep, right-click to drop a flag.'
    );
  };

  const revealCell = (r: number, c: number) => {
    if (status !== 'playing') return;

    let currentBoard = board;
    if (!initialized) {
      currentBoard = populateMines(board, r, c);
      setInitialized(true);
    }

    const target = currentBoard[r][c];
    if (target.isRevealed || target.isFlagged) return;

    const next = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

    if (next[r][c].isMine) {
      next[r][c].isRevealed = true;
      next[r][c].exploded = true;
      for (let rr = 0; rr < ROWS; rr++) {
        for (let cc = 0; cc < COLS; cc++) {
          if (next[rr][cc].isMine) {
            next[rr][cc].isRevealed = true;
          }
        }
      }
      setBoard(next);
      setStatus('lost');
      setHintText('KABOOM!! Click the smiley face to try again!');
      return;
    }

    // Flood fill reveal
    const queue: [number, number][] = [[r, c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      const cell = next[cr][cc];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;
      cell.isRevealed = true;
      if (cell.adjacent === 0) {
        for (const [nr, nc] of getNeighbors(cr, cc)) {
          if (!next[nr][nc].isRevealed && !next[nr][nc].isFlagged) {
            queue.push([nr, nc]);
          }
        }
      }
    }

    // Check victory
    let safeUnrevealed = 0;
    for (let rr = 0; rr < ROWS; rr++) {
      for (let cc = 0; cc < COLS; cc++) {
        if (!next[rr][cc].isMine && !next[rr][cc].isRevealed) {
          safeUnrevealed++;
        }
      }
    }

    if (safeUnrevealed === 0) {
      for (let rr = 0; rr < ROWS; rr++) {
        for (let cc = 0; cc < COLS; cc++) {
          if (next[rr][cc].isMine) {
            next[rr][cc].isFlagged = true;
          }
        }
      }
      setStatus('won');
      setHintText(
        `Flawless victory in ${timer}s! You're officially a 1995 Minesweeper legend!`
      );
    }

    setBoard(next);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'playing') return;
    const cell = board[r][c];
    if (cell.isRevealed) return;

    const next = board.map((row) => row.map((item) => ({ ...item })));
    next[r][c].isFlagged = !next[r][c].isFlagged;
    setBoard(next);
  };

  const handleHint = async () => {
    if (isLoadingHint) return;
    setIsLoadingHint(true);
    const localSuggestion = analyzeBoardLocally(board, initialized);
    try {
      const commentary = await getMinesweeperHint(
        serializeBoard(board),
        flagsRemaining,
        timer,
        status,
        localSuggestion
      );
      setHintText(commentary);
    } catch {
      setHintText(localSuggestion);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const smileyMood =
    status === 'lost'
      ? 'dead'
      : status === 'won'
      ? 'win'
      : isPressingTile
      ? 'tense'
      : 'happy';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '6px 8px',
        gap: 8,
        overflow: 'auto',
      }}
    >
      {/* Classic Raised Outer Frame */}
      <div
        className="win95-raised"
        style={{
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Top HUD: Flag Counter | Reactive Smiley | Timer Counter */}
        <div
          className="win95-sunken-gray"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px 8px',
          }}
        >
          <div className="minesweeper-led" title="Mines Remaining">
            {formatLed(flagsRemaining)}
          </div>

          <button
            type="button"
            className="win95-btn"
            onClick={resetGame}
            title="New Game"
            aria-label="Reset GemSweeper"
            style={{ width: 38, height: 38, padding: 0 }}
          >
            <SmileyIcon mood={smileyMood} size={26} />
          </button>

          <div className="minesweeper-led" title="Elapsed Time (Seconds)">
            {formatLed(timer)}
          </div>
        </div>

        {/* 9x9 Grid */}
        <div
          className="win95-sunken-gray"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 28px)`,
            gridTemplateRows: `repeat(${ROWS}, 28px)`,
            padding: 2,
          }}
          onMouseLeave={() => setIsPressingTile(false)}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const revealed = cell.isRevealed;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={`mine-tile ${
                    revealed ? 'mine-tile-revealed' : 'mine-tile-covered'
                  }`}
                  style={{
                    backgroundColor: cell.exploded ? '#ff2222' : undefined,
                    color:
                      revealed && cell.adjacent > 0
                        ? NUM_COLORS[cell.adjacent]
                        : '#000000',
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !revealed && status === 'playing') {
                      setIsPressingTile(true);
                    }
                  }}
                  onMouseUp={() => setIsPressingTile(false)}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  aria-label={`Row ${r + 1} Column ${c + 1}`}
                >
                  {cell.isFlagged && !revealed ? (
                    <span style={{ fontSize: 14 }}>🚩</span>
                  ) : revealed && cell.isMine ? (
                    <span style={{ fontSize: 15 }}>💣</span>
                  ) : revealed && cell.adjacent > 0 ? (
                    cell.adjacent
                  ) : (
                    ''
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Gemini Hint Button & Playful Comic Sans Commentary Box */}
      <div
        style={{
          width: '100%',
          maxWidth: 282,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <button
          type="button"
          className="win95-btn"
          onClick={handleHint}
          disabled={isLoadingHint}
          style={{ width: '100%', fontWeight: 700, padding: '5px 10px' }}
        >
          💡 {isLoadingHint ? 'Gemini is inspecting board...' : 'Hint'}
        </button>

        <div
          className="win95-sunken font-quip-95"
          style={{
            backgroundColor: '#ffffcc',
            padding: '7px 9px',
            fontSize: 12.5,
            lineHeight: 1.35,
            color: '#111111',
            minHeight: 54,
            fontFamily: 'var(--font-quip)',
          }}
        >
          {hintText}
        </div>
      </div>
    </div>
  );
};
