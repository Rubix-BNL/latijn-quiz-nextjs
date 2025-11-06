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
  onRestart: () => void;
}

export const QuizResults = memo(function QuizResults({
  score,
  total,
  percentage,
  cijfer,
  wrongAnswers,
  onRestart,
}: QuizResultsProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">Quiz Voltooid! 🎉</CardTitle>
          <CardDescription>Je hebt de quiz afgerond</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score overzicht */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-2xl font-bold">
                {score} / {total}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Percentage</p>
              <p className="text-2xl font-bold">{percentage}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cijfer</p>
              <p className="text-2xl font-bold">{cijfer}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fouten</p>
              <p className="text-2xl font-bold">{wrongAnswers.length}</p>
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
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} size="lg" className="w-full">
            Opnieuw Proberen
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
