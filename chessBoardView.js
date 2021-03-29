import reader from './reader.js';
import readline from 'readline';
import createChessBoard from './chessBoard.js';
export default function createChessBoardView(verticalHouses, horizontalHouses) {
  const rl = reader;
  const horseEmoji = '🐴';
  const usedHouse = 'X';
  const freeHouse = ' ';
  const offset = 4;

  async function printLine(board, vertical, horse) {
    const [v, h] = horse.position();
    let row = `${vertical + 1} |`;
    for (let j = 0; j < horizontalHouses; j++) {
      if (h == j && v == vertical) {
        row += `${horseEmoji}`;
      } else {
        row += `${board[vertical][j] == 1 ? usedHouse : freeHouse}`;
      }
      row += ' | ';
    }
    rl.write(`${row} ${vertical + 1}\n`);
  }

  async function updateBoard(board, horse) {
    for (let i = verticalHouses - 1; i >= 0; i--) {
      const move = offset + i;
      await readline.moveCursor(process.stdout, 0, -move);
      await printLine(board, i, horse);
      await readline.moveCursor(process.stdout, 0, move);
    }
  }
  async function showFullBoard(board, horse) {
    /*
     a b c d e f g h   
  8 | | | | | | | | | 1
  7 | | | | | | | | | 2
  6 | | | | | | | | | 3
  5 | | | | | | | | | 4
  4 | | | | | | | | | 5
  3 | | | | | | | | | 6
  2 | | | | | | | | | 7 
  1 | | | | | | | | | 8
     a b c d e f g h

 */
    const [v, h] = horse.position();
    const headerUp = '    a  b   c   d   e   f   g   h ';
    const headerDown = headerUp;
    rl.write(headerUp + '\n');
    for (let i = verticalHouses - 1; i >= 0; i--) {
      let row = `${i + 1} |`;
      for (let j = 0; j < horizontalHouses; j++) {
        if (h == j && v == i) {
          row += `${horseEmoji}`;
        } else {
          row += `${board[i][j] == 1 ? usedHouse : freeHouse}`;
        }
        row += ' | ';
      }
      rl.write(`${row} ${i + 1}\n`);
    }
    rl.write(headerDown + '\n');
    console.log('\n');
  }
  async function showHorsePosition(board, horse) {
    const [v, h] = horse.position();
    const move = offset + v;
    readline.moveCursor(process.stdout, 0, -move);
    printLine(board, v, horse);
    readline.moveCursor(process.stdout, 0, move);
  }

  async function animatedMoves(moves) {
    function movementIn(move, milliseconds) {
      const [horseV, horseH] = move;
      function position() {
        return [horseV, horseH];
      }
      const horse = {
        position,
      };
      board.value[horseV][horseH] = 1;
      updateBoard(board.value, horse);
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
    const board = createChessBoard();

    async function render() {
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        if (i == 0) {
          board.value[move[0]][move[1]] = 1;
          showFullBoard(board.value, {
            position: () => [move[0], move[1]],
          });
        } else {
          await movementIn(move, 200);
        }
      }
    }
    await render();
  }

  return {
    showFullBoard,
    showHorsePosition,
    updateBoard,
    animatedMoves,
    close: () => rl.close(),
  };
}
