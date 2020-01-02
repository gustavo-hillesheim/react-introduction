import React from 'react';
import { Board } from './board';

export class MoveHistory extends React.Component {

  render() {

    return (
      <div className="game-history-column">
        <h2>Move history</h2>
        { this.renderBoardsGrid() }
      </div>
    )
  }

  renderBoardsGrid() {

    const boardRows = [];
    let currentRow = [];

    this.props.gameStateHistory
      .map(this.renderBoard)
      .forEach(board => {

        currentRow.push(board);
        if (currentRow.length === 3) {
          boardRows.push(currentRow);
          currentRow = [];
        }
      });

    if (currentRow.length) {
      boardRows.push(currentRow);
    }

    return boardRows.map((row, index) => (
      <div key={ index } className="game-history-row">
        { row }
      </div>
    ));
  }

  renderBoard = (gameState, index) => (
    <div onClick={ () => this.props.goToGameState(index) }>
      <Board key={ index } gameState={ gameState }/>
      <h3>{ this.getLabel(index) }</h3>
    </div>
  );

  getLabel = (index) => index ? `Move #${index}` : 'Start';
}