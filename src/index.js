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

    renderSquare(x, y) {

        const i = y * 3 + x;
        return (
            <Square 
                key={ i }
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i, { x, y }) } 
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

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true,
            historyIndex: 0,
            showHistoryInOrder: true
        };
    }

    getCurrentSquares() {
        return this.state.history[this.state.historyIndex].squares;
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

    gameIsOver() {
        return this.getCurrentSquares()
            .filter(square => !!square).length === 9;
    }

    getStatus() {
        const winner = this.calculateWinner(this.getCurrentSquares());

        if (winner) {
            return 'Winner: ' + winner;
        } else if (this.gameIsOver()) {
            return 'Draw!';
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
        const currentHistoryIndex = this.state.historyIndex;

        let historyButtons = history
            .map((_, historyIndex) => (
                historyJumper({
                    isSelected: historyIndex === currentHistoryIndex,
                    historyIndex,
                    onClick: () => this.goToHistoryIndex(historyIndex)
                })
            ));

            if (!this.state.showHistoryInOrder) {
                historyButtons = historyButtons.reverse();
            }

            return historyButtons;
    }

    toggleHistoryOrder() {

        this.setState({
            showHistoryInOrder: !this.state.showHistoryInOrder
        });
    }

    render() {

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={ this.getCurrentSquares() }
                onClick={ (i) => this.handleClick(i) }
            />
            </div>
            <div className="game-info">
            <div>{ this.getStatus() }</div>
            <HistoryOrderToggle onClick={ () => this.toggleHistoryOrder() }/>
            <ol>{ this.renderStepButtons() }</ol>
            </div>
        </div>
        );
    }
}

function HistoryOrderToggle(props) {
    return (
        <button onClick={ props.onClick }>
            Toggle step history order
        </button>
    )
}

function historyJumper({ historyIndex, onClick, isSelected }) {

    const description = 'Go to ' + (historyIndex ? 'move ' + historyIndex : 'start');
    const className = isSelected ? 'current-history' : '';
    return (
        <li 
            key={ historyIndex }
            className={ className }>
            <button 
                onClick={ onClick }>
                { description }
            </button>
        </li>
    )
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  