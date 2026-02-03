const conversations = {};

function getConversation(id) {
  if (!conversations[id]) {
    conversations[id] = {
      isScamConfirmed: false,
      persona: null,
      history: [],
      intelligence: {
        upi_ids: new Set(),
        account_numbers: new Set(),
        ifsc_codes: new Set(),
        amounts: new Set(),

        phone_numbers: new Set(),
        email_ids: new Set(),

        links: new Set(),
        app_names: new Set(),

        screenshot_requested: false,
        otp_requested: false,
        qr_requested: false,

        urgency_detected: false,
        threat_detected: false,
        authority_impersonated: new Set(),
        reward_bait_detected: false,
      },
    };
  }
  return conversations[id];
}

function addMessage(id, role, text) {
  const convo = getConversation(id);
  convo.history.push({ role, text });
}

/* MERGE NEW INTELLIGENCE (APPEND, NEVER OVERWRITE) */
function mergeIntelligence(convo, intel) {
  intel.upi_ids.forEach((v) => convo.intelligence.upi_ids.add(v));
  intel.account_numbers.forEach((v) =>
    convo.intelligence.account_numbers.add(v),
  );
  intel.ifsc_codes.forEach((v) => convo.intelligence.ifsc_codes.add(v));
  intel.amounts.forEach((v) => convo.intelligence.amounts.add(v));

  intel.phone_numbers.forEach((v) => convo.intelligence.phone_numbers.add(v));
  intel.email_ids.forEach((v) => convo.intelligence.email_ids.add(v));

  intel.links.forEach((v) => convo.intelligence.links.add(v));
  intel.app_names.forEach((v) => convo.intelligence.app_names.add(v));

  if (intel.screenshot_requested)
    convo.intelligence.screenshot_requested = true;
  if (intel.otp_requested) convo.intelligence.otp_requested = true;
  if (intel.qr_requested) convo.intelligence.qr_requested = true;

  if (intel.urgency_detected) convo.intelligence.urgency_detected = true;
  if (intel.threat_detected) convo.intelligence.threat_detected = true;

  intel.authority_impersonated.forEach((v) =>
    convo.intelligence.authority_impersonated.add(v),
  );

  if (intel.reward_bait_detected)
    convo.intelligence.reward_bait_detected = true;
}

/* 🔥 SERIALIZE SETS → ARRAYS (CRITICAL FIX) */
function serializeIntelligence(intel) {
  return {
    upi_ids: Array.from(intel.upi_ids),
    account_numbers: Array.from(intel.account_numbers),
    ifsc_codes: Array.from(intel.ifsc_codes),
    amounts: Array.from(intel.amounts),

    phone_numbers: Array.from(intel.phone_numbers),
    email_ids: Array.from(intel.email_ids),

    links: Array.from(intel.links),
    app_names: Array.from(intel.app_names),

    screenshot_requested: intel.screenshot_requested,
    otp_requested: intel.otp_requested,
    qr_requested: intel.qr_requested,

    urgency_detected: intel.urgency_detected,
    threat_detected: intel.threat_detected,
    authority_impersonated: Array.from(intel.authority_impersonated),
    reward_bait_detected: intel.reward_bait_detected,
  };
}

module.exports = {
  getConversation,
  addMessage,
  mergeIntelligence,
  serializeIntelligence,
};
