"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizStartProps {
  totalVocabItems: number;
  onStartQuiz: () => void;
}

export const QuizStart = memo(function QuizStart({ totalVocabItems, onStartQuiz }: QuizStartProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">Latijn Quiz</CardTitle>
          <CardDescription className="text-base">
            Test je Latijns-Nederlandse woordenschat!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📚 {totalVocabItems} woorden</p>
            <p>🎯 Maximaal 1 punt per woord</p>
            <p>💡 Bij een fout antwoord krijg je een hint (0.5 punt)</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onStartQuiz} size="lg" className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
