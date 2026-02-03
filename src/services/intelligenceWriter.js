const fs = require("fs");
const path = require("path");

function saveIntelligence(conversation_id, intelligence) {
  const dir = path.join(__dirname, "../../logs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const filePath = path.join(dir, `${conversation_id}.json`);

  const jsonOutput = {
    conversation_id,
    generated_at: new Date().toISOString(),
    agent: {
      name: intelligence.agent_name,
      location: intelligence.agent_location,
    },

    financial: {
      upi_ids: [...intelligence.upi_ids],
      account_numbers: [...intelligence.account_numbers],
      ifsc_codes: [...intelligence.ifsc_codes],
      amounts: [...intelligence.amounts],
    },

    contact: {
      phone_numbers: [...intelligence.phone_numbers],
      email_ids: [...intelligence.email_ids],
    },

    artifacts: {
      links: [...intelligence.links],
      app_names: [...intelligence.app_names],
      screenshot_requested: intelligence.screenshot_requested,
      otp_requested: intelligence.otp_requested,
      qr_requested: intelligence.qr_requested,
    },

    psychology: {
      urgency_detected: intelligence.urgency_detected,
      threat_detected: intelligence.threat_detected,
      authority_impersonated: [...intelligence.authority_impersonated],
      reward_bait_detected: intelligence.reward_bait_detected,
    },
  };

  fs.writeFileSync(filePath, JSON.stringify(jsonOutput, null, 2));
}

module.exports = { saveIntelligence };
