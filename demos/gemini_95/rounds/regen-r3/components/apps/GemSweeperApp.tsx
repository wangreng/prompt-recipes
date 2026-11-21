import React, { useEffect, useState } from 'react';
import { generateSweeperHint } from '../../services/geminiService';
import { PixelFlagIcon, PixelMineIcon } from '../PixelIcons';

const SIZE = 9;
const MINE_COUNT = 10;

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacent: number;
  exploded?: boolean;
}

type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

const NUM_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => ({
      row,
      col,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacent: 0,
    }))
  );
}

function getNeighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        out.push([nr, nc]);
      }
    }
  }
  return out;
}

function populateMines(safeRow: number, safeCol: number): Cell[][] {
  const board = createEmptyBoard();
  const candidates: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
      candidates.push([r, c]);
    }
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  for (let m = 0; m < MINE_COUNT && m < candidates.length; m++) {
    const [mr, mc] = candidates[m];
    board[mr][mc].isMine = true;
  }
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].isMine) continue;
      board[r][c].adjacent = getNeighbors(r, c).filter(
        ([nr, nc]) => board[nr][nc].isMine
      ).length;
    }
  }
  return board;
}

function floodReveal(board: Cell[][], startR: number, startC: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[startR, startC]];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const cell = next[r][c];
    if (cell.isRevealed || cell.isFlagged) continue;
    cell.isRevealed = true;
    if (cell.adjacent === 0 && !cell.isMine) {
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (!next[nr][nc].isRevealed && !next[nr][nc].isFlagged) {
          queue.push([nr, nc]);
        }
      }
    }
  }
  return next;
}

function formatLed(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value));
  if (clamped < 0) {
    return '-' + String(Math.abs(clamped)).padStart(2, '0');
  }
  return String(clamped).padStart(3, '0');
}

function analyzeBoardForHint(board: Cell[][], status: GameStatus): {
  summary: string;
  localTip: string;
} {
  if (status === 'idle') {
    return {
      summary: 'Fresh 9x9 board, no tiles revealed yet.',
      localTip:
        'Start right in the middle (Row 5, Col 5)! First click is guaranteed safe—no bravery required.',
    };
  }
  if (status === 'won') {
    return {
      summary: 'Player already won the 9x9 board!',
      localTip:
        'You already cleared every mine! Hit the shades smiley to defend your 1995 champion title.',
    };
  }
  if (status === 'lost') {
    return {
      summary: 'Player stepped on a mine and lost.',
      localTip:
        'Kaboom! That tile was definitely spicy. Click the dizzy smiley to pretend that never happened.',
    };
  }

  let safeCell: [number, number] | null = null;
  let definiteMine: [number, number] | null = null;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      if (!cell.isRevealed || cell.adjacent === 0) continue;
      const neighbors = getNeighbors(r, c);
      const flagged = neighbors.filter(([nr, nc]) => board[nr][nc].isFlagged);
      const hidden = neighbors.filter(
        ([nr, nc]) => !board[nr][nc].isRevealed && !board[nr][nc].isFlagged
      );
      if (hidden.length > 0 && flagged.length === cell.adjacent && !safeCell) {
        safeCell = hidden[0];
      }
      if (
        hidden.length > 0 &&
        flagged.length + hidden.length === cell.adjacent &&
        !definiteMine
      ) {
        definiteMine = hidden[0];
      }
    }
  }

  const lines = board.map((row) =>
    row
      .map((c) => {
        if (c.isFlagged) return 'F';
        if (!c.isRevealed) return '.';
        return String(c.adjacent);
      })
      .join(' ')
  );

  let localTip =
    'No 100% textbook deduction visible—try a corner or edge tile near a low number like 1!';
  if (safeCell) {
    localTip = `Psst! Row ${safeCell[0] + 1}, Col ${safeCell[1] + 1} is 100% safe based on your flags. Click it with confidence!`;
  } else if (definiteMine) {
    localTip = `Whoa there! Row ${definiteMine[0] + 1}, Col ${definiteMine[1] + 1} is practically screaming MINE. Right-click to flag it!`;
  }

  return { summary: lines.join('\n'), localTip };
}

const SmileySvg: React.FC<{ mood: 'happy' | 'tense' | 'won' | 'lost' }> = ({
  mood,
}) => (
  <svg width="24" height="24" viewBox="0 0 24 24" shapeRendering="crispEdges">
    <circle cx="12" cy="12" r="9.5" fill="#ffdf22" stroke="#111111" strokeWidth="1.5" />
    {mood === 'happy' && (
      <>
        <rect x="8" y="8" width="2" height="2" fill="#111111" />
        <rect x="14" y="8" width="2" height="2" fill="#111111" />
        <path d="M8 14 Q12 18 16 14" fill="none" stroke="#111111" strokeWidth="1.6" />
      </>
    )}
    {mood === 'tense' && (
      <>
        <rect x="8" y="8" width="2" height="2" fill="#111111" />
        <rect x="14" y="8" width="2" height="2" fill="#111111" />
        <circle cx="12" cy="15.5" r="2.2" fill="none" stroke="#111111" strokeWidth="1.5" />
      </>
    )}
    {mood === 'won' && (
      <>
        <rect x="6" y="8" width="5" height="3.5" fill="#111111" />
        <rect x="13" y="8" width="5" height="3.5" fill="#111111" />
        <rect x="11" y="9" width="2" height="1.2" fill="#111111" />
        <path d="M8 14.5 Q12 18 16 14.5" fill="none" stroke="#111111" strokeWidth="1.6" />
      </>
    )}
    {mood === 'lost' && (
      <>
        <path d="M7.5 7.5 L10.5 10.5 M10.5 7.5 L7.5 10.5" stroke="#111111" strokeWidth="1.5" />
        <path d="M13.5 7.5 L16.5 10.5 M16.5 7.5 L13.5 10.5" stroke="#111111" strokeWidth="1.5" />
        <path d="M8 16.5 Q12 13 16 16.5" fill="none" stroke="#111111" strokeWidth="1.6" />
      </>
    )}
  </svg>
);

export const GemSweeperApp: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard());
  const [status, setStatus] = useState<GameStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const [isPressingCell, setIsPressingCell] = useState(false);
  const [hintText, setHintText] = useState(
    'Click any tile to start sweeping! Right-click flags mines. Need advice? Press Hint!'
  );
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = window.setInterval(() => {
      setSeconds((s) => Math.min(999, s + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const flagCount = board.flat().filter((c) => c.isFlagged).length;
  const remainingMines = MINE_COUNT - flagCount;

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setStatus('idle');
    setSeconds(0);
    setIsPressingCell(false);
    setHintText('Fresh 9x9 minefield! Click a tile or ask Gemini for a Hint.');
  };

  const checkWin = (nextBoard: Cell[][]): boolean => {
    let unrevealedSafe = 0;
    for (const row of nextBoard) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
      }
    }
    return unrevealedSafe === 0;
  };

  const handleCellClick = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;

    let working = board;
    if (status === 'idle') {
      working = populateMines(r, c);
      setStatus('playing');
    }

    const target = working[r][c];
    if (target.isRevealed || target.isFlagged) return;

    if (target.isMine) {
      const revealedAll = working.map((row) =>
        row.map((cell) => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed,
          exploded: cell.row === r && cell.col === c,
        }))
      );
      setBoard(revealedAll);
      setStatus('lost');
      setHintText('BOOM! Well, at least you found one of the mines the hard way.');
      return;
    }

    const next = floodReveal(working, r, c);
    if (checkWin(next)) {
      const flaggedWin = next.map((row) =>
        row.map((cell) => (cell.isMine ? { ...cell, isFlagged: true } : cell))
      );
      setBoard(flaggedWin);
      setStatus('won');
      setHintText(`Victory in ${seconds}s! Put that on your 1995 resume!`);
    } else {
      setBoard(next);
    }
  };

  const handleCellContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    const cell = board[r][c];
    if (cell.isRevealed) return;
    setBoard((prev) =>
      prev.map((row, ri) =>
        row.map((item, ci) =>
          ri === r && ci === c ? { ...item, isFlagged: !item.isFlagged } : item
        )
      )
    );
  };

  const handleHint = async () => {
    if (isLoadingHint) return;
    setIsLoadingHint(true);
    setHintText('Scanning the minefield with Gemini sonar...');
    try {
      const { summary, localTip } = analyzeBoardForHint(board, status);
      const commentary = await generateSweeperHint(summary, localTip);
      setHintText(commentary);
    } catch {
      const { localTip } = analyzeBoardForHint(board, status);
      setHintText(localTip);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const mood: 'happy' | 'tense' | 'won' | 'lost' =
    status === 'won'
      ? 'won'
      : status === 'lost'
      ? 'lost'
      : isPressingCell
      ? 'tense'
      : 'happy';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div
        className="explorer-toolbar"
        style={{ justifyContent: 'space-between', padding: '2px 4px 4px' }}
      >
        <button type="button" className="win95-btn" onClick={resetGame}>
          New Game
        </button>
        <button
          type="button"
          className="win95-btn"
          onClick={handleHint}
          disabled={isLoadingHint}
          style={{ fontWeight: 600 }}
        >
          &#10022; {isLoadingHint ? 'Thinking...' : 'Hint'}
        </button>
      </div>

      <div className="sweeper-wrap">
        {/* Red-on-Black Counters & Reactive Smiley */}
        <div className="sweeper-header win95-sunken">
          <div className="sweeper-led" aria-label={`Mines remaining: ${remainingMines}`}>
            {formatLed(remainingMines)}
          </div>

          <button
            type="button"
            className="win95-btn sweeper-smiley-btn"
            onClick={resetGame}
            aria-label="Reset GemSweeper"
            title="Reset Game"
          >
            <SmileySvg mood={mood} />
          </button>

          <div className="sweeper-led" aria-label={`Elapsed seconds: ${seconds}`}>
            {formatLed(seconds)}
          </div>
        </div>

        {/* 9x9 Grid */}
        <div
          className="sweeper-grid win95-sunken"
          onMouseLeave={() => setIsPressingCell(false)}
          onMouseUp={() => setIsPressingCell(false)}
        >
          {board.map((row) =>
            row.map((cell) => {
              const cls = cell.isRevealed
                ? `sweeper-cell revealed ${cell.exploded ? 'exploded' : ''}`
                : 'sweeper-cell unrevealed';
              return (
                <button
                  key={`${cell.row}-${cell.col}`}
                  type="button"
                  className={cls}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !cell.isRevealed && !cell.isFlagged) {
                      setIsPressingCell(true);
                    }
                  }}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                  onContextMenu={(e) => handleCellContextMenu(e, cell.row, cell.col)}
                  aria-label={`Row ${cell.row + 1} Column ${cell.col + 1}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <PixelMineIcon size={16} />
                    ) : cell.adjacent > 0 ? (
                      <span style={{ color: NUM_COLORS[cell.adjacent] || '#000' }}>
                        {cell.adjacent}
                      </span>
                    ) : null
                  ) : cell.isFlagged ? (
                    <PixelFlagIcon size={15} />
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {/* Comic Sans Gemini Hint Box */}
        <div className="sweeper-hint-box">{hintText}</div>
      </div>
    </div>
  );
};
