import React from 'react';
import { GameAnalyzer } from './game-analyzer';

function HistoryOrderToggle(props) {
  return (
    <button onClick={ props.onClick }>
      Reverse history order
    </button>
  );
}

function HistoryJumper({ stateIndex, onClick, isSelected, selectedSquare }) {

  const { x, y } = selectedSquare;
  const description = stateIndex ? `Move at (${x + 1}, ${y + 1})` : 'Start';
  const className = isSelected ? 'current-history' : '';

  return (
    <li 
      key={ stateIndex }
      className={ className }>
      <button 
        onClick={ onClick }>
        { description }
      </button>
    </li>
  );
}

export class GameInfo extends React.Component {

  constructor(props) {
    super(props);
    
    this.gameAnalyzer = new GameAnalyzer();

    this.state = {
      showHistoryInOrder: true
    };
  }

  render() {

    const nextPlayer = this.props.xIsNext ? 'X' : 'O';
    const status = this.gameAnalyzer.getStatus(this.props.gameState, nextPlayer);

    return (
      <div className="game-info">
        <div>{ status }</div>
        <HistoryOrderToggle onClick={ () => this.toggleHistoryOrder() }/>
        <div>Moves history</div>
        <ol>{ this.renderStepButtons() }</ol>
      </div>
    );
  }

  toggleHistoryOrder() {

    this.setState({
        showHistoryInOrder: !this.state.showHistoryInOrder
    });
  }

  renderStepButtons() {

    const history = this.props.history;
    const gameStateIndex = history.indexOf(this.props.gameState);
    let historyButtons = history.map(this.getStepButtonRenderer(gameStateIndex));

    if (!this.state.showHistoryInOrder) {
        historyButtons = historyButtons.reverse();
    }

    return historyButtons;
  }

  getStepButtonRenderer(gameStateIndex) {

    return (gameState, stateIndex) => (
      <HistoryJumper
        key={ stateIndex }
        isSelected={ stateIndex === gameStateIndex }
        stateIndex={ stateIndex }
        selectedSquare={ gameState.selectedSquare }
        onClick={ () => this.props.goToGameState(stateIndex) }
      />
  )
  }
}