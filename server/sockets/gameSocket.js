import { GameEngine } from "../game/gameEngine.js";
import { GAME_STATES } from "../../shared/constants.js";
import questions from "../data/questions.json" assert { type: "json" };

const game = new GameEngine(questions);

export function gameSocket(io) {
  io.on("connection", socket => {
    console.log("🟢 Connected:", socket.id);

    /* ===== JOIN ===== */
    socket.on("JOIN", name => {
      game.addPlayer({ id: socket.id, name });

      io.emit("PLAYERS_UPDATE", game.getPlayers());
      socket.emit("STATE_UPDATE", {
        state: game.getState(),
        question: game.getCurrentQuestion(),
        players: game.getPlayers()
      });
    });

    /* ===== START GAME ===== */
    socket.on("START_GAME", () => {
      game.startGame();

      io.emit("STATE_UPDATE", {
        state: game.getState(),
        question: game.getCurrentQuestion(),
        players: game.getPlayers()
      });
    });

    /* ===== ANSWER ===== */
    socket.on("ANSWER", answerIndex => {
      game.submitAnswer(socket.id, answerIndex);
    });

    /* ===== CLOSE QUESTION ===== */
    socket.on("CLOSE_QUESTION", () => {
      game.closeQuestion();

      io.emit("SCORE_UPDATE", {
        state: GAME_STATES.SCORE,
        players: game.getPlayers()
      });
    });

    /* ===== NEXT ROUND ===== */
    socket.on("NEXT_ROUND", () => {
      game.nextRound();

      io.emit("STATE_UPDATE", {
        state: game.getState(),
        question:
          game.getState() === GAME_STATES.QUESTION
            ? game.getCurrentQuestion()
            : null,
        players: game.getPlayers()
      });
    });

    /* ===== DISCONNECT ===== */
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
}
