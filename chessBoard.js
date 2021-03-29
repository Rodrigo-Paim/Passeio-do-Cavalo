import createChessBoardView from './chessBoardView.js';

const START_OF_LOWER_CASE_LETTER_IN_UTF16 = 96;
const FINISH_OF_LOWER_CASE_LETTER_IN_UTF16 = 123;

export default function createChessboard() {
  const verticalHouses = 8;
  const horizontalHouses = 8;
  const board = initBoard();
  const view = createChessBoardView(verticalHouses, horizontalHouses);
  const pieces = {};

  function resetBoard() {
    for (let i = 0; i < verticalHouses; i++) {
      for (let j = 0; j < horizontalHouses; j++) {
        board[i][j] = 0;
      }
    }
  }
  function initBoard() {
    const board = [];
    for (let i = 0; i < verticalHouses; i++) {
      let aux = [];
      for (let j = 0; j < horizontalHouses; j++) {
        aux.push(0);
      }
      board.push(aux);
    }
    return board;
  }
  async function showFullBoard() {
    view.showFullBoard(board, pieces.horse);
  }

  function fullyTraveled() {
    const rowWithZero = board.find((row) => {
      return row.includes(0);
    });
    return rowWithZero ? false : true;
  }

  function addHorse(horse, initialVertical, intialHorizontalLetter) {
    const horizontal = convertLetterInNumber(intialHorizontalLetter) - 1;
    if (!validPosition(horizontal, initialVertical)) {
      throw new Error(
        'Posição inserida inválida, por favor insira uma posição válida'
      );
    }
    const vertical = initialVertical - 1;
    horse.setStartingPosition(horizontal, vertical);
    pieces.horse = horse;
    return true;
  }
  function showPositionInChessBoard(vertical, horizontal) {
    /*  if(!validPosition(horizontal,vertical)){
     console.log("Estas coordenadas estão fora do tabuleiro");
     return;
   } */
    console.log(`${convertNumberInLetter(horizontal + 1)}${vertical + 1}`);
  }
  function validPosition(horizontal, vertical) {
    return (
      horizontal < horizontalHouses &&
      vertical < verticalHouses &&
      horizontal >= 0 &&
      vertical >= 0
    ); // base is 0 ,limit is 7
  }

  async function walkTheHorse() {
    function showHorsePosition() {
      const [v, h] = pieces.horse.position();
      showPositionInChessBoard(v, h);
    }

    if (!pieces.horse) {
      console.log('Nenhum cavalo para Passear');
    }
    const moves = await pieces.horse.movesOfRide();
    moves.forEach((move) => {
      showPositionInChessBoard(move[0], move[1]);
    });

    resetBoard();
    pieces.horse.resetPosition();
    console.log('iniciando o passeio ...');
    await view.animatedMoves(moves);
    view.close();
  }
  function horsePosition() {
    return pieces.horse.position();
  }

  async function updateBoard(mil) {
    function sleep(mil) {
      new Promise((resolve) => setTimeout(resolve, mil));
    }
    await sleep(mil);
    await view.updateBoard(board, pieces.horse);
  }
  async function showFullBoard() {
    view.showFullBoard(board, pieces.horse);
  }
  return {
    value: board,
    showPosition: showPositionInChessBoard,
    addHorse: addHorse,
    validPosition: validPosition,
    walkTheHorse: walkTheHorse,
    fullyTraveled,
    showFullBoard,
    horsePosition,
    updateBoard,
  };
}

function convertLetterInNumber(letter) {
  const charCode = letter.toLowerCase().charCodeAt(0);
  const charIsInRange =
    charCode > START_OF_LOWER_CASE_LETTER_IN_UTF16 &&
    charCode < FINISH_OF_LOWER_CASE_LETTER_IN_UTF16;
  if (charIsInRange) {
    return charCode - START_OF_LOWER_CASE_LETTER_IN_UTF16;
  }
  console.log('Letra Fora do Range Permitido!');
  return undefined;
}
function convertNumberInLetter(number) {
  let startOfLowerCaseLetterInUTF16 = 96; //next is a
  return String.fromCharCode(number + startOfLowerCaseLetterInUTF16);
}
