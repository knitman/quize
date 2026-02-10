import { useEffect, useState } from "react";
import { socket } from "./services/socket";

export default function App() {
  const [state, setState] = useState("WAITING");
  const [question, setQuestion] = useState(null);
  const [players, setPlayers] = useState([]);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const name = "Player-" + Math.floor(Math.random() * 1000);
    socket.emit("JOIN", name);

    socket.on("STATE_UPDATE", data => {
      setState(data.state);
      setQuestion(data.question);
      if (data.players) setPlayers(data.players);
      setAnswered(false);
    });

    socket.on("PLAYERS_UPDATE", players => {
      setPlayers(players);
    });

    socket.on("SCORE_UPDATE", data => {
      setState(data.state);
      setPlayers(data.players);
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, []);

  /* ========== UI STATES ========== */

  if (state === "WAITING") {
    return (
      <div>
        <h1>🧠 Quiz Game</h1>
        <button onClick={() => socket.emit("START_GAME")}>
          ▶ Start Game
        </button>
      </div>
    );
  }

  if (state === "QUESTION" && question) {
    return (
      <div>
        <h2>{question.text}</h2>

        {question.options.map((opt, index) => (
          <button
            key={index}
            disabled={answered}
            onClick={() => {
              socket.emit("ANSWER", index);
              setAnswered(true);
            }}
          >
            {opt}
          </button>
        ))}

        <div>
          <button onClick={() => socket.emit("CLOSE_QUESTION")}>
            🔒 Κλείδωμα Ερώτησης
          </button>
        </div>
      </div>
    );
  }

  if (state === "SCORE") {
    return (
      <div>
        <h2>📊 Σκορ</h2>

        {players.map(p => (
          <div key={p.id}>
            {p.name}: <b>{p.score}</b>
          </div>
        ))}

        <button onClick={() => socket.emit("NEXT_ROUND")}>
          ➡ Επόμενη Ερώτηση
        </button>
      </div>
    );
  }

  if (state === "FINISHED") {
    return (
      <div>
        <h1>🎉 Τέλος Παιχνιδιού</h1>
        {players.map(p => (
          <div key={p.id}>
            {p.name}: {p.score}
          </div>
        ))}
      </div>
    );
  }

  return <h1>⏳ Loading…</h1>;
}
