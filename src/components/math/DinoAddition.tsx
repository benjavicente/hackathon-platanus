import { useState } from "react";

const DinoAddition = ({ maxNumber = 5, onCorrectAnswer = () => {} }) => {
  const [num1, setNum1] = useState(2);
  const [num2, setNum2] = useState(3);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNewProblem = () => {
    setNum1(Math.floor(Math.random() * maxNumber) + 1);
    setNum2(Math.floor(Math.random() * maxNumber) + 1);
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    const correctAnswer = num1 + num2;
    const userNum = parseInt(userAnswer);

    if (userNum === correctAnswer) {
      setFeedback("¡RAWR! ¡Correcto! 🦖");
      setIsCorrect(true);
      onCorrectAnswer();
    } else {
      setFeedback("¡Ups! Cuenta de nuevo los dinosaurios 🦕");
      setIsCorrect(false);
    }
  };

  const Dinosaur = () => (
    <div className="w-16 h-16 inline-block">
      <svg viewBox="0 0 100 100">
        {/* Cuerpo principal */}
        <path d="M20 70 Q30 40 50 40 L70 40 Q80 40 80 50 L80 70 Q80 80 70 80 L30 80 Q20 80 20 70" fill="#4CAF50" />
        {/* Cabeza */}
        <path d="M70 40 Q90 40 90 50 L90 55 Q90 60 85 60 L70 60" fill="#4CAF50" />
        {/* Ojo */}
        <circle cx="80" cy="50" r="3" fill="white" />
        <circle cx="80" cy="50" r="1.5" fill="black" />
        {/* Patas */}
        <rect x="30" y="80" width="8" height="15" fill="#4CAF50" />
        <rect x="60" y="80" width="8" height="15" fill="#4CAF50" />
        {/* Cola */}
        <path d="M20 60 Q10 60 10 70 L15 75 Q20 70 25 65" fill="#4CAF50" />
        {/* Picos */}
        <path d="M40 40 L45 30 L50 40 L55 30 L60 40" fill="#4CAF50" />
      </svg>
    </div>
  );

  const DinoGroup = ({ count }) => (
    <div className="flex flex-wrap gap-2 justify-center items-center min-h-32 p-4 bg-green-50 rounded-lg">
      {Array.from({ length: count }, (_, i) => (
        <Dinosaur key={i} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DinoGroup count={num1} />
        <DinoGroup count={num2} />
      </div>

      <div className="flex items-center justify-center gap-4 text-2xl font-bold mb-4">
        <span>{num1}</span>
        <span>+</span>
        <span>{num2}</span>
        <span>=</span>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-20 h-12 text-center border-2 rounded-lg"
          placeholder="?"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={checkAnswer} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Comprobar
        </button>
        <button onClick={generateNewProblem} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Nuevo
        </button>
      </div>

      {feedback && (
        <div className={`text-center mt-4 text-lg font-bold ${isCorrect ? "text-green-600" : "text-orange-500"}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default DinoAddition;
