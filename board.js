const captures = [null, 3, 1, 2];

const piecesDebut = new Int8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, -2, -1, 0, 0, 0,
  0, 0, 0, 0, -3, -2, -1, 0, 0,
  0, 0, 0, 0, 0, -3, -2, -1, 0,
  0, 2, 3, 0, 0, 0, -3, -2, 0,
  0, 1, 2, 3, 0, 0, 0, 0, 0,
  0, 0, 1, 2, 3, 0, 0, 0, 0,
  0, 0, 0, 1, 2, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0
])


function getCaseContour(caseIdx) {
  let casesContour = [];
  const isLeft = ((caseIdx % 9) === 0);
  const isRight = ((caseIdx % 9) === 8);
  if (!isLeft) {
    casesContour.push(caseIdx - 10);
    casesContour.push(caseIdx - 1);
    casesContour.push(caseIdx + 8);
  }
  if (!isRight) {
    casesContour.push(caseIdx - 8);
    casesContour.push(caseIdx + 1);
    casesContour.push(caseIdx + 10);
  }
  casesContour.push(caseIdx - 9);
  casesContour.push(caseIdx + 9);
  return casesContour.filter(idx => (idx >= 0 && idx < 81))
}

function getCasesContourNoDiagonal(caseIdx) {
  let casesContour = [];
  const isLeft = ((caseIdx % 9) === 0);
  const isRight = ((caseIdx % 9) === 8);
  if (!isLeft) {
    casesContour.push(caseIdx - 1);
  }
  if (!isRight) {
    casesContour.push(caseIdx + 1);
  }
  casesContour.push(caseIdx - 9);
  casesContour.push(caseIdx + 9);
  return casesContour.filter(idx => (idx >= 0 && idx < 81))
}

export const casesContour = new Array(81);
for (let i = 0; i < 81; i++) {
  casesContour[i] = getCaseContour(i);
}

export const casesContourNoDiagonal = new Array(81);
for (let i = 0; i < 81; i++) {
  casesContourNoDiagonal[i] = getCasesContourNoDiagonal(i);
}

export function newBoard() {
  return {
    pieces: new Int8Array(piecesDebut),
    turn: true,
    eval: 0,
    gameOver: false,
    emptyCases: 63,
    bluePiece: 9,
    redPiece: 9,
    hash: null
  }
}

export function getMoves(board) {
  const {pieces, turn} = board;
  let moves = [];
  for (let fromIdx = 0; fromIdx < 81; fromIdx++) {
    const piece = pieces[fromIdx];
    if (piece === 0) continue;
    if (piece > 0 !== turn) continue;
    for (const toIdx of casesContour[fromIdx]) {
      if (canPieceGo(pieces, piece, toIdx)) moves.push([fromIdx, toIdx]);
    }
  }
  return moves;
}

function canPieceGo(pieces, piece, toIdx) {
  const toPiece = pieces[toIdx];
  if (toPiece === 0) return true;
  if ((toPiece * piece < 0) && (captures[Math.abs(piece)] === Math.abs(toPiece))) return true; 
  return false;
}

export function isLegal(board, from, to) {
  const fromPiece = board.pieces[from];
  if (fromPiece === 0 || (fromPiece > 0) !== board.turn) return false;
  if (casesContour[from].includes(to) && canPieceGo(board.pieces, fromPiece, to)) return true;
  return false;
}

export function play(board, from, to) {
  const {pieces} = board;
  const toPiece = pieces[to];
  const fromPiece = pieces[from];
  pieces[from] = 0;
  pieces[to] = fromPiece;
  board.turn = !board.turn;
  return {from, to, fromPiece, toPiece};
}

export function UndoMove(board, lastMove) {
  const {from, to, fromPiece, toPiece} = lastMove;
  const {pieces} = board;
  pieces[to] = toPiece;
  pieces[from] = fromPiece;
  board.turn = !board.turn;
}

export function isGameOver(board) {
  if (board.pieces[8] > 0) return true;
  if (board.pieces[72] < 0) return true;
  if (!board.pieces.some(p => p > 0)) return true;
  if (!board.pieces.some(p => p < 0)) return true;
  return false;
}

export function winner(board) {
  if (board.pieces[8] > 0) return true;
  if (board.pieces[72] < 0) return false;
  if (!board.pieces.some(p => p > 0)) return false;
  if (!board.pieces.some(p => p < 0)) return true;
  return null;
}