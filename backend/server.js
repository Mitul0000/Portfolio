const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.use(bodyParser.json());
app.use(cors());

app.post('/api/generate', async (req, res) => {
    const { niche, platform, idea, channel, subs } = req.body;

    if (!niche || !idea || !platform || !channel || subs === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const prompt = `
You are an AI social media strategist. Given the following:
Niche: ${niche}
Platform: ${platform}
Focus/Description: ${idea}
Channel/Page Name: ${channel}
Current Subscribers/Followers: ${subs}

Generate a JSON object with these keys:
overview: Brief summary of the growth plan.
guidance: Key advice for the creator.
dailyPlan: Array of 30 objects, each with 'day' and 'task'.
milestones: Array of 3 objects, each with 'followers' (estimated at 30%, 60%, 100% growth).
contentMix: Array of objects, each with 'type' and 'percent' (content type breakdown).

Respond ONLY with a valid JSON object. Do not include any explanation, markdown, code block, or extra text. The first character of your response must be '{' and the last character must be '}'.
`;

        const apiRequestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        const geminiApiResponse = await axios.post(
            `${geminiApiEndpoint}?key=${geminiApiKey}`,
            apiRequestBody,
            { headers: { 'Content-Type': 'application/json' } }
        );

        let geminiText = geminiApiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text
            || geminiApiResponse.data?.contents?.[0]?.parts?.[0]?.text;

        // Log Gemini's raw response for debugging
        console.log('Gemini raw response:', geminiText);

        // Remove markdown/code block if present
        if (geminiText.startsWith('```json')) {
            geminiText = geminiText.replace(/^```json\s*([\s\S]*?)\s*```$/, '$1').trim();
        } else if (geminiText.startsWith('```')) {
            geminiText = geminiText.replace(/^```\s*([\s\S]*?)\s*```$/, '$1').trim();
        }

        // Try to parse JSON
        let plan;
        try {
            plan = JSON.parse(geminiText);
        } catch (e) {
            console.error('Failed to parse Gemini response:', geminiText);
            return res.status(500).json({ error: 'Gemini response not in expected format', raw: geminiText });
        }

        // Ensure all keys exist
        plan.dailyPlan = Array.isArray(plan.dailyPlan) ? plan.dailyPlan : [];
        plan.milestones = Array.isArray(plan.milestones) ? plan.milestones : [];
        plan.contentMix = Array.isArray(plan.contentMix) ? plan.contentMix : [];
        plan.overview = plan.overview || '';
        plan.guidance = plan.guidance || '';

        res.json(plan);

    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});