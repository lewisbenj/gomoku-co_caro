const BOARD_SIZE = 15;
const WIN_COUNT = 5;
const PLAYER_SYMBOL = 'X'; 
const BOT_SYMBOL = 'O';    

let board = [];
let isGameOver = false;
let isPlayerTurn = true;
let botThinking = false;

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
    board = [];
    gameBoardElement.innerHTML = '';
    isGameOver = false;
    isPlayerTurn = true;
    botThinking = false;
    resultModal.style.display = 'none'; // Ẩn modal

    statusElement.textContent = `Lượt của bạn (${PLAYER_SYMBOL})`;
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
            setTimeout(botMove, 500); 
        }
    }
}

function placePiece(row, col, symbol) {
    board[row][col] = symbol;
    
    const cellElement = gameBoardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add(symbol.toLowerCase());
    cellElement.textContent = symbol; 

    if (checkWin(row, col, symbol)) {
        isGameOver = true;
        showResult(symbol === PLAYER_SYMBOL ? "🎉 BẠN THẮNG TUYỆT VỜI! 🎉" : "Máy thắng. Chúc may mắn lần sau!");
        return true;
    }
    
    if (checkDraw()) {
        isGameOver = true;
        showResult("🤝 HÒA CỜ! 🤝");
    }

    return false;
}

function showResult(message) {
    resultText.textContent = message;
    resultModal.style.display = 'block';
}

function checkWin(r, c, player) {
    const directions = [
        [0, 1],   // Ngang
        [1, 0],   // Dọc
        [1, 1],   // Chéo chính
        [1, -1]   // Chéo phụ
    ];

    for (const [dr, dc] of directions) {
        let count = 1;
        
        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
                count++;
            } else {
                break;
            }
        }
        
        for (let i = 1; i < WIN_COUNT; i++) {
            const nr = r - i * dr;
            const nc = c - i * dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
                count++;
            } else {
                break;
            }
        }

        if (count >= WIN_COUNT) {
            return true;
        }
    }
    return false;
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

function botMove() {
    if (isGameOver) return;
    botThinking = true;

    let bestMove = null;
    let maxScore = -Infinity;
    
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === null && hasNeighbor(i, j, 2)) {
                moves.push({ r: i, c: j });
            }
        }
    }
    
    if (moves.length === 0) {
        const center = Math.floor(BOARD_SIZE / 2);
        if (board[center][center] === null) {
            moves.push({ r: center, c: center });
        }
    }
    
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
            score += SCORES.BLOCK_WIN; n
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

        if (count >= WIN_COUNT - 1) { // 4 ô
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

initializeBoard();

// uocgicoaylacuatoi =))