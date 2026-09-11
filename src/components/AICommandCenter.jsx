import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AICommandCenter({ buildings }) {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [thinking, setThinking] = useState(false);
    const [typingText, setTypingText] = useState("");
    const [listening, setListening] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, typingText]);

    function handleAsk(voiceQuery = null) {
        if (!query.trim() && !voiceQuery) return;

        const currentQuery = voiceQuery || query;

        const text = currentQuery.toLowerCase();

        let aiReply = "";

        const building = buildings.find((b) =>
            text.includes(b.name.toLowerCase())
        );

        if (building) {
            aiReply = `
🏢 ${building.name}

👥 Students: ${building.students}
⚡ Energy: ${building.energy}
💧 Water: ${building.water}
🌡 Temperature: ${building.temperature}
📶 WiFi: ${building.wifi}

🤖 AI Analysis:
${building.ai}

✅ Recommendation:
${building.recommendation}
`;
        }

        else if (text.includes("highest energy")) {
            const highest = [...buildings].sort(
                (a, b) => parseInt(b.energy) - parseInt(a.energy)
            )[0];

            aiReply = `⚡ ${highest.name} currently has the highest energy usage (${highest.energy}).`;
        }

        else if (text.includes("emergency")) {
            aiReply =
                "🚨 No campus-wide emergency detected. Only Lab energy usage is above normal.";
        }

        else {
            aiReply =
                "Sorry, I couldn't understand that. Try asking about Engineering, Library, Labs, Hostel, Cafeteria or Admin.";
        }

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentQuery,
            },
        ]);

        setQuery("");

        setThinking(true);

        setTimeout(() => {
            setThinking(false);

            let index = 0;

            setTypingText("");

            const interval = setInterval(() => {
                index++;

                setTypingText(aiReply.slice(0, index));

                if (index >= aiReply.length) {
                    clearInterval(interval);

                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "ai",
                            text: aiReply,
                        },
                    ]);

                    setTypingText("");

                    // Speak ONLY ONCE after the answer is displayed
                    speak(aiReply);
                }
            }, 15);
        }, 1000);
    }

    function startListening() {
        if (
            !("webkitSpeechRecognition" in window) &&
            !("SpeechRecognition" in window)
        ) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setListening(true);

        recognition.start();

        recognition.onresult = (event) => {
            const transcript =
                event.results[0][0].transcript;

            setQuery(transcript);

            setListening(false);

            setTimeout(() => {
                handleAsk(transcript);
            }, 300);
        };

        recognition.onerror = () => {
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    }

    function speak(text) {
        if (!("speechSynthesis" in window)) return;

        // Stop any previous speech
        window.speechSynthesis.cancel();

        // Remove emojis before speaking
        const cleanText = text.replace(
            /[\u{1F300}-\u{1FAFF}]/gu,
            ""
        );

        const voices = window.speechSynthesis.getVoices();

        const speakNow = () => {
            // Make absolutely sure no previous speech is queued
            window.speechSynthesis.cancel();

            const availableVoices =
                window.speechSynthesis.getVoices();

            // Select one consistent English voice
            const voice =
                availableVoices.find(
                    (v) => v.name === "Google US English"
                ) ||
                availableVoices.find(
                    (v) =>
                        v.lang === "en-US" &&
                        v.name
                            .toLowerCase()
                            .includes("female")
                ) ||
                availableVoices.find(
                    (v) => v.lang === "en-US"
                ) ||
                availableVoices.find(
                    (v) => v.lang.startsWith("en")
                );

            const utterance =
                new SpeechSynthesisUtterance(cleanText);

            utterance.lang = "en-US";
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            if (voice) {
                utterance.voice = voice;
            }

            window.speechSynthesis.speak(utterance);
        };

        // Voices may load asynchronously in Chrome
        if (voices.length === 0) {
            const handleVoicesChanged = () => {
                window.speechSynthesis.removeEventListener(
                    "voiceschanged",
                    handleVoicesChanged
                );

                speakNow();
            };

            window.speechSynthesis.addEventListener(
                "voiceschanged",
                handleVoicesChanged,
                { once: true }
            );
        } else {
            speakNow();
        }
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8">

            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                🤖 AI Command Center
            </h2>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleAsk();
                    }
                }}
                placeholder="Ask about your campus..."
                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-400"
            />

            <div className="flex flex-wrap gap-3 mt-6">

                {[
                    "Highest Energy Usage",
                    "Engineering",
                    "Library",
                    "Labs",
                    "Hostel",
                    "Cafeteria",
                    "Emergency",
                ].map((item) => (
                    <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-4 py-2 rounded-full bg-slate-800 hover:bg-cyan-500 text-white text-sm transition-all"
                    >
                        {item}
                    </button>
                ))}

            </div>

            <div className="flex gap-4 mt-4">

                <button
                    onClick={handleAsk}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl"
                >
                    Ask AI
                </button>

                <button
                    onClick={startListening}
                    className={`font-bold px-5 py-3 rounded-xl transition ${
                        listening
                            ? "bg-green-500 text-white animate-pulse"
                            : "bg-red-500 hover:bg-red-400 text-white"
                    }`}
                >
                    {listening
                        ? "🎙️ Listening..."
                        : "🎤"}
                </button>

            </div>

            <div className="mt-8 bg-slate-800 rounded-2xl p-6 min-h-[350px] max-h-[500px] overflow-y-auto">

                {messages.length === 0 ? (

                    <p className="text-slate-400">
                        Ask something about your GRIET INTELLIGENT CAMPUS.
                    </p>

                ) : (

                    <div className="space-y-4">

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={`flex items-end gap-3 ${
                                    msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >

                                {msg.sender === "ai" && (
                                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-xl">
                                        🤖
                                    </div>
                                )}

                                <div
                                    className={`max-w-[80%] lg:max-w-[70%] rounded-3xl px-5 py-3 whitespace-pre-line ${
                                        msg.sender === "user"
                                            ? "bg-cyan-500 text-black"
                                            : "bg-slate-700 text-white"
                                    }`}
                                >
                                    {msg.text}
                                </div>

                                {msg.sender === "user" && (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                                        👤
                                    </div>
                                )}

                            </div>

                        ))}

                        {thinking && (

                            <div className="flex justify-start">

                                <div className="bg-slate-700 text-white rounded-2xl px-5 py-3 animate-pulse">

                                    🤖

                                    <div className="flex gap-2">

                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>

                                        <span
                                            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                                            style={{
                                                animationDelay: "0.2s",
                                            }}
                                        ></span>

                                        <span
                                            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                                            style={{
                                                animationDelay: "0.4s",
                                            }}
                                        ></span>

                                    </div>

                                </div>

                            </div>

                        )}

                        {typingText && (

                            <div className="flex justify-start">

                                <div className="bg-slate-700 text-white rounded-2xl px-5 py-3 whitespace-pre-line">
                                    {typingText}
                                </div>

                            </div>

                        )}

                    </div>

                )}

                <div ref={bottomRef}></div>

            </div>

        </div>
    );
}