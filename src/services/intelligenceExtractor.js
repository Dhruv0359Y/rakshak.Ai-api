function extractAmounts(message) {
  const results = [];

  const amountRegex =
    /\b(?:₹|rs\.?|inr)?\s?\d{1,3}(?:,\d{2,3})*(?:\.\d{1,2})?\b/gi;

  const matches = message.match(amountRegex) || [];

  matches.forEach((m) => {
    const num = m.replace(/[^\d]/g, "");
    if (num.length >= 3) results.push(num);
  });

  return [...new Set(results)];
}

function extractIntelligence(message) {
  const text = message.toLowerCase();

  const agentNameMatch = message.match(
    /\b(?:this is|i am|my name is|speaking|here)\s+([A-Z][a-z]{2,})/i,
  );

  const agentLocationMatch = message.match(
    /\b(sbi|pnb|rbi|bank|cyber cell)\s*(?:of|from|,)?\s*([A-Z][a-zA-Z]+)?/i,
  );

  return {
    agent_name: agentNameMatch ? agentNameMatch[1] : null,
    agent_location: agentLocationMatch
      ? agentLocationMatch[0].toUpperCase()
      : null,

    upi_ids:
      message.match(
        /\b[a-zA-Z0-9.\-_]{2,}@(ybl|okaxis|oksbi|okhdfc|paytm|upi|ibl|axl)\b/gi,
      ) || [],

    account_numbers: message.match(/\b\d{11,16}\b/g) || [],

    ifsc_codes: message.match(/\b[A-Z]{4}0[A-Z0-9]{6}\b/g) || [],

    amounts: extractAmounts(message),

    phone_numbers: message.match(/\b(?:\+91[\s-]?)?[6-9]\d{9}\b/g) || [],

    email_ids: message.match(/\b[a-zA-Z0-9._%+-]+@gmail\.com\b/gi) || [],

    links: message.match(/https?:\/\/[^\s]+/gi) || [],

    app_names: ["anydesk", "teamviewer"]
      .filter((app) => text.includes(app))
      .map((app) => app.toUpperCase()),

    screenshot_requested:
      text.includes("screenshot") || text.includes("screen shot"),

    otp_requested: text.includes("otp"),
    qr_requested: text.includes("qr"),

    urgency_detected: text.includes("urgent") || text.includes("immediately"),

    threat_detected: text.includes("blocked") || text.includes("legal action"),

    authority_impersonated: ["sbi", "rbi", "bank", "cyber cell"]
      .filter((a) => text.includes(a))
      .map((a) => a.toUpperCase()),

    reward_bait_detected: text.includes("lottery") || text.includes("won"),
  };
}

module.exports = { extractIntelligence };
