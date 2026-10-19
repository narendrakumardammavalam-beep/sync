/**
 * Analytical text metrics utility for editorial quality control.
 */

export interface TextMetrics {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  meetsWordCountRequirement: boolean;
  statusMessage: string;
}

export function countWords(text: string): number {
  if (!text) return 0;
  const matches = text.trim().match(/\b[\w'-]+\b/g);
  return matches ? matches.length : 0;
}

export function countSentences(text: string): number {
  if (!text) return 0;
  const matches = text.match(/[.!?]+(?:\s+|$)/g);
  return matches ? matches.length : 1;
}

export function countSyllablesInWord(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 0;
  if (cleanWord.length <= 3) return 1;

  const syllables = cleanWord
    .replace(/(?:[^laeiouy]|ed|es|e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g);

  return syllables ? syllables.length : 1;
}

export function countTotalSyllables(text: string): number {
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  return words.reduce((acc, word) => acc + countSyllablesInWord(word), 0);
}

export function calculateTextMetrics(allParagraphs: string[]): TextMetrics {
  const combinedText = allParagraphs.join('\n\n');
  const words = countWords(combinedText);
  const chars = combinedText.length;
  const paragraphs = allParagraphs.filter(p => p.trim().length > 0).length;
  const sentences = Math.max(1, countSentences(combinedText));
  const syllables = Math.max(1, countTotalSyllables(combinedText));

  // Average reading speed = 225 words per minute
  const readingTimeMinutes = Math.ceil(words / 225);

  // Flesch Reading Ease = 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const wordsPerSentence = words / sentences;
  const syllablesPerWord = syllables / Math.max(1, words);
  const fleschReadingEase = Math.max(
    0,
    Math.min(100, Math.round((206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord) * 10) / 10)
  );

  // Flesch-Kincaid Grade Level = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const fleschKincaidGrade = Math.max(
    1,
    Math.round((0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59) * 10) / 10
  );

  // Objective specifies: between 1500 - 2000 words
  const meetsWordCountRequirement = words >= 1500 && words <= 2000;
  let statusMessage = "Target met (1500–2000 words)";
  if (words < 1500) {
    statusMessage = `Under target: ${1500 - words} more words needed`;
  } else if (words > 2000) {
    statusMessage = `Above target: ${words - 2000} words over`;
  }

  return {
    wordCount: words,
    characterCount: chars,
    paragraphCount: paragraphs,
    sentenceCount: sentences,
    readingTimeMinutes,
    fleschReadingEase,
    fleschKincaidGrade,
    meetsWordCountRequirement,
    statusMessage
  };
}
