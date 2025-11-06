"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QuizStartProps {
  totalVocabItems: number;
  onStartQuiz: (playerName: string, targetGrade: number) => void;
  onManageVocab: () => void;
}

export const QuizStart = memo(function QuizStart({ totalVocabItems, onStartQuiz, onManageVocab }: QuizStartProps) {
  const [name, setName] = useState("");
  const [targetGrade, setTargetGrade] = useState<number>(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStartQuiz(name.trim(), targetGrade);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative z-10">
      <Card className="w-full max-w-md shadow-2xl border-2 border-indigo-100">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-4xl mb-2 font-bold">🏛️ Latijn Quiz</CardTitle>
          <CardDescription className="text-indigo-100 text-base">
            Test je Latijns-Nederlandse woordenschat!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-sm text-muted-foreground text-center bg-indigo-50 p-4 rounded-lg">
            <p className="font-semibold text-indigo-900">📚 {totalVocabItems} woorden</p>
            <p>🎯 Maximaal 1 punt per woord</p>
            <p>💡 Bij een fout antwoord krijg je een hint (0.5 punt)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Jouw naam:
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Vul je naam in..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-base"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="targetGrade" className="text-sm font-medium text-gray-700">
                Gewenst cijfer (1-10):
              </label>
              <div className="flex items-center gap-4">
                <Input
                  id="targetGrade"
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
                  required
                  className="text-base"
                />
                <div className="text-2xl font-bold text-indigo-600 min-w-[3rem] text-center">
                  {targetGrade}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Dit is je persoonlijke doelstelling voor deze quiz
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-6">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold"
            disabled={!name.trim()}
          >
            Start Quiz
          </Button>
          <Button
            onClick={onManageVocab}
            size="lg"
            variant="outline"
            className="w-full border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-semibold"
          >
            📚 Beheer Vocabulaire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
