import { coordsAsIndex } from "./utils";
import { GameAnalyzer } from "./game-analyzer";

export class GameStateCalculator {

    constructor() {

        this.gameAnalyzer = new GameAnalyzer();
    }

    updateSquareAt(gameState, selectedSquare, xIsNext) {

        const squareIndex = coordsAsIndex(selectedSquare);
        const squares = [ ...gameState.squares ];
        squares[squareIndex] = xIsNext ? 'X' : 'O';

        let winner, winningSquares = [];
        const winnerInfo = this.gameAnalyzer.getWinnerInfo({ ...gameState, squares });

        if (winnerInfo) {
            winner = winnerInfo.winner;
            winningSquares = winnerInfo.winningSquares;
        }

        return { 
            squares, 
            selectedSquare, 
            winner, 
            winningSquares 
        };
    }
}