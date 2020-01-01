import React from 'react';

function Square(props) {

  let className = 'square'; 
  if (props.isSelected) {
    className += ' selected';
  }
  if (props.isWinning) {
    className += ' winning';
  }
  return (
    <button 
      className={ className } 
      onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

export class Board extends React.Component {

  isSelectedSquare({ x, y }) {

    const { x: sx, y: sy } = this.props.gameState.selectedSquare;
    return sx === x && sy === y;
  }

  isWinningSquare({ x, y }) {

    return this.props.gameState.winningSquares
      .some(({ x: wx, y: wy}) => wx === x && wy === y);
  }

  renderSquare(x, y) {

    const i = y * 3 + x;
    const squareCoords = { x, y };

    return (
      <Square 
        key={ i }
        value={ this.props.gameState.squares[i] }
        isSelected={ this.isSelectedSquare(squareCoords) }
        isWinning={ this.isWinningSquare(squareCoords) }
        onClick={ () => this.props.onClick(squareCoords) } 
      />);
  }

  renderBoardRow(y) {
    const squares = Array(3).fill(null).map((_, x) => this.renderSquare(x, y));
    return (
      <div className="board-row" key={ y }>
        { squares }
      </div>
    );
  }

  renderBoardRows() {
    return Array(3).fill(null).map((_, y) => this.renderBoardRow(y));
  }

  render() {

    return (
      <div>
        { this.renderBoardRows() }
      </div>
    );
  }
}