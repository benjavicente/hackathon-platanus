import { useState } from "react";

interface DinoMultiplicationProps {
  group1: string;
  group2: string;
  handleSubmit: any;
}
const DinoMultiplication = ({ group1, group2, handleSubmit = () => {} }: DinoMultiplicationProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    const correctAnswer = group1 * group2;
    const userNum = parseInt(userAnswer);

    if (userNum === correctAnswer) {
      setFeedback("¡RAWR! ¡Correcto! 🦖");
      setIsCorrect(true);
      console.log("handlesubmit");
      console.log({ handleSubmit });
      handleSubmit(userNum.toString());
    } else {
      setFeedback("¡Ups! Cuenta todos los dinosaurios de nuevo 🦕");
      setIsCorrect(false);
      handleSubmit(userNum.toString());
    }
  };

  const Dinosaur = () => (
    <div className="w-12 h-12 inline-block transform transition-transform hover:scale-110">
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
    <div className="flex flex-wrap gap-1 justify-center items-center p-2">
      {Array.from({ length: count }, (_, i) => (
        <Dinosaur key={i} />
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <div className="text-center mb-4 text-xl font-bold text-green-700">
          {group1} grupos de {group2} dinosaurios
        </div>
        <div className="grid gap-2 bg-green-50 rounded-lg p-4 border-2 border-green-200">
          {Array.from({ length: group1 }, (_, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-green-700 font-bold">{i + 1}</div>
              <div className="border-2 border-green-200 rounded-lg bg-white">
                <DinoGroup count={group2} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-3xl font-bold mb-6">
        <span className="text-green-700">{group1}</span>
        <span className="text-green-700">×</span>
        <span className="text-green-700">{group2}</span>
        <span className="text-green-700">=</span>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-24 h-16 text-center border-4 border-green-300 rounded-lg focus:outline-none focus:border-green-500"
          placeholder="?"
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={checkAnswer}
          className="px-8 py-3 bg-green-500 text-white rounded-full text-xl font-bold hover:bg-green-600 transform transition-all hover:scale-105"
        >
          Comprobar
        </button>
      </div>

      {feedback && (
        <div
          className={`text-center mt-4 text-xl font-bold p-3 rounded-lg ${
            isCorrect ? "text-green-600 bg-green-50" : "text-orange-600 bg-orange-50"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default DinoMultiplication;
