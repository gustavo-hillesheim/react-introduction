import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={ props.onClick }>
            { props.value }
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i) } 
            />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                </div>
                <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                </div>
                <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            historyIndex: 0
        };
    }

    calculateWinner(squares) {

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
                return squares[a];
            }
        }

        return null;
    }

    getStatus() {
        const current = this.state.history[this.state.historyIndex];
        const winner = this.calculateWinner(current.squares);
        if (winner) {
            return 'Winner: ' + winner;
        }
        const nextPlayer = this.state.xIsNext ? 'X' : 'O';
        return 'Next Player: ' + nextPlayer;
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.historyIndex + 1);
        const current = history[history.length - 1];
        const squares = [ ...current.squares ];
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ 
            history: history.concat([{ squares }]), 
            xIsNext: !this.state.xIsNext,
            historyIndex: history.length
        });
    }

    goToHistoryIndex(historyIndex) {

        this.setState({
            historyIndex: historyIndex,
            xIsNext: (historyIndex % 2) === 0
        });
    }

    renderStepButtons() {

        const history = this.state.history;

        return history.map((_, historyIndex) => {

            const description = 'Go to ' + (historyIndex ? 'move ' + historyIndex : 'start');
            return (
                <li key={historyIndex}>
                    <button 
                        onClick={ () => this.goToHistoryIndex(historyIndex)}>
                        {description}
                    </button>
                </li>
            )
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.historyIndex];

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={ current.squares }
                onClick={ (i) => this.handleClick(i) }
            />
            </div>
            <div className="game-info">
            <div>{ this.getStatus() }</div>
            <ol>{ this.renderStepButtons() }</ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  