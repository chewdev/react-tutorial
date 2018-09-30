import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = props => (
  <button onClick={props.onClick} className={`square ${props.className}`}>
    {props.value}
  </button>
);

class Board extends React.Component {
  renderSquare(i) {
    console.log(this.props.winningSquares);
    console.log(i);
    console.log(this.props.winningSquares.includes(i));
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        className={
          this.props.winningSquares.includes(i) ? "winning-square" : ""
        }
      />
    );
  }

  render() {
    let renderSquares = [];
    for (let i = 0; i < 3; i++) {
      let currentRow = [];
      for (let j = 0; j < 3; j++) {
        currentRow.push(this.renderSquare(i * 3 + j));
      }
      renderSquares.push(currentRow);
    }

    return (
      <div>
        {renderSquares.map((row, ind) => (
          <div key={ind} className="board-row">
            {row}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          winningSquares: []
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      orderIsDesc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    const hasWinningSquares = [...current.winningSquares].length > 0;

    if (squares[i] || hasWinningSquares) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    const winner = determineWinner(squares);
    // if (winner[0] && this.state.winningSquares.length > 0) {
    //   return;
    // }
    let winningSquares = [];
    if (winner[0]) {
      winningSquares = winner[1];
    }
    const colRow = getColumnRow(i);
    this.setState({
      history: history.concat([{ squares, colRow, winningSquares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  toggleDesc() {
    this.setState({ orderIsDesc: !this.state.orderIsDesc });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = determineWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}: (${step.colRow[0]}, ${step.colRow[1]})`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? "selected-move" : ""}
          >
            {desc}
          </button>
        </li>
      );
    });

    moves = this.state.orderIsDesc ? moves : moves.reverse();

    let status;
    if (winner[0]) {
      status = `Winner: ${winner[0]}`;
    } else if (this.state.stepNumber === 9) {
      status = `Cat's game! It's a draw!`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={current.winningSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleDesc()}>
            List {this.state.orderIsDesc ? "Ascending" : "Descending"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function determineWinner(squares) {
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, []];
}

function getColumnRow(i) {
  const iMap = {
    0: [1, 1],
    1: [2, 1],
    2: [3, 1],
    3: [1, 2],
    4: [2, 2],
    5: [3, 2],
    6: [1, 3],
    7: [2, 3],
    8: [3, 3]
  };

  return iMap[i];
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
