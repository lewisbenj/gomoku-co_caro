const BOARD_SIZE = 15;
const WIN_COUNT = 5;
const PLAYER_SYMBOL = 'X'; 
const BOT_SYMBOL = 'O';    

let board = [];
let isGameOver = false;
let isPlayerTurn = true;
let botThinking = false;
let nextPlayerStarts = PLAYER_SYMBOL; 

const containerElement = document.querySelector('.container');
const gameBoardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');

const resultModal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const modalResetButton = document.getElementById('modal-reset-btn');

const SCORES = {
    'WIN': 1000000, 
    'BLOCK_WIN': 500000, 
    'FOUR': 10000, 
    'OPEN_THREE': 500, 
    'THREE': 100, 
    'OPEN_TWO': 50, 
    'TWO': 10, 
    'NEIGHBOR': 1 
};

function initializeBoard() {
    const existingLines = document.querySelectorAll('#winning-line');
    existingLines.forEach(line => line.remove());
    
    board = [];
    gameBoardElement.innerHTML = ''; 
    isGameOver = false;
    botThinking = false;
    resultModal.style.display = 'none';

    isPlayerTurn = (nextPlayerStarts === PLAYER_SYMBOL);

    const currentPlayer = isPlayerTurn ? PLAYER_SYMBOL : BOT_SYMBOL;
    statusElement.textContent = `Lượt của ${isPlayerTurn ? 'bạn' : 'máy'} (${currentPlayer})`;
    statusElement.style.color = '#4CAF50'; 
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = null;
            
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }

    if (!isPlayerTurn) {
        statusElement.textContent = `Máy đang suy nghĩ...`;
        setTimeout(botMove, 50);
    }
}

function handleCellClick(event) {
    if (isGameOver || !isPlayerTurn || botThinking) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (board[row][col] === null) {
        placePiece(row, col, PLAYER_SYMBOL);
        
        if (!isGameOver) {
            isPlayerTurn = false;
            statusElement.textContent = `Máy đang suy nghĩ...`;
            setTimeout(botMove, 50);
        }
    }
}

function placePiece(row, col, symbol) {
    board[row][col] = symbol;
    
    const cellElement = gameBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add(symbol.toLowerCase());
    cellElement.textContent = symbol; 

    const winningCells = checkWin(row, col, symbol);
    if (winningCells) {
        isGameOver = true;
        
        drawWinningLine(winningCells, symbol); 
        
        nextPlayerStarts = (symbol === PLAYER_SYMBOL) ? BOT_SYMBOL : PLAYER_SYMBOL;
        
        const resultMessage = symbol === PLAYER_SYMBOL ? "🎉 BẠN THẮNG TUYỆT VỜI! 🎉" : "Máy thắng. Chúc may mắn lần sau!";
        
        setTimeout(() => {
            const existingLines = document.querySelectorAll('#winning-line');
            existingLines.forEach(line => line.remove());
            
            showResult(resultMessage);
        }, 1500); 
        
        return true;
    }
    
    if (checkDraw()) {
        isGameOver = true;
        nextPlayerStarts = (nextPlayerStarts === PLAYER_SYMBOL) ? BOT_SYMBOL : PLAYER_SYMBOL;
        showResult("🤝 HÒA CỜ! 🤝");
    }

    return false;
}

function showResult(message) {
    resultText.textContent = message;
    resultModal.style.display = 'block';
}

function drawWinningLine(cells, winnerSymbol) {
    if (cells.length < WIN_COUNT) return; 
    
    const startCell = gameBoardElement.querySelector(`[data-row="${cells[0].r}"][data-col="${cells[0].c}"]`);
    const endCell = gameBoardElement.querySelector(`[data-row="${cells[4].r}"][data-col="${cells[4].c}"]`);
    
    if (!startCell || !endCell || !containerElement) return;

    const cellSize = startCell.getBoundingClientRect().width;
    const containerRect = containerElement.getBoundingClientRect();
    
    const startX_abs = startCell.getBoundingClientRect().left + cellSize / 2;
    const startY_abs = startCell.getBoundingClientRect().top + cellSize / 2;
    const endX_abs = endCell.getBoundingClientRect().left + cellSize / 2;
    const endY_abs = endCell.getBoundingClientRect().top + cellSize / 2;
    
    const startX_rel = startX_abs - containerRect.left;
    const startY_rel = startY_abs - containerRect.top;
    
    const angle = Math.atan2(endY_abs - startY_abs, endX_abs - startX_abs) * (180 / Math.PI);
    const length = Math.sqrt(Math.pow(endX_abs - startX_abs, 2) + Math.pow(endY_abs - startY_abs, 2));

    const line = document.createElement('div');
    line.id = 'winning-line';
    line.style.width = `${length}px`;
    line.style.height = '6px';
    line.style.backgroundColor = (winnerSymbol === PLAYER_SYMBOL) ? '#3f51b5' : '#c0392b';
    line.style.position = 'absolute';
    line.style.left = `${startX_rel}px`;
    line.style.top = `${startY_rel}px`;
    line.style.transformOrigin = 'left center';
    
    const adjustmentFactor = 1.05; 
    line.style.transform = `translate(${- (length * (adjustmentFactor - 1) / 2)}px, -3px) rotate(${angle}deg) scaleX(${adjustmentFactor})`;
    
    line.style.borderRadius = '3px';
    line.style.zIndex = '10';
    
    containerElement.appendChild(line); 
}


function checkWin(r, c, player) {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    for (const [dr, dc] of directions) {
        let count = 1;
        let winningCells = [{r, c}];
        
        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
                count++;
                winningCells.push({r: nr, c: nc});
            } else {
                break;
            }
        }
        
        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r - i * dr;
            const nc = c - i * dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
                count++;
                winningCells.unshift({r: nr, c: nc});
            } else {
                break;
            }
        }

        if (count >= WIN_COUNT) {
            return winningCells.slice(0, WIN_COUNT); 
        }
    }
    return null; 
}

function checkDraw() {
    return board.flat().every(cell => cell !== null);
}

function hasNeighbor(r, c, dist) {
    for (let i = Math.max(0, r - dist); i <= Math.min(BOARD_SIZE - 1, r + dist); i++) {
        for (let j = Math.max(0, c - dist); j <= Math.min(BOARD_SIZE - 1, c + dist); j++) {
            if (board[i][j] !== null) {
                return true;
            }
        }
    }
    return false;
}

function getPossibleMoves() {
    const moves = [];
    const occupiedCells = [];
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] !== null) {
                occupiedCells.push({r: i, c: j});
            }
        }
    }

    if (occupiedCells.length === 0) {
        const center = Math.floor(BOARD_SIZE / 2);
        if (board[center][center] === null) {
            moves.push({ r: center, c: center });
        }
        return moves;
    }

    const checked = new Set();
    
    for (const {r, c} of occupiedCells) {
        for (let i = Math.max(0, r - 2); i <= Math.min(BOARD_SIZE - 1, r + 2); i++) {
            for (let j = Math.max(0, c - 2); j <= Math.min(BOARD_SIZE - 1, c + 2); j++) {
                const key = `${i},${j}`;
                if (board[i][j] === null && !checked.has(key)) {
                    moves.push({ r: i, c: j });
                    checked.add(key);
                }
            }
        }
    }

    if (moves.length > 80) {
        moves.sort(() => 0.5 - Math.random());
        return moves.slice(0, 80);
    }
    
    return moves;
}


function botMove() {
    if (isGameOver) return;
    botThinking = true;

    let bestMove = null;
    let maxScore = -Infinity;
    
    const moves = getPossibleMoves();
    
    for (const move of moves) {
        const r = move.r;
        const c = move.c;
        let score = 0;

        board[r][c] = BOT_SYMBOL;
        if (checkWin(r, c, BOT_SYMBOL)) {
            board[r][c] = null;
            bestMove = move;
            break; 
        }
        board[r][c] = null;
        
        board[r][c] = PLAYER_SYMBOL;
        if (checkWin(r, c, PLAYER_SYMBOL)) {
            score += SCORES.BLOCK_WIN;
        }
        board[r][c] = null;
        
        
        board[r][c] = BOT_SYMBOL;
        score += evaluatePosition(r, c, BOT_SYMBOL);
        board[r][c] = null; 
        
        board[r][c] = PLAYER_SYMBOL;
        score += evaluatePosition(r, c, PLAYER_SYMBOL) * 0.5; 
        board[r][c] = null; 

        if (score > maxScore) {
            maxScore = score;
            bestMove = move;
        }
    }

    if (bestMove) {
        placePiece(bestMove.r, bestMove.c, BOT_SYMBOL);
    } else {
        if (moves.length > 0) {
            placePiece(moves[0].r, moves[0].c, BOT_SYMBOL);
        }
    }
    
    isPlayerTurn = true;
    statusElement.textContent = `Lượt của bạn (${PLAYER_SYMBOL})`;
    botThinking = false;
}

function evaluatePosition(r, c, symbol) {
    let score = 0;
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1] 
    ];

    for (const [dr, dc] of directions) {
        let count = 0;
        let openEnds = 0;

        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === symbol) {
                count++;
            } else if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
                openEnds++; 
                break;
            } else {
                break;
            }
        }
        
        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r - i * dr;
            const nc = c - i * dc;
            
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === symbol) {
                count++;
            } else if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
                openEnds++;
                break;
            } else {
                break;
            }
        }

        if (count >= WIN_COUNT - 1) { 
            score += SCORES.FOUR;
        } else if (count === 3) {
            if (openEnds === 2) {
                score += SCORES.OPEN_THREE; 
            } else if (openEnds === 1) {
                score += SCORES.THREE;
            }
        } else if (count === 2) {
            if (openEnds === 2) {
                score += SCORES.OPEN_TWO;
            } else if (openEnds === 1) {
                score += SCORES.TWO;
            }
        } else if (count === 1 && openEnds === 2) {
             score += SCORES.TWO / 2;
        }
    }
    
    return score;
}

modalResetButton.addEventListener('click', initializeBoard);

nextPlayerStarts = PLAYER_SYMBOL; 
initializeBoard();

//uocgicoaylacuatoi =)))
