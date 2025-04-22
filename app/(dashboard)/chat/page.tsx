"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { fetchApplications } from '@/lib/data';

export default function JobsyChat() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hey! How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleOptionSelect = async (option: any) => {
        if (!option) return;

        const userApplications = await fetchApplications();

        const newMessages = [...messages, { role: 'user', content: option }];
        const userMessage = option;
        setMessages(newMessages);
        setLoading(true);

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, userApplications: userApplications }),
        });

        const data = await res.json();
        setMessages([...newMessages, { role: 'bot', content: data.reply }]);
        setLoading(false);
    };

    return (
        <div className="max-w-[43.5rem] mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ChatBot</h1>
                <p className="text-muted-foreground mt-1 mb-3">Manage and track your job applications</p>
            </div>
            <Card className="mb-4 h-[66vh] overflow-y-auto py-4 space-y-2 bg-background">
                <CardContent className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`p-1 rounded-md ${msg.role === 'bot' ? 'bg-background text-left' : 'text-right font-semibold'}`}>
                            <ReactMarkdown
                                components={{
                                    h3: ({ node, ...props }) => <h3 className="text-xl py-1 font-bold mt-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="ml-4 py-2 list-disc" {...props} />,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    ))}
                    {loading && <div className="text-gray-500">Thinking...</div>}
                </CardContent>
            </Card>
            <div className="flex gap-2">
                <Button onClick={() => handleOptionSelect('Give insights on my applications')}>Give meaningful insights</Button>
                <Button onClick={() => handleOptionSelect('Provide feedback on my applications')}>Provide feedback on my applications</Button>
                <Button onClick={() => handleOptionSelect('Suggest job opportunities')}>Suggest job opportunities</Button>
            </div>
        </div>
    );
}
