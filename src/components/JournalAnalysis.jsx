import React from 'react';
import { colors } from '../lib/theme.js';

const SentimentIcon = ({ sentiment }) => {
  const getIcon = () => {
    switch (sentiment) {
      case 'Very Positive':
        return '😄';
      case 'Positive':
        return '🙂';
      case 'Neutral':
        return '😐';
      case 'Negative':
        return '🙁';
      case 'Very Negative':
        return '😢';
      default:
        return '🤔';
    }
  };

  return (
    <span className="text-2xl" role="img" aria-label={sentiment}>
      {getIcon()}
    </span>
  );
};

const JournalAnalysis = ({ analysis, isMonthly = false }) => {
  if (!analysis) return null;

  return (
    <div 
      className="rounded-2xl shadow-md overflow-hidden"
      style={{ background: colors.cardBg }}
    >
      <div 
        className="p-3 border-b"
        style={{ borderColor: colors.cardHighlight }}
      >
        <h3 className="font-semibold">
          {isMonthly ? 'Monthly Analysis' : 'Daily Analysis'}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Sentiment Section */}
        <div className="flex items-center gap-3">
          <SentimentIcon sentiment={analysis.sentiment} />
          <div>
            <div className="text-sm opacity-70">Overall Mood</div>
            <div className="font-semibold">{analysis.sentiment}</div>
          </div>
        </div>

        {/* Themes Section */}
        <div>
          <div className="text-sm opacity-70 mb-2">Key Themes</div>
          <div className="flex flex-wrap gap-2">
            {analysis.themes.map((theme, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-sm"
                style={{ background: colors.cardHighlight }}
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Action Items Section */}
        {analysis.actionItems && analysis.actionItems.length > 0 && (
          <div>
            <div className="text-sm opacity-70 mb-2">Action Items</div>
            <ul className="space-y-2">
              {analysis.actionItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg text-sm"
                  style={{ background: colors.cardHighlight }}
                >
                  <span className="text-xs mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Monthly-specific sections */}
        {isMonthly && (
          <>
            {/* Progress Section */}
            {analysis.progress && (
              <div>
                <div className="text-sm opacity-70 mb-2">Journal Consistency</div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: colors.cardHighlight }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${analysis.progress}%`,
                      background: colors.primary
                    }}
                  />
                </div>
                <div className="text-xs mt-1 opacity-70">{analysis.progress}% of days journaled</div>
              </div>
            )}

            {/* Insights Section */}
            {analysis.insights && (
              <div>
                <div className="text-sm opacity-70 mb-2">Key Insights</div>
                <p className="text-sm">{analysis.insights}</p>
              </div>
            )}

            {/* Recommendations Section */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <div className="text-sm opacity-70 mb-2">Recommendations</div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg text-sm"
                      style={{ background: colors.cardHighlight }}
                    >
                      <span className="text-xs mt-1">💡</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs opacity-70 pt-2 border-t" style={{ borderColor: colors.cardHighlight }}>
          <span>{analysis.wordCount} words</span>
          {isMonthly && analysis.blockers && (
            <span>{analysis.blockers.length} challenges identified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalAnalysis; 