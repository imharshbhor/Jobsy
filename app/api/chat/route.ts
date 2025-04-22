import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, userApplications } = body;

        if (!message) {
            return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant embedded in a job application tracker. Provide data-driven insights or suggestions based on the user's job applications and resume. Use the context below if helpful.\n\n---\nApplications:\n${JSON.stringify(
                        userApplications,
                        null,
                        2
                    )}`,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.7,
        });

        const reply = response.choices[0]?.message?.content;
        return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.log('OpenAI error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate a response' }), {
            status: 500,
            statusText: error,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
