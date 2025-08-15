import React, { useState, useRef, useEffect } from "react";
import { Send, X, User, Bot, Loader2 } from "lucide-react";

const AssistantChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text:
        "Hello! I'm your farming assistant 🌾 Ask me anything about agriculture in Hindi or English / नमस्ते! मैं आपका कृषि सहायक हूं। हिंदी या अंग्रेजी में कुछ भी पूछें।",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  // Free API alternatives - choose one:
  const API_ENDPOINTS = {
    huggingface:
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
    ollama: "http://localhost:11434/api/generate",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    together: "https://api.together.xyz/inference",
  };

  const farmingKnowledge = {
    "गेहूं":
      "गेहूं की बुआई अक्टूबर-नवंबर में करें। रबी की फसल है। बीज दर 100-125 kg/hectare। NPK (120:60:40) की जरूरत।",
    "धान":
      "धान की रोपाई जून-जुलाई में। खरीफ फसल। पानी की ज्यादा जरूरत। बासमती और सामान्य किस्में उपलब्ध।",
    "मक्का":
      "मक्का जून-जुलाई (खरीफ) या फरवरी-मार्च (रबी) में बोएं। हाइब्रिड बीजों का उपयोग बेहतर।",
    "सरसों": "सरसों अक्टूबर-नवंबर में बोएं। तिलहनी फसल। सिंचाई कम चाहिए।",
    "चना": "चना अक्टूबर-नवंबर में बोएं। दलहनी फसल। नाइट्रोजन कम चाहिए।",
    "आलू": "आलू अक्टूबर-दिसंबर में लगाएं। बीज आलू 25-30 quintal/hectare चाहिए।",
    "मिट्टी":
      "मिट्टी की जांच साल में एक बार करवाएं। pH 6.0-7.5 सबसे अच्छा। जैविक खाद से मिट्टी की सेहत बढ़ती है।",
    "ph":
      "मिट्टी का pH 6.0-7.5 होना चाहिए। अम्लीय मिट्टी में चूना डालें। क्षारीय मिट्टी में जिप्सम का प्रयोग करें।",
    "खारी": "खारी मिट्टी में जिप्सम (2-5 ton/hectare) डालें। हरी खाद और कम्पोस्ट का प्रयोग करें।",
    "खाद":
      "संतुलित खाद जरूरी: नाइट्रोजन (N), फास्फोरस (P), पोटाश (K)। जैविक खाद को प्राथमिकता दें।",
    "यूरिया": "यूरिया में 46% नाइट्रोजन होता है। बहुत ज्यादा न डालें। बांटकर डालें।",
    "dap": "DAP में 18% नाइट्रोजन और 46% फास्फोरस। बुआई के समय डालें।",
    "कम्पोस्ट":
      "कम्पोस्ट सबसे अच्छी जैविक खाद है। 5-10 ton/hectare डालें। मिट्टी की संरचना सुधारती है।",
    "गोबर":
      "गोबर की सड़ी खाद 20-25 ton/hectare डालें। खेत की तैयारी के समय मिलाएं।",
    "पानी":
      "ड्रिप सिंचाई से 40-50% पानी की बचत। स्प्रिंकलर भी अच्छा विकल्प।",
    "सिंचाई":
      "सुबह या शाम को सिंचाई करें। दोपहर में पानी न दें। पानी की जरूरत फसल के अनुसार।",
    "ड्रिप":
      "ड्रिप सिंचाई फल और सब्जियों के लिए बेहतरीन। सब्सिडी भी मिलती है।",
    "कीट":
      "एकीकृत कीट प्रबंधन (IPM) अपनाएं। नीम, ट्राइकोडर्मा का प्रयोग। रासायनिक कीटनाशक कम से कम।",
    "रोग": "फसल चक्र अपनाएं। प्रमाणित बीज का प्रयोग। खेत की सफाई रखें।",
    "नीम":
      "नीम तेल प्राकृतिक कीटनाशक है। 3-5 ml/liter पानी में मिलाकर छिड़काव।",
    "मौसम":
      "खरीफ (जून-नवंबर), रबी (नवंबर-अप्रैल), जायद (मार्च-जून) - तीन मुख्य सीजन।",
    "बारिश":
      "बारिश के पहले जल निकासी का इंतजाम करें। जलभराव से फसल को नुकसान होता है।",
    "बीज":
      "प्रमाणित बीज ही खरीदें। हाइब्रिड बीजों से ज्यादा उत्पादन। बीज उपचार जरूरी।",
    "किस्म": "स्थानीय किस्में भी अच्छी होती हैं। अपने क्षेत्र के लिए उपयुक्त किस्म चुनें।",
    "फसल":
      "कौन सी फसल के बारे में जानना चाहते हैं? गेहूं, धान, मक्का, दालें, या कुछ और?",
    "कृषि":
      "आधुनिक कृषि तकनीक अपनाएं। मिट्टी की जांच, संतुलित खाद, और समय पर सिंचाई जरूरी।",
    "लागत":
      "फसल की लागत कम करने के लिए जैविक खाद, कम्पोस्ट का प्रयोग करें। फसल बीमा भी कराएं।",
    "अगस्त":
      "अगस्त में खरीफ फसलें उगाएं: धान, मक्का, बाजरा, ज्वार, अरहर, मूंग, उड़द, तिल, सूरजमुखी। मानसून का फायदा उठाएं।",
    "august":
      "अगस्त में खरीफ फसलें उगाएं: धान, मक्का, बाजरा, ज्वार, अरहर, मूंग, उड़द, तिल, सूरजमुखी। मानसून का फायदा उठाएं।",
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let bestMatch = "";
    let maxMatches = 0;

    if (message.includes("अगस्त") || message.includes("august")) {
      return farmingKnowledge["अगस्त"];
    }

    for (const [key, response] of Object.entries(farmingKnowledge)) {
      if (message.includes(key)) {
        const matches = key.length;
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = response;
        }
      }
    }
    if (bestMatch) return bestMatch;

    if (
      message.includes("क्या") ||
      message.includes("कैसे") ||
      message.includes("कब")
    ) {
      return "कृपया अपना प्रश्न और विस्तार से बताएं। जैसे: कौन सी फसल, कौन सा मौसम, या क्या समस्या है?";
    }
    if (message.includes("किस") || message.includes("कौन")) {
      return "आप किस चीज के बारे में जानना चाहते हैं? फसल, खाद, कीट-रोग, या कुछ और?";
    }
    return "मुझे खुशी होगी अगर आप अपना प्रश्न और साफ करके पूछें। मैं खेती से जुड़ी हर चीज में आपकी मदद कर सकता हूं।";
  };

  // Gemini API configuration
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Add this to your .env file
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  const callGeminiAPI = async (message) => {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert Indian agricultural advisor who helps farmers. You must:
1. ALWAYS respond in the SAME LANGUAGE the user asks in (Hindi/English/Hinglish)
2. Give complete, detailed, and practical farming advice
3. Focus on Indian agricultural practices, climate, and crops
4. Include specific details like timing, quantities, costs when relevant
5. Be conversational and helpful
User's question: ${message}
Give a comprehensive answer with practical advice.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800, // Increased for more detailed responses
          stopSequences: [],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API Error: ${errorData.error?.message || "Unknown error"}`
      );
    }
    const data = await response.json();
    return (
      data.candidates[0]?.content?.parts[0]?.text ||
      "Sorry, I couldn't process your request. Please try again."
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((msgs) => [
      ...msgs,
      {
        from: "user",
        text: userMessage,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setLoading(true);
    try {
      let reply;
      // Check if Gemini API key is available
      if (GEMINI_API_KEY) {
        try {
          reply = await callGeminiAPI(userMessage);
        } catch (apiError) {
          console.log("Gemini API call failed:", apiError.message);
          reply = getFallbackResponse(userMessage);
        }
      } else {
        // Use simple fallback if no API key
        reply = getFallbackResponse(userMessage);
      }
      setMessages((msgs) => [
        ...msgs,
        {
          from: "assistant",
          text: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Chat Error:", err.message);
      setMessages((msgs) => [
        ...msgs,
        {
          from: "assistant",
          text: "क्षमा करें, तकनीकी समस्या हुई है। कृपया पुनः प्रयास करें।",
          timestamp: new Date(),
        },
      ]);
    }
    setLoading(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 bg-white shadow-2xl rounded-2xl flex flex-col border-0 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-bold">🌱 कृषि सहायक</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-green-800 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
        style={{ maxHeight: "400px" }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-4 ${
              m.from === "user" ? "flex justify-end" : "flex justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                m.from === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 shadow-md rounded-bl-sm border"
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {m.from === "assistant" && (
                  <Bot className="w-4 h-4 text-green-600 mt-0.5" />
                )}
                {m.from === "user" && (
                  <User className="w-4 h-4 text-blue-200 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <span
                    className={`text-xs ${
                      m.from === "user" ? "text-blue-200" : "text-gray-400"
                    } mt-1 block`}
                  >
                    {formatTime(m.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm border px-4 py-2 flex items-center gap-2">
              <Bot className="w-4 h-4 text-green-600" />
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span className="text-sm">सोच रहा हूँ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border-2 border-gray-200 px-4 py-2 rounded-full focus:outline-none focus:border-green-500 transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask in Hindi/English... / हिंदी या अंग्रेजी में पूछें..."
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
          />
          <button
            className={`p-2 rounded-full transition-all ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
            }`}
            onClick={handleSend}
            disabled={loading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {GEMINI_API_KEY
            ? "🤖 Powered by Google Gemini AI"
            : "💡 बुनियादी कृषि ज्ञान - API key जोड़ें बेहतर सलाह के लिए"}
        </p>
      </div>
    </div>
  );
};

export default AssistantChat;
