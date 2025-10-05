import React, { useState, useEffect } from "react";
import "./Game.css";

interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  totalMatches: number;
  winRate: number;
  level: number;
  experience: number;
}

interface MatchInfo {
  matchId: string;
  type: string;
  status: string;
  players: Array<{
    playerId: number;
    choice?: string;
    status: string;
    isWinner?: boolean;
  }>;
}

const Game = () => {
  const [isGameActive, setGameActive] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchInfo | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("waiting");
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [botChoice, setBotChoice] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setLoading] = useState(false);

  const PLAYER_ID = 1; // Заглушка для тестирования

  // Загружаем статистику игрока при старте
  useEffect(() => {
    loadPlayerStats();
  }, []);

  // Таймер игры
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && gameStatus === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, gameStatus, timeLeft]);

  const loadPlayerStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/games/player/${PLAYER_ID}/stats`
      );
      const data = await response.json();
      if (data.success) {
        setPlayerStats(data.stats);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
  };

  const startNewGame = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/games/match/bot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: PLAYER_ID }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setCurrentMatch({
          matchId: data.matchId,
          type: data.type,
          status: data.status,
          players: [],
        });
        setGameActive(true);
        setGameStatus("playing");
        setTimeLeft(15);
        setPlayerChoice(null);
        setBotChoice(null);

        // Начинаем проверку статуса матча
        checkMatchStatus(data.matchId);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка создания игры:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkMatchStatus = async (matchId: string) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/games/match/${matchId}`
    );
    const data = await response.json();

    if (data.success) {
      const match = data.match;
      setCurrentMatch(match);

      if (match.status === "finished") {
        setGameStatus("finished");
        setGameActive(false);

        // Показываем результаты
        const players = match.players;
        const humanPlayer = players.find((p) => p.playerId === PLAYER_ID);
        const botPlayer = players.find((p) => p.playerId === -1);

        if (humanPlayer && botPlayer) {
          setPlayerChoice(humanPlayer.choice || null);
          setBotChoice(botPlayer.choice || null);
        }

        // Обновляем статистику
        loadPlayerStats();
      } else {
        // Продолжаем проверку если игра еще идет
        setTimeout(() => checkMatchStatus(matchId), 1000);
      }
    }
  };

  const makeChoice = async (choice: "rock" | "scissors" | "paper") => {
    if (!currentMatch || playerChoice) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/games/match/${currentMatch.matchId}/choice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId: PLAYER_ID,
            choice,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setPlayerChoice(choice);
      }
    } catch (error) {
      console.error("Ошибка выбора:", error);
    }
  };

  const resetGame = () => {
    setGameActive(false);
    setCurrentMatch(null);
    setGameStatus("waiting");
    setPlayerChoice(null);
    setBotChoice(null);
    setTimeLeft(15);
  };

  const getChoiceEmoji = (choice: string | null) => {
    switch (choice) {
      case "rock":
        return "🤲"; // Камень
      case "paper":
        return "✋"; // Бумага
      case "scissors":
        return "✌️"; // Ножницы
      default:
        return "❓";
    }
  };

  const getChoiceName = (choice: string | null) => {
    switch (choice) {
      case "rock":
        return "КАМЕНЬ";
      case "paper":
        return "БУМАГА";
      case "scissors":
        return "НОЖНИЦЫ";
      default:
        return "?";
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>🎮 ЦУ Е ФА</h1>
        <h2>Камень • Ножницы • Бумага</h2>
      </div>

      <div className="stats-panel">
        {playerStats && (
          <div className="stats">
            <div className="stat-item">
              <span>🏆 Побед: {playerStats.wins}</span>
            </div>
            <div className="stat-item">
              <span>😞 Поражений: {playerStats.losses}</span>
            </div>
            <div className="stat-item">
              <span>🤝 Ничьих: {playerStats.draws}</span>
            </div>
            <div className="stat-item">
              <span>📊 Победность: {playerStats.winRate.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span>⭐ Уровень: {playerStats.level}</span>
            </div>
          </div>
        )}
      </div>

      <div className="game-area">
        {!isGameActive ? (
          <div className="start-screen">
            <div className="rules">
              <h3>🎯 Правила игры:</h3>
              <p>• Камень побеждает ножницы</p>
              <p>• Ножницы побеждают бумагу</p>
              <p>• Бумага побеждает камень</p>
              <p>• На выбор дается 15 секунд</p>
            </div>
            <button
              className="start-button"
              onClick={startNewGame}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "🎮 Играть с ботом"}
            </button>
          </div>
        ) : (
          <div className="waiting-screen">
            {gameStatus === "playing" && (
              <div className="play-area">
                <div className="timer">⏱️ Осталось: {timeLeft}с</div>

                {playerChoice ? (
                  <div className="waiting-message">
                    <div className="player-choice">
                      <div className="choice-large">
                        {getChoiceEmoji(playerChoice)}
                      </div>
                      <div>{getChoiceName(playerChoice)}</div>
                    </div>
                    <p>Ждем выбор бота...</p>
                  </div>
                ) : (
                  <div className="choice-buttons">
                    <h3>Сделайте ваш выбор:</h3>
                    <div className="buttons">
                      <button
                        className="choice-button rock"
                        onClick={() => makeChoice("rock")}
                      >
                        🤲 Камень
                      </button>
                      <button
                        className="choice-button paper"
                        onClick={() => makeChoice("paper")}
                      >
                        ✋ Бумага
                      </button>
                      <button
                        className="choice-button scissors"
                        onClick={() => makeChoice("scissors")}
                      >
                        ✌️ Ножницы
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {gameStatus === "finished" && currentMatch && (
              <div className="results-screen">
                <h3>Результат матча:</h3>
                <div className="battle-area">
                  <div className="player-result">
                    <div className="choice-large">
                      {getChoiceEmoji(playerChoice)}
                    </div>
                    <div>{getChoiceName(playerChoice)}</div>
                    <div className="label">Вы</div>
                  </div>
                  <div className="vs">VS</div>
                  <div className="bot-result">
                    <div className="choice-large">
                      {getChoiceEmoji(botChoice)}
                    </div>
                    <div>{getChoiceName(botChoice)}</div>
                    <div className="label">Бот</div>
                  </div>
                </div>

                <div className="result-message">
                  {(() => {
                    const humanPlayer = currentMatch.players.find(
                      (p) => p.playerId === PLAYER_ID
                    );
                    if (humanPlayer?.isWinner) {
                      return (
                        <div className="win">🎉 Поздравляем! Вы выиграли!</div>
                      );
                    } else if (
                      currentMatch.players.length === 2 &&
                      currentMatch.players.every((p) => !p.isWinner)
                    ) {
                      return <div className="draw">🤝 Ничья!</div>;
                    } else {
                      return <div className="lose">😔 Вы проиграли...</div>;
                    }
                  })()}
                </div>

                <button className="play-again-button" onClick={resetGame}>
                  🔄 Играть снова
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
