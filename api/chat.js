// Vercel serverless function: receives a message, calls Gemini, returns the reply.
// The Gemini API key stays here on the server side — never exposed to the browser.

const fs = require('fs');
const path = require('path');

let knowledgeBase = '';
try {
  knowledgeBase = fs.readFileSync(path.join(__dirname, 'knowledge.txt'), 'utf8');
} catch {
  knowledgeBase = '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on the server.' });
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message" field.' });
  }

  const contents = [
    ...(Array.isArray(history) ? history : []).map(turn => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const requestBody = { contents };

  if (knowledgeBase.trim()) {
    requestBody.system_instruction = {
      parts: [{
        text: `You are a helpful assistant answering questions using the knowledge base below when relevant. If the question relates to something in the knowledge base, answer using it and be specific. If it's unrelated, just answer normally as a general assistant. Never say "based on the knowledge base" or refer to it explicitly — just answer naturally as if you know this information.\n\n--- KNOWLEDGE BASE ---\n${knowledgeBase}\n--- END KNOWLEDGE BASE ---`,
      }],
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await geminiRes.json();

    if (data.error) {
      return res.status(502).json({ error: `Gemini API error: ${data.error.message || JSON.stringify(data.error)}` });
    }

    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!replyText) {
      return res.status(502).json({ error: 'No reply returned by Gemini.' });
    }

    return res.status(200).json({ reply: replyText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
