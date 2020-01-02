import { indexAsCoords } from "./utils";

export class GameAnalyzer {

  getWinnerInfo(gameState) {

    const squares = gameState.squares;
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {

        const [ a, b, c ] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

            return {
                winner: squares[a],
                winningSquares: lines[i].map(indexAsCoords)
            };
        }
    }

    return null;
}

  isOver(gameState) {
    return gameState.squares.filter(square => !!square).length === 9;
  }

  getStatus(gameState, xIsNext) {

    const winner = gameState.winner;
    const nextPlayer = xIsNext ? 'X' : 'O';

    if (winner) {
        return 'Winner: ' + winner;
    } else if (this.isOver(gameState)) {
        return 'Draw!';
    }
    return 'Next Player: ' + nextPlayer;
  }
}