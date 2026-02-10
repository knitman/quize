// server/game/gameEngine.js
import { GAME_STATES } from "../../shared/constants.js";

export class GameEngine {
  constructor(questions) {
    this.questions = questions;
    this.state = GAME_STATES.WAITING;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.players = [];
  }

  addPlayer(player) {
    if (!this.players.find(p => p.id === player.id)) {
      this.players.push({ ...player, score: 0 });
    }
  }

  startGame() {
    this.state = GAME_STATES.QUESTION;
    this.currentQuestionIndex = 0;
    this.answers = {};
  }

  getCurrentQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    return {
      id: q.id,
      text: q.text,
      options: q.options
    };
  }

  submitAnswer(playerId, answerIndex) {
    if (this.state !== GAME_STATES.QUESTION) return;
    this.answers[playerId] = answerIndex;
  }

  closeQuestion() {
    this.state = GAME_STATES.SCORE;
    const correct = this.questions[this.currentQuestionIndex].correct;

    this.players.forEach(p => {
      if (this.answers[p.id] === correct) {
        p.score += 1;
      }
    });
  }

  nextRound() {
    this.currentQuestionIndex++;
    this.answers = {};

    if (this.currentQuestionIndex >= this.questions.length) {
      this.state = GAME_STATES.FINISHED;
    } else {
      this.state = GAME_STATES.QUESTION;
    }
  }
}
