/**
 * ================================
 * Conversation State (PER CHAT)
 * ================================
 */

const conversationState = {
  messageCount: 0,
};

/**
 * ================================
 * Advanced Persona Manager
 * Decides HOW the AI should behave with the scammer
 * ================================
 */

function choosePersona(detectionResult, conversation = {}) {
  const { matchedKeywords = [], confidenceScore = 0 } = detectionResult;
  const { messageCount = 0 } = conversation;

  const keywords = matchedKeywords.join(" ").toLowerCase();

  // Default persona
  let persona = "confused_user";
  let reason = "default";

  /**
   * PRIORITY 1: Financial extraction
   */
  if (
    keywords.includes("upi") ||
    keywords.includes("kyc") ||
    keywords.includes("bank") ||
    keywords.includes("account")
  ) {
    persona = "cooperative_user";
    reason = "financial_keywords";
  } else if (
    /**
     * PRIORITY 2: Urgency / pressure
     */
    keywords.includes("urgent") ||
    keywords.includes("immediately") ||
    keywords.includes("blocked") ||
    keywords.includes("suspended")
  ) {
    persona = "panicked_user";
    reason = "urgency_keywords";
  } else if (
    /**
     * PRIORITY 3: Prize / lottery scams
     */
    keywords.includes("won") ||
    keywords.includes("lottery") ||
    keywords.includes("prize") ||
    keywords.includes("reward")
  ) {
    persona = "greedy_user";
    reason = "reward_keywords";
  } else if (confidenceScore >= 80) {
    /**
     * PRIORITY 4: High confidence score
     */
    persona = "cautious_user";
    reason = "high_confidence";
  }

  /**
   * PRIORITY 5: Message fatigue (OVERRIDES ALL)
   */
  if (messageCount > 4) {
    persona = "busy_user";
    reason = "message_fatigue";
  }

  // ✅ DEBUG (MOST IMPORTANT)
  console.log("🧠 Persona Selected:", {
    persona,
    reason,
    matchedKeywords,
    confidenceScore,
    messageCount,
  });

  return {
    persona,
    reason,
    description: getPersonaDescription(persona),
  };
}

/**
 * ================================
 * Persona Descriptions
 * ================================
 */

function getPersonaDescription(persona) {
  const descriptions = {
    confused_user:
      "Acts unaware and non-technical, asks basic innocent questions",

    cooperative_user: "Acts helpful and trusting to keep scammer engaged",

    cautious_user: "Acts careful, asks for verification but does not refuse",

    panicked_user: "Acts scared and apologetic, delays actions due to fear",

    greedy_user:
      "Acts excited and curious about prize money, asks how to claim",

    busy_user: "Acts irritated and busy, asks scammer to be quick",
  };

  return descriptions[persona];
}

/**
 * ================================
 * MESSAGE HANDLER (IMPORTANT PART)
 * Call this on EVERY incoming message
 * ================================
 */

function onIncomingMessage(messageText, detectionResult) {
  // 🔢 Increment message count
  conversationState.messageCount += 1;

  console.log(
    `📩 Incoming Message #${conversationState.messageCount}:`,
    messageText,
  );

  // 🎭 Choose persona
  const personaResult = choosePersona(detectionResult, conversationState);

  return personaResult;
}

/**
 * ================================
 * TEST / DEMO (REMOVE IN PROD)
 * ================================
 */

module.exports = {
  choosePersona,
  onIncomingMessage,
};
