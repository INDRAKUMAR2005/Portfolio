
export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { message, history } = await req.json();

        // Securely access the API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const systemPrompt = `You are an AI assistant for Indra Kumar M's portfolio.
    Your goal is to help visitors learn about Indra and encourage them to contact him.
    
    About Indra:
    - Role: Aspiring AI Software Developer & Product Manager.
    - Skills: Java, Spring Boot, React, Next.js, Node.js, MongoDB, Python, AI/ML.
    - Projects: RepoLens (AI repo visualizer), SmartBookmark App, Money Manager.
    - Experience: Internships at Six Phrase & Cognifyz Technologies.
    - Contact: indrakumar.m2005@gmail.com
    
    Guidelines:
    - Be professional, friendly, and concise.
    - If asked about hiring, encourage them to email Indra.
    - Keep responses under 3 sentences unless asked for details.
    - Do NOT make up facts. If unsure, say you don't know but suggest emailing him.
    `;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
