import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function indexAsCoords(index) {

    const x = index % 3;
    const y = (index - x) / 3;
    return { x, y };
}

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

function HistoryOrderToggle(props) {
    return (
        <button onClick={ props.onClick }>
            Toggle step history order
        </button>
    )
}

function historyJumper({ historyIndex, onClick, isSelected, selectedSquareCoords }) {

    const goToLabel = 'Go to ' + (historyIndex ? 'move ' + historyIndex : 'start');
    const { x, y } = selectedSquareCoords;
    const coordsLabel = historyIndex ? ` (${x}, ${y})` : '';
    const description = goToLabel + coordsLabel;
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

class Board extends React.Component {

    renderSquare(x, y) {

        const i = y * 3 + x;
        x++;
        y++;
        const boardCoords = { x, y };
        const { x: selectedX, y: selectedY } = this.props.selectedSquareCoords;
        const isSquareSelected = selectedX === x && selectedY === y;
        const isWinningSquare = this.props.winningSquaresCoords
            .some(({ x: winningX, y: winningY }) => {
                return winningX + 1 === x && winningY + 1 === y;
            });

        return (
            <Square 
                key={ i }
                value={ this.props.squares[i] }
                isSelected={ isSquareSelected }
                isWinning={ isWinningSquare }
                onClick={ () => this.props.onClick(i, boardCoords) } 
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
                squares: Array(9).fill(null),
                selectedSquareCoords: {
                    x: null,
                    y: null
                },
                winningSquares: []
            }],
            xIsNext: true,
            historyIndex: 0,
            showHistoryInOrder: true
        };
    }

    getCurrentHistory() {
        return this.state.history[this.state.historyIndex];
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

                return {
                    winner: squares[a],
                    winningSquares: lines[i].map(indexAsCoords)
                };
            }
        }

        return null;
    }

    gameIsOver() {
        return this.getCurrentHistory()
            .squares.filter(square => !!square).length === 9;
    }

    getStatus() {
        const winner = this.getCurrentHistory().winner;

        if (winner) {
            return 'Winner: ' + winner;
        } else if (this.gameIsOver()) {
            return 'Draw!';
        }
        const nextPlayer = this.state.xIsNext ? 'X' : 'O';
        return 'Next Player: ' + nextPlayer;
    }

    handleClick(i, selectedSquareCoords) {

        const history = this.state.history.slice(0, this.state.historyIndex + 1);
        const current = history[history.length - 1];
        const squares = [ ...current.squares ];
        if (this.getCurrentHistory().winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let winner, winningSquares = [];
        const winnerInfo = this.calculateWinner(squares);

        if (winnerInfo) {
            winner = winnerInfo.winner;
            winningSquares = winnerInfo.winningSquares;
        }

        this.setState({ 
            history: history.concat([{ 
                squares, 
                selectedSquareCoords, 
                winner, 
                winningSquares 
            }]), 
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
            .map((currentHistory, historyIndex) => (
                historyJumper({
                    isSelected: historyIndex === currentHistoryIndex,
                    historyIndex,
                    selectedSquareCoords: currentHistory.selectedSquareCoords,
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

        const currentHistory = this.getCurrentHistory();
        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    winningSquaresCoords={ currentHistory.winningSquares }
                    selectedSquareCoords={ currentHistory.selectedSquareCoords }
                    squares={ currentHistory.squares }
                    onClick={ (i, coords) => this.handleClick(i, coords) }
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

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  