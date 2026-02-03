/**
 * Smart rule-based scam detector
 * Rakshak AI – Hackathon Grade
 * FIXED: prize, remote, lottery, reward detection
 */

const scamKeywords = [
  // 🔹 ACCOUNT / KYC
  /account.*(block|blocked|suspend|suspended|deactivate)/i,
  /(block|blocked|suspend|suspended).*account/i,
  /kyc.*(pending|update|expire|expired|verify)/i,
  /(verify|update).*kyc/i,
  /service.*block/i,

  // 🔹 URGENCY
  /urgent/i,
  /immediate/i,
  /within\s*24\s*hours?/i,
  /today\s*only/i,
  /final\s*notice/i,
  /last\s*warning/i,
  /action\s*required/i,
  /respond\s*now/i,

  // 🔹 BANK / PAYMENT
  /\bupi\b/i,
  /upi\s*id/i,
  /bank\s*account/i,
  /(debit|credit|atm)\s*card/i,
  /\bpin\b/i,
  /\botp\b/i,
  /\bcvv\b/i,

  // 🔹 AUTHORITY
  /\brbi\b/i,
  /income\s*tax/i,
  /\bit\s*department\b/i,
  /\bcyber\s*cell\b/i,
  /\bpolice\b/i,
  /\bgovernment\b|\bgovt\b/i,

  // 🔹 PRIZE / LOTTERY (🔥 FIXED)
  /(lottery|lucky\s*draw|jackpot)/i,
  /(prize|reward|gift\s*card)/i,
  /(won|winner|jeet)/i,
  /(cash|amount).*(prize|reward)/i,
  /(prize|reward).*(₹|rs|inr|\d)/i,

  // 🔹 LINKS / PHISHING
  /(click|open|verify|update).*(link)/i,
  /(download|install).*(app)/i,

  // 🔹 REMOTE ACCESS (🔥 FIXED)
  /(anydesk|teamviewer|quick\s*support)/i,
  /(screen|remote).*(share|access)/i,
  /(send|share).*(screenshot)/i,

  // 🔹 HINGLISH / HINDI PRESSURE
  /turant/i,
  /abhi.*karo/i,
  /jaldi/i,
  /block.*ho.*jayega/i,
  /band.*ho.*jayega/i,

  // 🔹 MONEY BAIT (SMART)
  /(₹|rs\.?|inr)\s?\d{3,}/i,
];

/**
 * Detect scam signals
 */
function detectScam(message) {
  if (!message) {
    return { isScam: false, matchedKeywords: [], confidenceScore: 0 };
  }

  const text = message.toLowerCase();
  const matchedKeywords = [];

  for (const rule of scamKeywords) {
    if (rule.test(text)) {
      matchedKeywords.push(rule.toString());
    }
  }

  const isScam = matchedKeywords.length > 0;

  const confidenceScore = Math.min(45 + matchedKeywords.length * 10, 95);

  return {
    isScam,
    matchedKeywords,
    confidenceScore,
  };
}

module.exports = { detectScam };
