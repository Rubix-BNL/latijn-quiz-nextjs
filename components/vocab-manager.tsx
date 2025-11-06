"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getAllVocabulary,
  addVocabularyItem,
  removeVocabularyItem,
  importVocabularyItems,
} from "@/data/vocabulary";
import * as XLSX from "xlsx";

interface VocabManagerProps {
  onClose: () => void;
}

type Tab = "add" | "manage" | "import";

export const VocabManager = memo(function VocabManager({ onClose }: VocabManagerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("add");
  const [allVocab, setAllVocab] = useState<Array<{ latin: string; translations: string[]; isCustom: boolean }>>([]);
  const [latinWord, setLatinWord] = useState("");
  const [dutchTranslations, setDutchTranslations] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all vocabulary
  const refreshVocab = () => {
    setAllVocab(getAllVocabulary());
  };

  useEffect(() => {
    refreshVocab();
  }, []);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (!latinWord.trim() || !dutchTranslations.trim()) {
      showFeedback("error", "Vul beide velden in!");
      return;
    }

    // Split translations op komma's
    const translations = dutchTranslations
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (translations.length === 0) {
      showFeedback("error", "Voeg minimaal één vertaling toe!");
      return;
    }

    try {
      addVocabularyItem(latinWord.trim(), translations);
      refreshVocab();
      setLatinWord("");
      setDutchTranslations("");
      showFeedback("success", `✓ "${latinWord}" toegevoegd!`);
    } catch (error) {
      showFeedback("error", "Kon woord niet toevoegen");
    }
  };

  const handleRemove = (latin: string) => {
    try {
      removeVocabularyItem(latin);
      refreshVocab();
      showFeedback("success", `✓ "${latin}" verwijderd`);
    } catch (error) {
      showFeedback("error", "Kon woord niet verwijderen");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Neem het eerste sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1 });

        // Parse de data (verwacht: kolom 0 = Latijn, kolom 1 = Nederlands)
        const items: Array<{ latin: string; translations: string[] }> = [];

        jsonData.forEach((row, index) => {
          // Skip header row als die bestaat
          if (index === 0 && (String(row[0]).toLowerCase().includes("latijn") || String(row[0]).toLowerCase().includes("latin"))) {
            return;
          }

          const latin = String(row[0] || "").trim();
          const dutchCell = String(row[1] || "").trim();

          if (latin && dutchCell) {
            // Split Nederlandse vertalingen op komma's, slashes of puntkomma's
            const translations = dutchCell
              .split(/[,;\/]/)
              .map(t => t.trim())
              .filter(t => t.length > 0);

            if (translations.length > 0) {
              items.push({ latin, translations });
            }
          }
        });

        if (items.length === 0) {
          showFeedback("error", "Geen geldige woorden gevonden in het bestand");
          return;
        }

        // Importeer de woorden
        importVocabularyItems(items);
        refreshVocab();
        showFeedback("success", `✓ ${items.length} woorden geïmporteerd!`);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Import error:", error);
        showFeedback("error", "Kon Excel bestand niet lezen. Zorg dat het formaat correct is.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const filteredVocab = allVocab.filter((item) =>
    item.latin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.translations.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customCount = allVocab.filter(v => v.isCustom).length;
  const standardCount = allVocab.filter(v => !v.isCustom).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative z-10">
      <Card className="w-full max-w-4xl shadow-2xl border-2 border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">📚 Vocabulaire Beheren</CardTitle>
          <CardDescription className="text-indigo-100 text-base">
            {standardCount} standaard woorden • {customCount} aangepaste woorden • {allVocab.length} totaal
          </CardDescription>
        </CardHeader>

        {/* Tabs */}
        <div className="flex border-b-2 border-indigo-100">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === "add"
                ? "bg-indigo-50 text-indigo-700 border-b-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            ➕ Toevoegen
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === "manage"
                ? "bg-indigo-50 text-indigo-700 border-b-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📝 Beheren
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-3 px-4 font-semibold transition-colors ${
              activeTab === "import"
                ? "bg-indigo-50 text-indigo-700 border-b-4 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📥 Importeren
          </button>
        </div>

        <CardContent className="space-y-6 pt-6">
          {/* Feedback melding */}
          {feedback && (
            <div
              className={`p-3 rounded-lg text-center font-medium ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-800 border-2 border-green-300"
                  : "bg-red-100 text-red-800 border-2 border-red-300"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Tab: Toevoegen */}
          {activeTab === "add" && (
            <form onSubmit={handleAdd} className="space-y-4 p-4 bg-indigo-50 rounded-lg">
              <div className="space-y-2">
                <label htmlFor="latin" className="text-sm font-medium text-gray-700">
                  Latijns woord:
                </label>
                <Input
                  id="latin"
                  type="text"
                  placeholder="bijv. aqua"
                  value={latinWord}
                  onChange={(e) => setLatinWord(e.target.value)}
                  className="text-base"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dutch" className="text-sm font-medium text-gray-700">
                  Nederlandse vertaling(en):
                </label>
                <Input
                  id="dutch"
                  type="text"
                  placeholder="bijv. water, nat (meerdere gescheiden door komma's)"
                  value={dutchTranslations}
                  onChange={(e) => setDutchTranslations(e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Gebruik komma's om meerdere vertalingen toe te voegen
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
              >
                + Woord Toevoegen
              </Button>
            </form>
          )}

          {/* Tab: Beheren */}
          {activeTab === "manage" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-gray-700">
                  Zoeken:
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Zoek op Latijns woord of Nederlandse vertaling..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-base"
                />
              </div>

              {filteredVocab.length === 0 ? (
                <div className="text-center p-8 bg-muted rounded-lg text-muted-foreground">
                  <p>Geen woorden gevonden.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredVocab.map(({ latin, translations, isCustom }) => (
                    <div
                      key={latin}
                      className="p-3 bg-white border-2 border-indigo-100 rounded-lg flex justify-between items-start hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-indigo-900">{latin}</p>
                          {isCustom ? (
                            <Badge className="bg-green-600 text-white text-xs">Aangepast</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Standaard</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{translations.join(", ")}</p>
                      </div>
                      <Button
                        onClick={() => handleRemove(latin)}
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                      >
                        Verwijder
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Importeren */}
          {activeTab === "import" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg text-blue-900">📋 Excel Format</h3>
                <p className="text-sm text-blue-800">
                  Upload een Excel bestand (.xlsx of .xls) met de volgende structuur:
                </p>
                <div className="bg-white p-3 rounded border border-blue-200 font-mono text-sm">
                  <div className="font-bold mb-2">Kolom A (Latijn) | Kolom B (Nederlands)</div>
                  <div>aqua | water</div>
                  <div>homo | mens, man</div>
                  <div>via | weg, straat</div>
                </div>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Eerste rij kan een header bevatten (wordt automatisch geskipt)</li>
                  <li>Meerdere vertalingen scheiden met komma's, puntkomma's of slashes</li>
                  <li>Lege rijen worden overgeslagen</li>
                </ul>
              </div>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-semibold text-lg"
                  size="lg"
                >
                  📥 Excel Bestand Kiezen
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Ondersteunt .xlsx en .xls formaten
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-6 border-t-2 border-indigo-100 pt-6">
          <Button
            onClick={onClose}
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold"
          >
            Terug naar Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
});
