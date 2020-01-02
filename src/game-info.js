import React from 'react';
import { GameAnalyzer } from './game-analyzer';

export class GameInfo extends React.Component {

  constructor(props) {
    super(props);
    
    this.gameAnalyzer = new GameAnalyzer();
  }

  render() {

    const status = this.gameAnalyzer.getStatus(this.props.gameState, this.props.xIsNext);

    return (
      <div className="game-info">
        <h2>{ status }</h2>
      </div>
    );
  }
}