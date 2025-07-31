import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Missing 'prompt' in request body." });
    return;
  }

  try {
    // Get the Anthropic API key from environment variables
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      res.status(500).json({ error: 'Anthropic API key not set in environment variables.' });
      return;
    }

    // Make the request to Claude (Anthropic)
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024
      },
      {
        headers: {
          "x-api-key": anthropicApiKey,
          "content-type": "application/json"
        }
      }
    );

    // Return the Claude completion to the frontend
    res.status(200).json({ completion: response.data.completion });
  } catch (error) {
    // Forward the error message
    res.status(500).json({ error: error.response?.data || error.message });
  }
}