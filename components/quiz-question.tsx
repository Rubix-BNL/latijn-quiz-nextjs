"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface QuizQuestionProps {
  currentIndex: number;
  totalItems: number;
  score: number;
  progress: number;
  latinWord: string;
  userAnswer: string;
  hint: { text: string; letter: string; length: number } | null;
  feedback: string;
  showCorrectAnswer: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onAnswerChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const QuizQuestion = memo(function QuizQuestion({
  currentIndex,
  totalItems,
  score,
  progress,
  latinWord,
  userAnswer,
  hint,
  feedback,
  showCorrectAnswer,
  inputRef,
  onAnswerChange,
  onSubmit,
}: QuizQuestionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative z-10">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg border-b-2 border-indigo-100">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 font-semibold">
              Vraag {currentIndex + 1} / {totalItems}
            </Badge>
            <Badge className="bg-purple-600 text-white font-semibold">Score: {score}</Badge>
          </div>
          <Progress value={progress} className="mb-4 h-3" />
          <CardTitle className="text-5xl text-center mb-2 text-indigo-900 font-bold">{latinWord}</CardTitle>
          <CardDescription className="text-center text-base text-indigo-700">
            Wat is de Nederlandse vertaling?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type je antwoord..."
                disabled={showCorrectAnswer}
                className="text-lg"
              />

              {hint && (
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="text-sm font-medium">💡 Hint:</p>
                  <p className="text-sm">
                    Eerste letters:{" "}
                    <span className="font-mono font-bold">{hint.text}...</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Totale lengte: {hint.length} letters
                  </p>
                </div>
              )}

              {feedback && (
                <div
                  className={`p-3 rounded-lg ${
                    feedback.includes("✓")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="text-sm font-medium">{feedback}</p>
                </div>
              )}
            </div>

            {!showCorrectAnswer && (
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold"
                size="lg"
              >
                Controleer Antwoord
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
});
