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

/**
 * Converteer de vocabulary map naar een array van items
 * Met caching voor betere performance
 */
export function getVocabularyItems(): VocabularyItem[] {
  if (cachedVocabularyItems === null) {
    cachedVocabularyItems = Object.entries(VOCAB).map(([latin, translations]) => ({
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
