/**
 * Evidence Builder
 * Builds structured proof + confidence score
 */

function buildEvidence({ detection, intelligence }) {
  let score = 0;
  const reasons = [];

  // Base detection confidence
  if (detection?.confidenceScore) {
    score += detection.confidenceScore * 0.5;
    reasons.push("Scam keywords matched");
  }

  // UPI evidence
  if (intelligence.upi_ids.length > 0) {
    score += 20;
    reasons.push("UPI ID requested/shared");
  }

  // Phishing links
  if (intelligence.links.length > 0) {
    score += 20;
    reasons.push("Suspicious link shared");
  }

  // Screenshot mention
  if (intelligence.screenshot_mentioned) {
    score += 10;
    reasons.push("Screenshot mentioned");
  }

  // Phone numbers
  if (intelligence.phone_numbers.length > 0) {
    score += 10;
    reasons.push("Phone number shared");
  }

  // Cap score
  score = Math.min(Math.round(score), 100);

  return {
    confidence_score: score,
    reasons,
  };
}

module.exports = { buildEvidence };
