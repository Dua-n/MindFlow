// Sentiment analysis keywords
const SENTIMENT_KEYWORDS = {
  positive: [
    'happy', 'excited', 'grateful', 'accomplished', 'proud', 'motivated', 'inspired',
    'energetic', 'confident', 'optimistic', 'peaceful', 'joy', 'success', 'achievement',
    'breakthrough', 'progress', 'love', 'hope', 'looking forward'
  ],
  negative: [
    'anxious', 'worried', 'stressed', 'frustrated', 'overwhelmed', 'tired', 'disappointed',
    'confused', 'stuck', 'afraid', 'uncertain', 'concerned', 'struggle', 'difficult',
    'challenge', 'problem', 'fear', 'doubt', 'deadline'
  ],
  neutral: [
    'think', 'plan', 'consider', 'maybe', 'possibly', 'working on', 'continue',
    'develop', 'maintain', 'focus', 'notice', 'observe', 'reflect'
  ]
};

// Common themes in creative work
const THEME_CATEGORIES = {
  'Creative Process': ['design', 'create', 'sketch', 'draft', 'revise', 'concept', 'idea', 'inspiration'],
  'Project Management': ['deadline', 'schedule', 'plan', 'organize', 'coordinate', 'timeline', 'milestone'],
  'Professional Growth': ['learn', 'develop', 'improve', 'skill', 'workshop', 'training', 'practice'],
  'Client Work': ['client', 'meeting', 'feedback', 'revision', 'presentation', 'proposal', 'deliverable'],
  'Business Admin': ['invoice', 'tax', 'expense', 'budget', 'payment', 'contract', 'legal'],
  'Networking': ['contact', 'connect', 'network', 'collaborate', 'partnership', 'community', 'relationship'],
  'Wellbeing': ['rest', 'break', 'health', 'balance', 'stress', 'energy', 'mood', 'feeling'],
  'Exhibition': ['gallery', 'exhibition', 'show', 'display', 'curator', 'artwork', 'collection'],
  'Portfolio': ['portfolio', 'website', 'documentation', 'photograph', 'catalog', 'archive'],
  'Studio': ['studio', 'workspace', 'materials', 'equipment', 'supplies', 'space', 'setup']
};

// Action item patterns
const ACTION_PATTERNS = [
  /need to ([^.!?]+)/i,
  /should ([^.!?]+)/i,
  /have to ([^.!?]+)/i,
  /must ([^.!?]+)/i,
  /todo:? ([^.!?]+)/i,
  /remember to ([^.!?]+)/i,
  /don't forget to ([^.!?]+)/i,
  /plan to ([^.!?]+)/i,
  /going to ([^.!?]+)/i
];

/**
 * Analyzes the sentiment of a text entry
 * @param {string} text - The text to analyze
 * @returns {Object} Sentiment analysis results
 */
export const analyzeSentiment = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  let scores = {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  words.forEach(word => {
    if (SENTIMENT_KEYWORDS.positive.some(keyword => word.includes(keyword))) scores.positive++;
    if (SENTIMENT_KEYWORDS.negative.some(keyword => word.includes(keyword))) scores.negative++;
    if (SENTIMENT_KEYWORDS.neutral.some(keyword => word.includes(keyword))) scores.neutral++;
  });

  const total = scores.positive + scores.negative + scores.neutral;
  if (total === 0) return { sentiment: "Neutral", confidence: 0 };

  const positiveRatio = scores.positive / total;
  const negativeRatio = scores.negative / total;
  const neutralRatio = scores.neutral / total;

  if (positiveRatio > 0.4) {
    return {
      sentiment: positiveRatio > 0.6 ? "Very Positive" : "Positive",
      confidence: positiveRatio
    };
  } else if (negativeRatio > 0.4) {
    return {
      sentiment: negativeRatio > 0.6 ? "Very Negative" : "Negative",
      confidence: negativeRatio
    };
  } else {
    return {
      sentiment: neutralRatio > 0.3 ? "Neutral" : "Mixed",
      confidence: Math.max(positiveRatio, negativeRatio, neutralRatio)
    };
  }
};

/**
 * Extracts themes from text
 * @param {string} text - The text to analyze
 * @returns {Array} Array of identified themes
 */
export const extractThemes = (text) => {
  const lowercaseText = text.toLowerCase();
  const themes = new Map();

  Object.entries(THEME_CATEGORIES).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => lowercaseText.includes(keyword));
    if (matches.length > 0) {
      themes.set(category, matches.length);
    }
  });

  // Sort themes by frequency and return top ones
  return Array.from(themes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme);
};

/**
 * Detects action items from text
 * @param {string} text - The text to analyze
 * @returns {Array} Array of detected action items
 */
export const detectActionItems = (text) => {
  const actionItems = new Set();

  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  sentences.forEach(sentence => {
    ACTION_PATTERNS.forEach(pattern => {
      const match = sentence.match(pattern);
      if (match && match[1]) {
        const actionItem = match[1].trim();
        if (actionItem.length > 3) { // Ignore very short matches
          actionItems.add(actionItem.charAt(0).toUpperCase() + actionItem.slice(1));
        }
      }
    });
  });

  return Array.from(actionItems);
};

/**
 * Generates a monthly wrap-up analysis
 * @param {Object} entries - Journal entries for the month
 * @param {Object} analyses - Daily analyses for the month
 * @returns {Object} Monthly wrap-up analysis
 */
export const generateMonthlyWrapUp = (entries, analyses) => {
  // Aggregate all text for the month
  const allText = Object.values(entries)
    .flat()
    .map(entry => entry.content)
    .join(' ');

  // Get overall themes
  const themes = extractThemes(allText);

  // Calculate productivity and mood trends
  const totalDays = Object.keys(entries).length;
  const daysWithEntries = Object.keys(entries).length;
  const productivityScore = Math.round((daysWithEntries / totalDays) * 100);

  // Aggregate action items
  const allActionItems = new Set();
  Object.values(analyses).forEach(analysis => {
    if (analysis.actionItems) {
      analysis.actionItems.forEach(item => allActionItems.add(item));
    }
  });

  // Identify common blockers and patterns
  const blockers = detectBlockers(allText);
  const recommendations = generateRecommendations(blockers, themes);

  return {
    themes,
    insights: generateInsights(themes, productivityScore, blockers),
    progress: productivityScore,
    blockers,
    recommendations
  };
};

// Helper functions for monthly wrap-up
const detectBlockers = (text) => {
  const blockerPatterns = [
    /struggling with ([^.!?]+)/i,
    /blocked by ([^.!?]+)/i,
    /difficult to ([^.!?]+)/i,
    /challenge[ds]? with ([^.!?]+)/i,
    /worried about ([^.!?]+)/i
  ];

  const blockers = new Set();
  blockerPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        blockers.add(match[1].trim());
      }
    }
  });

  return Array.from(blockers).slice(0, 3);
};

const generateInsights = (themes, productivityScore, blockers) => {
  let insights = [];

  if (themes.length > 0) {
    insights.push(`Focus areas this month: ${themes.join(', ')}.`);
  }

  if (productivityScore > 75) {
    insights.push('Maintained consistent journaling practice.');
  } else if (productivityScore < 50) {
    insights.push('Room for improvement in maintaining regular reflections.');
  }

  if (blockers.length > 0) {
    insights.push('Key challenges identified and being addressed.');
  }

  return insights.join(' ');
};

const generateRecommendations = (blockers, themes) => {
  const recommendations = new Set();

  // Based on blockers
  blockers.forEach(blocker => {
    if (blocker.includes('time')) {
      recommendations.add('Consider time-blocking techniques for better focus');
    }
    if (blocker.includes('deadline') || blocker.includes('pressure')) {
      recommendations.add('Break down large tasks into smaller, manageable steps');
    }
    if (blocker.includes('energy') || blocker.includes('stress')) {
      recommendations.add('Schedule regular breaks and self-care activities');
    }
  });

  // Based on themes
  themes.forEach(theme => {
    if (theme === 'Project Management') {
      recommendations.add('Review and update project timelines weekly');
    }
    if (theme === 'Creative Process') {
      recommendations.add('Dedicate specific time slots for uninterrupted creative work');
    }
    if (theme === 'Professional Growth') {
      recommendations.add('Set aside time for skill development and learning');
    }
  });

  return Array.from(recommendations).slice(0, 3);
};

export default {
  analyzeSentiment,
  extractThemes,
  detectActionItems,
  generateMonthlyWrapUp
}; 