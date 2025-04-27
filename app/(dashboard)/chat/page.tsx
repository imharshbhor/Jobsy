"use client"

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { fetchApplications } from '@/lib/data';

export default function JobsyChat() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hey! How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleOptionSelect = async (option: string) => {
        if (!option) return;
        await sendMessage(option);
    };

    const sendMessage = async (userMessage: string) => {
        const userApplications = await fetchApplications();
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setLoading(true);
        setInput("");
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, userApplications }),
        });
        const data = await res.json();
        setMessages([...newMessages, { role: 'bot', content: data.reply }]);
        setLoading(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim() && !loading) {
            sendMessage(input.trim());
        }
    };

    return (
        <div className="flex flex-col h-[90vh] pt-4">
            {/* Chat area */}
            <main className="flex-1 w-full overflow-y-auto px-0 md:px-0 flex flex-col items-center">
                <div className="w-full max-w-2xl flex-1 flex flex-col gap-2 p-2 md:px-0">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`min-w-[60px] w-fit max-w-[85%] px-4 py-2 rounded-2xl whitespace-pre-line break-words flex flex-col text-base ${
                                msg.role === 'bot'
                                    ? 'bg-[#ececf1] text-gray-900 self-start items-start'
                                    : 'bg-[#3b82f6] text-white self-end items-end'
                            }`}
                            style={{ marginBottom: 4, alignItems: 'flex-start', textAlign: 'left' }}
                        >
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
                    <div ref={messagesEndRef} />
                </div>
            </main>
            {/* Input area */}
            <footer className="w-full bg-[#f7f7f8] border-t border-gray-200 p-2 flex flex-col items-center">
                <div className="w-full max-w-2xl flex flex-col gap-2">
                    <div className="flex gap-2 mb-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleOptionSelect('Give insights on my applications')}
                            disabled={loading}
                        >
                            Give meaningful insights
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleOptionSelect('Provide feedback on my applications')}
                            disabled={loading}
                        >
                            Provide feedback
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleOptionSelect('Suggest job opportunities')}
                            disabled={loading}
                        >
                            Suggest jobs
                        </Button>
                    </div>
                    <div className="flex gap-2 w-full">
                        <input
                            type="text"
                            className="flex-1 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base shadow-sm"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            disabled={loading}
                            aria-label="Type your message"
                            autoFocus
                        />
                        <Button
                            onClick={() => input.trim() && !loading && sendMessage(input.trim())}
                            disabled={!input.trim() || loading}
                            className="px-6 rounded-xl text-base mt-[0.8px]"
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
