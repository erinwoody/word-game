const express = require("express");
const wordRoutes = express.Router();
const fs = require("fs");
const words = fs
  .readFileSync("/usr/share/dict/words", "utf-8")
  .toUpperCase()
  .split("\n");
const session = require("express-session");

wordRoutes.post("/guess", (req, res) => {
  let game = req.session.game;
  let guessLetter = req.body.letterGuess.toUpperCase();
  let randomWord = req.session.game.word;

  if (alreadyGuessed(game, guessLetter)) {
    saveGame(req, game, "Already guessed");
  } else if (letterNotFound(game, guessLetter)) {
    game.wrongGuesses.push(guessLetter);
    game.turns -= 1;
    saveGame(req, game, "WRONG");
  } else {
    for (i = 0; i < game.word.length; i++) {
      if (game.word.charAt(i) === guessLetter) {
        game.displayArray[i] = guessLetter;
        console.log("this is the array: ", game.displayArray);
      }
    }

    let locationOfLetter = randomWord.indexOf(guessLetter);
    if (randomWord.includes(guessLetter) == true) {
      game.displayArray.splice(locationOfLetter, 1, guessLetter);
      saveGame(req, game, "Correct!");
    }
  }
  if (game.displayArray.join("") == randomWord) {
    saveGame(req, game, "You Win!");
  }
  if (game.turns < 2) {
    saveGame(req, game, `You Loose! The word was ${randomWord}`);
  }

  return res.render("index", game);
});

function saveGame(req, game, message) {
  game.message = message;
  req.session.game = game;
}
function letterNotFound(game, guessLetter) {
  return game.word.indexOf(guessLetter) < 0;
}
function alreadyGuessed(game, guessLetter) {
  return (
    game.wrongGuesses.indexOf(guessLetter) > -1 ||
    game.correctGuesses.indexOf(guessLetter) < -1
  );
}

module.exports = wordRoutes;
