"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getVocabularyItems, shuffleArray } from "@/data/vocabulary";
import {
  normalizeAnswer,
  getNormalizedTranslations,
  generateHint,
  calculateGrade,
  calculatePercentage,
} from "@/lib/quiz-utils";
import type { QuizItem, WrongAnswer, QuizState } from "@/types/quiz";

export function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("not-started");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [hint, setHint] = useState<{ text: string; letter: string; length: number } | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize currentItem en progress voor betere performance
  const currentItem = useMemo(() => items[currentIndex], [items, currentIndex]);
  const progress = useMemo(
    () => (items.length > 0 ? (currentIndex / items.length) * 100 : 0),
    [currentIndex, items.length]
  );

  // Memoize vocabulary items count voor "not-started" state
  const totalVocabItems = useMemo(() => getVocabularyItems().length, []);

  const startQuiz = useCallback(() => {
    const vocabItems = getVocabularyItems();
    const shuffled = shuffleArray(vocabItems);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    setHintUsed(false);
    setUserAnswer("");
    setFeedback("");
    setHint(null);
    setShowCorrectAnswer(false);
    setQuizState("in-progress");
  }, []);

  const moveToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= items.length) {
      setQuizState("finished");
    } else {
      setCurrentIndex(nextIndex);
      setHintUsed(false);
      setUserAnswer("");
      setFeedback("");
      setHint(null);
      setShowCorrectAnswer(false);
    }
  }, [currentIndex, items.length]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentItem || userAnswer.trim() === "") return;

      const normalized = normalizeAnswer(userAnswer);
      const correctTranslations = getNormalizedTranslations(currentItem.translations);

      if (correctTranslations.includes(normalized)) {
        // Correct!
        const points = hintUsed ? 0.5 : 1;
        setScore(prev => prev + points);
        setFeedback(`✓ Correct! (+${points} ${points === 1 ? "punt" : "punten"})`);

        setTimeout(() => {
          moveToNext();
        }, 1000);
      } else {
        // Fout
        if (!hintUsed) {
          // Eerste poging - geef hint
          const hintData = generateHint(currentItem.translations);
          setHint({
            text: hintData.hint,
            letter: hintData.eersteLettera,
            length: hintData.length,
          });
          setHintUsed(true);
          setFeedback("✗ Niet helemaal... Probeer het nog eens met de hint!");
          setUserAnswer("");
        } else {
          // Tweede poging ook fout
          setWrongAnswers(prev => [
            ...prev,
            {
              latin: currentItem.latin,
              translations: currentItem.translations,
              userAnswer: userAnswer,
            },
          ]);
          setFeedback(`✗ Helaas! Het juiste antwoord was: ${currentItem.translations.join(", ")}`);
          setShowCorrectAnswer(true);

          setTimeout(() => {
            moveToNext();
          }, 2500);
        }
      }
    },
    [currentItem, userAnswer, hintUsed, moveToNext]
  );

  useEffect(() => {
    if (quizState === "in-progress" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, quizState]);

  // Not started state - lazy load component
  if (quizState === "not-started") {
    const QuizStartLazy = require("@/components/quiz-start").QuizStart;
    return <QuizStartLazy totalVocabItems={totalVocabItems} onStartQuiz={startQuiz} />;
  }

  // Finished state - lazy load component
  if (quizState === "finished") {
    const total = items.length;
    const percentage = calculatePercentage(score, total);
    const cijfer = calculateGrade(score, total);

    const QuizResultsLazy = require("@/components/quiz-results").QuizResults;
    return (
      <QuizResultsLazy
        score={score}
        total={total}
        percentage={percentage}
        cijfer={cijfer}
        wrongAnswers={wrongAnswers}
        onRestart={startQuiz}
      />
    );
  }

  // In-progress state - lazy load component
  const QuizQuestionLazy = require("@/components/quiz-question").QuizQuestion;
  return (
    <QuizQuestionLazy
      currentIndex={currentIndex}
      totalItems={items.length}
      score={score}
      progress={progress}
      latinWord={currentItem?.latin || ""}
      userAnswer={userAnswer}
      hint={hint}
      feedback={feedback}
      showCorrectAnswer={showCorrectAnswer}
      inputRef={inputRef}
      onAnswerChange={setUserAnswer}
      onSubmit={handleSubmit}
    />
  );
}
