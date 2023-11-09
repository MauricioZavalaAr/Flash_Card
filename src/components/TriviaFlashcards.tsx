import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/TriviaFlashcards.css';

const TriviaFlashcards: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(1);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(true);

  const resetFlashcards = () => {
    setFlashcards([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer('');
    setIsCardFlipped(false); 
  };

  const shuffleArray = (array: any[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
   
    axios
      .get('https://opentdb.com/api_category.php')
      .then((response) => setCategories(response.data.trivia_categories))
      .catch((error) => console.error(error));
  }, []);

  const fetchQuestions = () => {
    resetFlashcards(); 

    axios
      .get(
        `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${selectedCategory}&type=multiple`
      )
      .then((response) => {
        setFlashcards(response.data.results);
      })
      .catch((error) => console.error(error));
  };

  const handleNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer('');
      setIsCardFlipped(false); 
    } else {
      
      setCurrentIndex(flashcards.length);
    }
  };

  const handleCardClick = () => {
    flipCard(); 
  };

  const flipCard = () => {
    const cardInner = document.querySelector('.card-inner');
    if (cardInner) {
      cardInner.classList.toggle('flipped');
    }
  };

  const handleAnswerClick = (selectedAnswer: string) => {
    if (selectedAnswer === flashcards[currentIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer(selectedAnswer);

    
    if (selectedAnswer !== flashcards[currentIndex].correct_answer) {
      flipCard();
    }
  };

  return (
    <div>
      <h1>Trivia Flashcards</h1>
      <p>Score: {score}/{currentIndex}</p>
      <div>
        <label>
          Select a Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Number of Questions:
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
          />
        </label>
      </div>
      <button onClick={fetchQuestions}>Generate Questions</button>
      {flashcards.length > 0 && currentIndex < flashcards.length && (
        <div>
          <div
            className={`flashcard ${isCardFlipped ? "flipped" : ""}`}
            onClick={handleCardClick} 
          >
            <div className="card-inner">
              <div className="card-front">
                <h2>Question {currentIndex + 1}</h2>
                <p>{flashcards[currentIndex].question}</p>
                {!selectedAnswer && (
                  <ul>
                    {shuffleArray([
                      ...flashcards[currentIndex].incorrect_answers,
                      flashcards[currentIndex].correct_answer,
                    ]).map((answer: string, index: number) => (
                      <li
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "white",
                        }}
                      >
                        {answer}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-back">
                <p>Your Answer: {selectedAnswer}</p>
                <p>Correct Answer: {flashcards[currentIndex].correct_answer}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentIndex === flashcards.length && (
        <p>No more questions. You've completed the trivia!</p>
      )}
      {currentIndex < flashcards.length && (
        <button onClick={handleNextCard}>Next Question</button>
      )}
    </div>
  );
};

export default TriviaFlashcards;