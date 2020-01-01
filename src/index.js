import React from 'react';
import ReactDOM from 'react-dom';

import { Board } from './board';
import { GameInfo } from './game-info';
import './index.css';
import{ coordsAsIndex } from './utils';
import { GameStateCalculator } from './game-state-calculator';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.gameStateManipulator = new GameStateCalculator();

        this.state = {
            gameStateHistory: [{
                squares: Array(9).fill(null),
                selectedSquare: {},
                winningSquares: []
            }],
            xIsNext: true,
            gameStateIndex: 0
        };
    }

    render() {

        const currentGameState = this.getCurrentGameState();

        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    gameState={ currentGameState }
                    onClick={ (coords) => this.updateSquare(coords) }
                />
                </div>
                <GameInfo 
                    goToGameState={ (i) => this.goToGameState(i) }
                    gameState={ currentGameState }
                    history={ this.state.gameStateHistory }
                    xIsNext={ this.state.xIsNext }
                />
            </div>
        );
    }

    getCurrentGameState() {
        return this.state.gameStateHistory[this.state.gameStateIndex];
    }

    updateSquare(squareCoords) {

        const gameState = this.getCurrentGameState();
        if (this.shouldIgnoreSquareUpdate(gameState, squareCoords)) {
            return;
        }

        const nextGameState = this.gameStateManipulator
            .updateSquareAt(gameState, squareCoords, this.state.xIsNext);
        
        const gameStateHistory = this.state.gameStateHistory;
        const gameStateIndex = this.state.gameStateIndex;
        const newGameStateHistory = gameStateHistory.slice(0, gameStateIndex + 1);
        this.setState({ 
            gameStateHistory: newGameStateHistory.concat([nextGameState]), 
            xIsNext: !this.state.xIsNext,
            gameStateIndex: newGameStateHistory.length
        });
    }

    shouldIgnoreSquareUpdate(gameState, squareCoords) {

        const hasWinner = !!gameState.winner;
        const squareHasvalue = gameState.squares[coordsAsIndex(squareCoords)];
        return hasWinner || squareHasvalue;
    }

    goToGameState(gameStateIndex) {

        this.setState({
            gameStateIndex,
            xIsNext: (gameStateIndex % 2) === 0
        });
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  