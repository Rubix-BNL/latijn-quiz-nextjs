/**
 * Latijns-Nederlandse woordenschat database
 * Georganiseerd per hoofdstuk uit het leerboek
 */

export type VocabularyItem = {
  latin: string;
  translations: string[];
};

export type VocabularyMap = Record<string, string[]>;

export const VOCAB: VocabularyMap = {
  // Hoofdstuk 8 – Triumphus
  "ante": ["voor"],
  "aut": ["of"],
  "complere": ["vullen"],
  "curare": ["verzorgen", "zorgen voor"],
  "emere": ["kopen"],
  "filia": ["dochter"],
  "fortasse": ["misschien"],
  "habere": ["hebben"],
  "hic": ["hier"],
  "immo": ["integendeel"],
  "incipere": ["beginnen"],
  "initium": ["begin"],
  "manere": ["blijven"],
  "nihil": ["niets"],
  "nonne": ["zeker wel", "toch zeker wel"],
  "pecunia": ["geld"],
  "poculum": ["beker"],
  "quando": ["wanneer"],
  "quod": ["omdat", "datgene wat", "wat"],
  "respondere": ["antwoorden"],
  "rogare": ["vragen"],
  "soror": ["zus"],
  "spectator": ["toeschouwer"],
  "sub": ["onder"],
  "vetare": ["verbieden"],
  "via": ["weg", "straat"],

  // Hoofdstuk 10 – Spectacula
  "a / ab": ["vanaf", "door"],
  "agmen": ["rij", "stoet"],
  "caput": ["hoofd"],
  "corpus": ["lichaam"],
  "enim": ["immers", "want"],
  "frustra": ["tevergeefs"],
  "homo": ["mens", "man"],
  "leo": ["leeuw"],
  "longe": ["ver", "ver weg", "verreweg"],
  "pendere": ["hangen"],
  "per": ["door", "doorheen", "gedurende", "over", "overheen"],
  "pes": ["voet", "poot"],
  "petere": ["aanvallen"],
  "procedere": ["voortgaan", "lopen"],
  "resistere": ["weerstand bieden"],
  "salutare": ["begroeten", "groeten", "(be)groeten"],
  "tenere": ["vasthouden"],
  "terra": ["aarde", "grond"],
  "umbra": ["schaduw"],
  "vinum": ["wijn"],
  "vulnerare": ["verwonden"],
  "spectare": ["kijken", "kijken naar"],
  "superare": ["overtreffen", "overwinnen"],
  "ubique": ["overal"],
  "valde": ["zeer", "erg"],

  // Hoofdstuk 9 – Gladiatores
  "cito": ["snel"],
  "claudere": ["sluiten"],
  "currere": ["rennen"],
  "deinde": ["daarna"],
  "domi": ["thuis"],
  "finire": ["beëindigen"],
  "fluere": ["stromen"],
  "gaudere": ["blij zijn"],
  "hodie": ["vandaag"],
  "ita": ["zo"],
  "iterum": ["weer", "opnieuw"],
  "nemo": ["niemand"],
  "numquam": ["nooit"],
  "nuntiare": ["berichten", "aankondigen"],
  "oculus": ["oog"],
  "posse": ["kunnen"],
  "quid": ["wat"],
  "quis": ["wie"],
  "quo": ["waarheen", "waarteheen"],
  "sanguis": ["bloed"],
  "spectaculum": ["voorstelling"],
};

// Pre-computed vocabulary items (cached bij module load)
let cachedVocabularyItems: VocabularyItem[] | null = null;

// LocalStorage keys
const CUSTOM_VOCAB_KEY = "quiz-custom-vocabulary";
const REMOVED_VOCAB_KEY = "quiz-removed-vocabulary";

/**
 * Haal custom vocabulaire op uit localStorage
 */
export function getCustomVocabulary(): VocabularyMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CUSTOM_VOCAB_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Haal lijst van verwijderde standaard woorden op uit localStorage
 */
export function getRemovedVocabulary(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(REMOVED_VOCAB_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Sla verwijderde woorden lijst op in localStorage
 */
function saveRemovedVocabulary(removed: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REMOVED_VOCAB_KEY, JSON.stringify(removed));
    // Reset cache zodat wijzigingen zichtbaar worden
    cachedVocabularyItems = null;
  } catch (error) {
    console.error("Kon verwijderde lijst niet opslaan:", error);
  }
}

/**
 * Sla custom vocabulaire op in localStorage
 */
export function saveCustomVocabulary(vocab: VocabularyMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_VOCAB_KEY, JSON.stringify(vocab));
    // Reset cache zodat nieuwe vocabulaire wordt opgehaald
    cachedVocabularyItems = null;
  } catch (error) {
    console.error("Kon vocabulaire niet opslaan:", error);
  }
}

/**
 * Voeg een nieuw vocabulaire item toe
 */
export function addVocabularyItem(latin: string, translations: string[]): void {
  const customVocab = getCustomVocabulary();
  customVocab[latin] = translations;
  saveCustomVocabulary(customVocab);
}

/**
 * Verwijder een vocabulaire item
 * Als het een custom woord is, verwijder uit custom vocab
 * Als het een standaard woord is, voeg toe aan removed lijst
 */
export function removeVocabularyItem(latin: string): void {
  const customVocab = getCustomVocabulary();

  // Check of het een custom woord is
  if (customVocab[latin]) {
    // Verwijder uit custom vocab
    delete customVocab[latin];
    saveCustomVocabulary(customVocab);
  } else if (VOCAB[latin]) {
    // Het is een standaard woord, voeg toe aan removed lijst
    const removed = getRemovedVocabulary();
    if (!removed.includes(latin)) {
      removed.push(latin);
      saveRemovedVocabulary(removed);
    }
  }
}

/**
 * Herstel een verwijderd standaard woord
 */
export function restoreVocabularyItem(latin: string): void {
  const removed = getRemovedVocabulary();
  const index = removed.indexOf(latin);
  if (index > -1) {
    removed.splice(index, 1);
    saveRemovedVocabulary(removed);
  }
}

/**
 * Importeer meerdere vocabulaire items in bulk
 */
export function importVocabularyItems(items: Array<{ latin: string; translations: string[] }>): void {
  const customVocab = getCustomVocabulary();

  items.forEach(({ latin, translations }) => {
    if (latin && translations && translations.length > 0) {
      customVocab[latin.trim()] = translations.map(t => t.trim()).filter(t => t.length > 0);
    }
  });

  saveCustomVocabulary(customVocab);
}

/**
 * Haal alle vocabulaire op (standaard + custom, exclusief removed)
 */
export function getAllVocabulary(): { latin: string; translations: string[]; isCustom: boolean }[] {
  const customVocab = getCustomVocabulary();
  const removed = getRemovedVocabulary();

  const result: { latin: string; translations: string[]; isCustom: boolean }[] = [];

  // Voeg standaard vocabulaire toe (exclusief removed)
  Object.entries(VOCAB).forEach(([latin, translations]) => {
    if (!removed.includes(latin)) {
      result.push({ latin, translations, isCustom: false });
    }
  });

  // Voeg custom vocabulaire toe
  Object.entries(customVocab).forEach(([latin, translations]) => {
    result.push({ latin, translations, isCustom: true });
  });

  return result.sort((a, b) => a.latin.localeCompare(b.latin));
}

/**
 * Converteer de vocabulary map naar een array van items
 * Met caching voor betere performance
 * Combineert standaard vocabulaire met custom vocabulaire uit localStorage
 * Filtert verwijderde standaard woorden eruit
 */
export function getVocabularyItems(): VocabularyItem[] {
  if (cachedVocabularyItems === null) {
    const customVocab = getCustomVocabulary();
    const removed = getRemovedVocabulary();

    // Start met standaard vocabulaire, filter removed woorden
    const filteredVocab: VocabularyMap = {};
    Object.entries(VOCAB).forEach(([latin, translations]) => {
      if (!removed.includes(latin)) {
        filteredVocab[latin] = translations;
      }
    });

    // Combineer met custom vocabulaire
    const combinedVocab = { ...filteredVocab, ...customVocab };

    cachedVocabularyItems = Object.entries(combinedVocab).map(([latin, translations]) => ({
      latin,
      translations,
    }));
  }
  return cachedVocabularyItems;
}

/**
 * Shuffle een array (Fisher-Yates shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
