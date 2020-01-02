import React from 'react';

import { GameStateCalculator } from './game-state-calculator';
import { Board } from './board';
import { GameInfo } from './game-info';
import { coordsAsIndex } from './utils';
import { MoveHistory } from './move-history';

export class Game extends React.Component {

  constructor(props) {
    super(props);

    this.gameStateManipulator = new GameStateCalculator();

    this.state = {
      gameStateHistory: [{
        squares: Array(9).fill(null),
        selectedSquare: {},
        winningSquares: []
      }],
      gameStateIndex: 0,
      xIsNext: true
    };
  }

  render() {

    const currentGameState = this.getCurrentGameState();

    return (
      <div className="game">
        <h2>Tic Tac Toe</h2>
        <GameInfo gameState={ currentGameState } xIsNext={ this.state.xIsNext }/>
        <div className="current-game-board">
          <Board
            gameState={ currentGameState }
            onSquareClick={ (coords) => this.updateSquare(coords) }
          />
        </div>
        <MoveHistory
          goToGameState={ (index) => this.goToGameState(index) }
          gameStateHistory={ this.state.gameStateHistory }
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