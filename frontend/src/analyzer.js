const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
  'we', 'you', 'they', 'he', 'she', 'it', 'i', 'our', 'your', 'their',
  'this', 'that', 'these', 'those', 'not', 'no', 'so', 'if', 'then',
  'than', 'when', 'where', 'who', 'which', 'what', 'how', 'all', 'any',
  'both', 'each', 'more', 'most', 'other', 'some', 'such', 'into',
  'through', 'during', 'including', 'until', 'while', 'about', 'against',
  'between', 'out', 'up', 'over', 'also', 'just', 'very', 'well',
]);

const TECH_PHRASES = [
  'machine learning', 'deep learning', 'natural language processing',
  'computer vision', 'data science', 'artificial intelligence',
  'large language models', 'neural networks', 'reinforcement learning',
  'software engineering', 'full stack', 'back end', 'front end',
  'ci/cd', 'rest api', 'graphql', 'microservices', 'cloud computing',
  'version control', 'agile methodology', 'test driven development',
  'object oriented', 'functional programming', 'data structures',
  'system design', 'distributed systems', 'real time', 'open source',
];

function extractPhrases(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const phrase of TECH_PHRASES) {
    if (lower.includes(phrase)) found.push(phrase);
  }
  return found;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#+.\-/\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function getFreqMap(tokens) {
  const freq = {};
  for (const t of tokens) {
    freq[t] = (freq[t] || 0) + 1;
  }
  return freq;
}

export function analyzeResume(resumeText, jdText) {
  if (!resumeText.trim() || !jdText.trim()) return null;

  const jdTokens = tokenize(jdText);
  const resumeTokens = tokenize(resumeText);
  const jdFreq = getFreqMap(jdTokens);
  const resumeFreq = getFreqMap(resumeTokens);

  const jdPhrases = extractPhrases(jdText);
  const resumePhrases = extractPhrases(resumeText);

  // Top keywords from JD (by frequency, min 2 chars)
  const jdKeywords = Object.entries(jdFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word);

  const matched = [];
  const missing = [];

  for (const kw of jdKeywords) {
    if (resumeFreq[kw]) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const matchedPhrases = jdPhrases.filter(p => resumePhrases.includes(p));
  const missingPhrases = jdPhrases.filter(p => !resumePhrases.includes(p));

  const keywordScore = jdKeywords.length
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;

  const phraseScore = jdPhrases.length
    ? Math.round((matchedPhrases.length / jdPhrases.length) * 100)
    : 100;

  const overallScore = Math.round(keywordScore * 0.7 + phraseScore * 0.3);

  const suggestions = buildSuggestions(missing, missingPhrases, overallScore);

  return {
    overallScore,
    keywordScore,
    phraseScore,
    matched,
    missing: missing.slice(0, 20),
    matchedPhrases,
    missingPhrases,
    suggestions,
    totalJdKeywords: jdKeywords.length,
  };
}

function buildSuggestions(missing, missingPhrases, score) {
  const tips = [];

  if (missingPhrases.length > 0) {
    tips.push({
      type: 'critical',
      title: 'Add these key phrases',
      body: missingPhrases.map(p => `"${p}"`).join(', '),
    });
  }

  if (missing.length > 0) {
    tips.push({
      type: 'warning',
      title: 'Missing keywords to weave in',
      body: missing.slice(0, 12).join(', '),
    });
  }

  if (score < 40) {
    tips.push({
      type: 'info',
      title: 'Low match — revisit your summary',
      body: 'Rewrite your professional summary to directly mirror the job title and core requirements.',
    });
  } else if (score < 70) {
    tips.push({
      type: 'info',
      title: 'Good start — tighten your bullet points',
      body: 'Update 2–3 experience bullets to use the exact verbs and tools mentioned in the JD.',
    });
  } else {
    tips.push({
      type: 'success',
      title: 'Strong match!',
      body: 'Your resume is well-aligned. Make sure formatting is clean for ATS parsing.',
    });
  }

  tips.push({
    type: 'info',
    title: 'ATS tip',
    body: 'Use a single-column layout, standard section headers (Experience, Education, Skills), and avoid tables or graphics.',
  });

  return tips;
}
