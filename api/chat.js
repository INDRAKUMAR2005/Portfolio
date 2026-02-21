
import { portfolioData } from './portfolio-data.js';

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

        const systemPrompt = `You are an expert AI assistant for ${portfolioData.name}'s portfolio.
    Your goal is to provide detailed, accurate information about his background, skills, and projects.
    
    About Indra:
    - Role: ${portfolioData.role}
    - Summary: ${portfolioData.about.summary}
    - Location: ${portfolioData.location}
    
    Technical Arsenal:
    - Core Skills: ${portfolioData.skills.technical.join(', ')}
    - Concepts: ${portfolioData.skills.concepts.join(', ')}
    - AI Tools: ${portfolioData.skills.ai_tools.join(', ')}
    
    Career Journey:
    ${portfolioData.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.points.join(' ')}`).join('\n    ')}
    
    Highlighted Projects:
    ${portfolioData.projects.map(p => `- ${p.name}: ${p.subtitle}. ${p.description} Tech: ${p.tech.join(', ')}. Highlights: ${p.highlights.join(' ')}`).join('\n    ')}
    
    Contact:
    - Email: ${portfolioData.email}
    - LinkedIn: ${portfolioData.links.linkedin}
    
    Guidelines:
    - Be professional, friendly, and enthusiastic.
    - When asked about skills, list them clearly and mention his expertise in AI-driven tools.
    - When asked about projects, provide context on what they solve and the tech used.
    - If asked about hiring or collaboration, encourage them to email Indra or connect on LinkedIn.
    - Keep responses concise but helpful.
    - Only provide information from the provided context. If unsure, suggest contacting Indra directly.
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
