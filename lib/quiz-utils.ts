/**
 * Quiz utility functies voor normalisatie, hints en scoring
 */

/**
 * Normaliseer een antwoord voor vergelijking
 * - Converteert naar lowercase
 * - Verwijdert optionele prefix zoals "(be)"
 * - Stripped whitespace
 */
export function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\(be\)/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "");
}

// Cache voor genormaliseerde vertalingen
const translationCache = new Map<string, string[]>();

/**
 * Haal alle genormaliseerde vertalingen op, inclusief alternatieven
 * gesplitst door komma's en slashes
 *
 * Gebruikt caching voor betere performance bij herhaalde lookups
 */
export function getNormalizedTranslations(translations: string[]): string[] {
  // Maak cache key van translations array
  const cacheKey = translations.join("|");

  // Check cache
  const cached = translationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Bereken normalized translations
  const normalized: string[] = [];

  for (const t of translations) {
    const base = t
      .toLowerCase()
      .replace(/\(be\)/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "");

    // Split op komma's en slashes
    const parts = base
      .replace(/\//g, ",")
      .split(",")
      .map(p => p.trim())
      .filter(p => p.length > 0);

    normalized.push(...parts);
  }

  // Sla op in cache
  translationCache.set(cacheKey, normalized);

  return normalized;
}

/**
 * Genereer een hint op basis van de kortste vertaling
 * Geeft de eerste ~1/3 van het woord (minimaal 2 letters)
 */
export function generateHint(translations: string[]): {
  hint: string;
  eersteLettera: string;
  length: number;
} {
  // Vind de kortste vertaling
  const kortste = translations.reduce((shortest, current) =>
    current.length < shortest.length ? current : shortest
  );

  const hintLength = Math.max(2, Math.floor(kortste.length / 3));
  const hint = kortste.substring(0, hintLength);
  const eersteLettera = kortste[0].toUpperCase();

  return {
    hint,
    eersteLettera,
    length: kortste.length,
  };
}

/**
 * Bereken het eindcijfer op een schaal van 1-10
 */
export function calculateGrade(score: number, total: number): number {
  if (total === 0) return 1;
  const percentage = score / total;
  const cijfer = Math.max(1.0, Math.min(10.0, percentage * 9 + 1));
  return Math.round(cijfer * 10) / 10; // Afronden op 1 decimaal
}

/**
 * Bereken het percentage correct
 */
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 1000) / 10; // Afronden op 1 decimaal
}
