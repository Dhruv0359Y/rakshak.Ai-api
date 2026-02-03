const express = require("express");
const router = express.Router();

const { detectScam } = require("../services/scamDetector");
const { choosePersona } = require("../services/personaManager");
const { generateReply } = require("../services/conversationEngine");
const {
  getConversation,
  addMessage,
  mergeIntelligence,
  serializeIntelligence,
} = require("../services/conversationStore");
const { extractIntelligence } = require("../services/intelligenceExtractor");

router.post("/receive-message", async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  const convo = getConversation(conversation_id);

  addMessage(conversation_id, "scammer", message);

  const detection = detectScam(message);
  if (detection.isScam && !convo.isScamConfirmed) {
    convo.isScamConfirmed = true;
    convo.persona = choosePersona(detection).persona;
  }

  const reply = convo.isScamConfirmed
    ? await generateReply({
        persona: convo.persona,
        lastMessage: message,
        history: convo.history,
      })
    : null;

  if (reply) addMessage(conversation_id, "user", reply);

  const intel = extractIntelligence(message);
  mergeIntelligence(convo, intel);

  return res.json({
    conversation_id,
    isScam: convo.isScamConfirmed,
    persona: convo.persona,
    reply,
    history: convo.history,
    intelligence: serializeIntelligence(convo.intelligence),
  });
});

module.exports = router;
