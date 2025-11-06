"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WrongAnswer } from "@/types/quiz";

interface QuizResultsProps {
  score: number;
  total: number;
  percentage: number;
  cijfer: number;
  wrongAnswers: WrongAnswer[];
  playerName?: string;
  targetGrade?: number;
  onRestart: (playerName: string, targetGrade: number) => void;
}

export const QuizResults = memo(function QuizResults({
  score,
  total,
  percentage,
  cijfer,
  wrongAnswers,
  playerName,
  targetGrade,
  onRestart,
}: QuizResultsProps) {
  // Bepaal of het doel is behaald
  const goalAchieved = targetGrade ? cijfer >= targetGrade : false;
  const goalDifference = targetGrade ? cijfer - targetGrade : 0;

  // Motiverende boodschap op basis van prestatie
  const getMessage = () => {
    if (!targetGrade) return "Goed gedaan!";
    if (goalAchieved && goalDifference >= 2) return "Fantastisch! Je hebt je doel ruim overtroffen! 🌟";
    if (goalAchieved && goalDifference >= 1) return "Uitstekend! Je hebt je doel overtroffen! 🎯";
    if (goalAchieved) return "Geweldig! Je hebt je doel behaald! ✨";
    if (goalDifference >= -0.5) return "Bijna! Je zat heel dicht bij je doel! 💪";
    return "Blijf oefenen, je komt er wel! 📚";
  };

  const handleRestart = () => {
    onRestart(playerName || "", targetGrade || 6);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative z-10">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-indigo-100">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-4xl mb-2 font-bold">
            {playerName ? `${playerName}, quiz voltooid! 🎉` : "Quiz Voltooid! 🎉"}
          </CardTitle>
          <CardDescription className="text-indigo-100 text-lg font-medium">
            {getMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Doelbereik indicator */}
          {targetGrade && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              goalAchieved
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
            }`}>
              <p className="text-sm mb-1">
                {goalAchieved ? '✅ Doel behaald!' : '📊 Nog niet aan doel'}
              </p>
              <p className="text-lg">
                Behaald: <span className="text-2xl">{cijfer}</span>
                {" / "}
                Doel: <span className="text-2xl">{targetGrade}</span>
              </p>
            </div>
          )}

          {/* Score overzicht */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1 bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm text-indigo-700 font-medium">Score</p>
              <p className="text-2xl font-bold text-indigo-900">
                {score} / {total}
              </p>
            </div>
            <div className="space-y-1 bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-700 font-medium">Percentage</p>
              <p className="text-2xl font-bold text-purple-900">{percentage}%</p>
            </div>
            <div className="space-y-1 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Cijfer</p>
              <p className="text-2xl font-bold text-blue-900">{cijfer}</p>
            </div>
            <div className="space-y-1 bg-rose-50 p-3 rounded-lg">
              <p className="text-sm text-rose-700 font-medium">Fouten</p>
              <p className="text-2xl font-bold text-rose-900">{wrongAnswers.length}</p>
            </div>
          </div>

          {/* Foute antwoorden */}
          {wrongAnswers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Foute antwoorden:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {wrongAnswers.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium">{item.latin}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.translations.join(", ")}
                      </p>
                    </div>
                    {item.userAnswer && (
                      <Badge variant="destructive" className="ml-2">
                        {item.userAnswer}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button
            onClick={handleRestart}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold"
          >
            Opnieuw Proberen
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
