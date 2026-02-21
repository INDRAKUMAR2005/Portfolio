
const portfolioData = {
    name: "Indra Kumar M",
    role: "Aspiring AI Software Developer & Product Manager",
    location: "India",
    email: "indrakumar.m2005@gmail.com",
    phone: "+91 9095334806",
    links: {
        linkedin: "https://www.linkedin.com/in/indra-kumar-65989a367/",
        github: "https://github.com/INDRAKUMAR2005",
        resume: "https://drive.google.com/file/d/1WHGIITmDNjI7-MozYK7fpRancWSXQfO7/view?usp=drive_link"
    },
    about: {
        summary: "I approach software through a product lens — defining user needs, prioritizing features, and aligning technical execution with business goals. I build scalable, AI-integrated applications using modern stacks.",
    },
    skills: {
        technical: [
            "Java", "Python", "JavaScript", "TypeScript", "HTML5", "CSS3",
            "Spring Boot", "Node.js", "Express.js", "React.js", "Next.js",
            "Tailwind CSS", "MongoDB", "MySQL", "Supabase", "PostgreSQL",
            "Git/GitHub", "Agile/Scrum", "CI/CD", "REST APIs", "Drizzle ORM"
        ],
        concepts: [
            "Data Structures & Algorithms", "Low-Level Design", "OOPs",
            "System Design", "Microservices", "MVC Architecture", "Database Design"
        ],
        ai_tools: [
            "Cursor", "Antigravity", "GitHub Copilot", "Google Gemini", "Claude", "ChatGPT", "v0.dev", "Bolt.new"
        ]
    },
    experience: [
        {
            role: "Software Development Engineer Intern",
            company: "SIX PHRASE PVT LTD, Coimbatore",
            duration: "July 2025 – Aug 2025",
            points: [
                "Executed Java-based backend development tasks using Spring Boot.",
                "Built RESTful APIs and improved query performance via database optimization.",
                "Participated in Agile sprint cycles."
            ]
        },
        {
            role: "Software Development Intern",
            company: "COGNIFYZ TECHNOLOGIES",
            duration: "June 2025 – July 2025",
            points: [
                "Developed Java applications implementing core business logic with OOP principles.",
                "Built scalable microservice components and internal tooling."
            ]
        },
        {
            role: "Organizer",
            company: "Nandha Hackathons & Symposia",
            duration: "2023 – Present",
            points: [
                "Coordinated logistics for large-scale technical events for 1000+ students."
            ]
        }
    ],
    projects: [
        {
            name: "RepoLens",
            subtitle: "Visualize Your Repository Architecture",
            description: "An AI-driven tool that generates interactive architecture diagrams from GitHub & GitLab repositories.",
            tech: ["React", "Express", "Gemini AI", "React Flow", "Supabase"]
        },
        {
            name: "SmartBookmark App",
            subtitle: "Modern Realtime Bookmark Manager",
            description: "Realtime bookmark manager with Google OAuth and live sync.",
            tech: ["Next.js 16", "Supabase", "Tailwind v4", "Framer Motion"]
        },
        {
            name: "Money Manager",
            subtitle: "Full Stack Financial Tracker",
            description: "Personal finance management application with persistent storage.",
            tech: ["React", "Node.js", "Express", "MongoDB", "Vite"]
        },
        {
            name: "AI Feedback System",
            subtitle: "Production-Style Dual Dashboard Web App",
            description: "Dual dashboards for user feedback and admin management with AI insights.",
            tech: ["React", "Node.js", "Gemini AI", "MongoDB", "Vercel"]
        }
    ]
};

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { message, history } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            console.error('Missing OPENAI_API_KEY');
            return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const systemPrompt = `You are the expert AI assistant for ${portfolioData.name}'s portfolio.
    Role: ${portfolioData.role}
    Summary: ${portfolioData.about.summary}
    
    Technical Skills: ${portfolioData.skills.technical.join(', ')}
    Concepts: ${portfolioData.skills.concepts.join(', ')}
    AI Tools: ${portfolioData.skills.ai_tools.join(', ')}
    
    Experience:
    ${portfolioData.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration})`).join('\n    ')}
    
    Projects:
    ${portfolioData.projects.map(p => `- ${p.name}: ${p.subtitle}. Built with: ${p.tech.join(', ')}`).join('\n    ')}
    
    Contact: ${portfolioData.email}
    
    Guidelines:
    - Be professional, friendly, and helpful.
    - Focus on specific skills and projects when asked.
    - If you don't know something, suggest emailing Indra.
    - Keep responses concise (2-4 sentences).`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'OpenAI API Error');
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Chat Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
