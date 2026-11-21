import React, { useState, useEffect, useCallback } from 'react';
import { getMinesweeperHint } from '../../services/geminiService';

const ROWS = 9;
const COLS = 9;
const TOTAL_MINES = 10;

interface Cell {
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
  const res: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        res.push([nr, nc]);
      }
    }
  }
  return res;
}

function plantMines(board: Cell[][], safeR: number, safeC: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  let planted = 0;
  while (planted < TOTAL_MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if ((r === safeR && c === safeC) || next[r][c].isMine) continue;
    next[r][c].isMine = true;
    planted++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].isMine) continue;
      next[r][c].adjacent = getNeighbors(r, c).filter(([nr, nc]) => next[nr][nc].isMine).length;
    }
  }
  return next;
}

function floodReveal(board: Cell[][], startR: number, startC: number): void {
  const stack: [number, number][] = [[startR, startC]];
  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) continue;
    cell.isRevealed = true;
    if (cell.adjacent === 0 && !cell.isMine) {
      for (const [nr, nc] of getNeighbors(r, c)) {
        if (!board[nr][nc].isRevealed && !board[nr][nc].isFlagged) {
          stack.push([nr, nc]);
        }
      }
    }
  }
}

function computeLocalHint(board: Cell[][], status: GameStatus): string {
  if (status === 'won') return 'You already cleared the whole minefield! Take a victory lap, legend!';
  if (status === 'lost') return 'Kaboom! Hit the smiley face above and pretend that explosion was a tactical test.';
  if (status === 'idle') return 'Click any square to kick things off! Corners or center are classic 1995 pro moves.';

  // Deterministic check for guaranteed safe or mine cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell.isRevealed || cell.adjacent === 0) continue;
      const neighbors = getNeighbors(r, c);
      const flagged = neighbors.filter(([nr, nc]) => board[nr][nc].isFlagged);
      const hidden = neighbors.filter(([nr, nc]) => !board[nr][nc].isRevealed && !board[nr][nc].isFlagged);

      if (hidden.length > 0 && flagged.length === cell.adjacent) {
        const [sr, sc] = hidden[0];
        return `Aha! Row ${r + 1}, Col ${c + 1} already has all its mines flagged—Row ${sr + 1}, Col ${sc + 1} is 100% safe!`;
      }
      if (hidden.length > 0 && flagged.length + hidden.length === cell.adjacent) {
        const [mr, mc] = hidden[0];
        return `Careful! Math says Row ${mr + 1}, Col ${mc + 1} is definitely hiding a mine—right-click to flag it!`;
      }
    }
  }

  return 'No obvious 100% giveaway right now—look near the 1s on the edges and trust your 90s gut!';
}

const SmileyFace: React.FC<{ mood: 'normal' | 'tense' | 'won' | 'lost' }> = ({ mood }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#111111" strokeWidth="1.5" />
    {mood === 'won' ? (
      <>
        <rect x="6" y="7.5" width="5" height="3.5" rx="0.8" fill="#111111" />
        <rect x="13" y="7.5" width="5" height="3.5" rx="0.8" fill="#111111" />
        <line x1="11" y1="8.8" x2="13" y2="8.8" stroke="#111111" strokeWidth="1.5" />
        <path d="M8 14.8 Q12 18.2 16 14.8" stroke="#111111" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </>
    ) : mood === 'lost' ? (
      <>
        <path d="M7.5 8 L10.5 11 M10.5 8 L7.5 11" stroke="#111111" strokeWidth="1.5" />
        <path d="M13.5 8 L16.5 11 M16.5 8 L13.5 11" stroke="#111111" strokeWidth="1.5" />
        <path d="M8 17 Q12 13.5 16 17" stroke="#111111" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </>
    ) : mood === 'tense' ? (
      <>
        <circle cx="9" cy="9.5" r="1.4" fill="#111111" />
        <circle cx="15" cy="9.5" r="1.4" fill="#111111" />
        <circle cx="12" cy="15.5" r="2.2" fill="none" stroke="#111111" strokeWidth="1.5" />
      </>
    ) : (
      <>
        <circle cx="9" cy="9.5" r="1.4" fill="#111111" />
        <circle cx="15" cy="9.5" r="1.4" fill="#111111" />
        <path d="M8 14.5 Q12 18 16 14.5" stroke="#111111" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const GemSweeperApp: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard());
  const [status, setStatus] = useState<GameStatus>('idle');
  const [seconds, setSeconds] = useState<number>(0);
  const [isPressingCell, setIsPressingCell] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>(
    'Click "Hint" anytime for witty Gemini Minesweeper advice!'
  );
  const [loadingHint, setLoadingHint] = useState<boolean>(false);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = window.setInterval(() => {
      setSeconds((s) => Math.min(999, s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setStatus('idle');
    setSeconds(0);
    setIsPressingCell(false);
    setHintText('Fresh 9×9 field! Right-click to plant flags, or ask me for a Hint.');
  }, []);

  const flagsUsed = board.flat().filter((c) => c.isFlagged).length;
  const minesRemaining = Math.max(-99, TOTAL_MINES - flagsUsed);

  const formatLcd = (val: number) => {
    if (val < 0) return `-${String(Math.abs(val)).padStart(2, '0')}`;
    return String(val).padStart(3, '0');
  };

  const handleCellClick = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    const target = board[r][c];
    if (target.isRevealed || target.isFlagged) return;

    let nextBoard =
      status === 'idle'
        ? plantMines(board, r, c)
        : board.map((row) => row.map((cell) => ({ ...cell })));

    if (status === 'idle') {
      setStatus('playing');
    }

    if (nextBoard[r][c].isMine) {
      nextBoard[r][c].exploded = true;
      for (let rr = 0; rr < ROWS; rr++) {
        for (let cc = 0; cc < COLS; cc++) {
          if (nextBoard[rr][cc].isMine) {
            nextBoard[rr][cc].isRevealed = true;
          }
        }
      }
      setBoard(nextBoard);
      setStatus('lost');
      return;
    }

    floodReveal(nextBoard, r, c);

    // Check win
    const unrevealedSafe = nextBoard
      .flat()
      .filter((cell) => !cell.isMine && !cell.isRevealed).length;

    if (unrevealedSafe === 0) {
      for (let rr = 0; rr < ROWS; rr++) {
        for (let cc = 0; cc < COLS; cc++) {
          if (nextBoard[rr][cc].isMine) nextBoard[rr][cc].isFlagged = true;
        }
      }
      setStatus('won');
    }

    setBoard(nextBoard);
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    if (board[r][c].isRevealed) return;
    setBoard((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) =>
          ri === r && ci === c ? { ...cell, isFlagged: !cell.isFlagged } : cell
        )
      )
    );
  };

  const handleHint = async () => {
    setLoadingHint(true);
    setHintText('Consulting Gemini tactical radar...');
    const summary = board
      .map((row) =>
        row
          .map((cell) =>
            cell.isRevealed ? (cell.isMine ? '*' : String(cell.adjacent)) : cell.isFlagged ? 'F' : '.'
          )
          .join(' ')
      )
      .join('\n');
    const localSuggestion = computeLocalHint(board, status);
    try {
      const reply = await getMinesweeperHint(summary, localSuggestion);
      setHintText(reply);
    } finally {
      setLoadingHint(false);
    }
  };

  const smileyMood =
    status === 'won' ? 'won' : status === 'lost' ? 'lost' : isPressingCell ? 'tense' : 'normal';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#c0c0c0' }}>
      <div className="win95-menubar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button type="button" className="win95-menubar-item" onClick={resetGame}>
            New Game
          </button>
          <button type="button" className="win95-menubar-item" onClick={handleHint} disabled={loadingHint}>
            Hint
          </button>
        </div>
        <button
          type="button"
          className="win95-btn"
          style={{ padding: '2px 10px', fontSize: 11, fontWeight: 700 }}
          onClick={handleHint}
          disabled={loadingHint}
        >
          💡 Hint
        </button>
      </div>

      <div className="sweeper-wrap">
        {/* Top HUD: Flag Counter | Reactive Smiley | Timer */}
        <div className="sweeper-hud win95-sunken">
          <div className="sweeper-lcd" aria-label="Remaining Mines">
            {formatLcd(minesRemaining)}
          </div>
          <button
            type="button"
            className="sweeper-smiley-btn"
            onClick={resetGame}
            title="New Game"
            aria-label="Reset Minesweeper"
          >
            <SmileyFace mood={smileyMood} />
          </button>
          <div className="sweeper-lcd" aria-label="Timer">
            {formatLcd(seconds)}
          </div>
        </div>

        {/* 9x9 Grid */}
        <div
          className="sweeper-grid win95-sunken"
          onMouseUp={() => setIsPressingCell(false)}
          onMouseLeave={() => setIsPressingCell(false)}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              let className = 'sweeper-cell ';
              if (cell.exploded) className += 'exploded';
              else if (cell.isRevealed) className += 'revealed';
              else className += 'hidden';

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={className}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !cell.isRevealed && !cell.isFlagged && status !== 'won' && status !== 'lost') {
                      setIsPressingCell(true);
                    }
                  }}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleCellRightClick(e, r, c)}
                  aria-label={`Row ${r + 1} Column ${c + 1}`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <svg width="16" height="16" viewBox="0 0 18 18">
                        <line x1="9" y1="2" x2="9" y2="16" stroke="#000" strokeWidth="1.8" />
                        <line x1="2" y1="9" x2="16" y2="9" stroke="#000" strokeWidth="1.8" />
                        <line x1="4" y1="4" x2="14" y2="14" stroke="#000" strokeWidth="1.6" />
                        <line x1="14" y1="4" x2="4" y2="14" stroke="#000" strokeWidth="1.6" />
                        <circle cx="9" cy="9" r="4.8" fill="#111" />
                        <circle cx="7.4" cy="7.4" r="1.4" fill="#fff" />
                      </svg>
                    ) : cell.adjacent > 0 ? (
                      <span style={{ color: NUM_COLORS[cell.adjacent] }}>{cell.adjacent}</span>
                    ) : null
                  ) : cell.isFlagged ? (
                    <svg width="15" height="15" viewBox="0 0 16 16">
                      <line x1="8" y1="2.5" x2="8" y2="13" stroke="#111" strokeWidth="1.6" />
                      <polygon points="8,2.5 3,5.5 8,8.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.7" />
                      <rect x="4.5" y="12.5" width="7" height="2" fill="#111" />
                    </svg>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        {/* Witty Gemini Hint Box (Comic Sans) */}
        <div className="sweeper-hint-box">
          <strong>Gemini:</strong> {hintText}
        </div>
      </div>
    </div>
  );
};
