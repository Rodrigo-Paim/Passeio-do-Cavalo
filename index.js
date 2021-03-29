import reader from './reader.js';
import { promisify } from 'util';
import createHorse from './Horse.js';
import createChessBoad from './chessBoard.js';

async function main(horizontalLetter, verticalNumber) {
  try {
    const board = createChessBoad();
    const horse = createHorse(board);
    try {
      board.addHorse(horse, parseInt(verticalNumber), horizontalLetter);
    } catch (err) {
      console.log();
      console.log(err.message);
      return await askForHorseInitialPosition();
    }
    board.walkTheHorse();
  } catch (err) {
    console.log(err.message);
  }
}

async function askForHorseInitialPosition() {
  reader.resume();
  reader.question('Qual a Posição Inicial do Cavalo?\n', async (answer) => {
    const [horizontalLetter, vertical, rest] = answer.slice('');
    reader.pause();
    await main(horizontalLetter, vertical);
  });
}

const args = process.argv.slice(2, process.argv.length);
const input = args[0];
if (input) {
  const [horizontalLetter, vertical, rest] = input.slice('');
  main(horizontalLetter, vertical);
} else {
  askForHorseInitialPosition();
}
