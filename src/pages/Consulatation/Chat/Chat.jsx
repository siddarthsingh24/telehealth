import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BiMicrophone } from 'react-icons/bi';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Predefined responses for common medical queries
  const predefinedResponses = {
    "headache": "For a headache, ensure you're hydrated and consider resting in a quiet, dark room. If the headache persists or is severe, consult a healthcare provider.",
    "fever": "If you have a fever, rest and stay hydrated. You may use over-the-counter medications like acetaminophen or ibuprofen to manage your symptoms. If the fever lasts more than a few days or is very high, seek medical advice.",
    // Add more predefined responses based on common symptoms or questions
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check for predefined responses
    const lowercasedInput = input.toLowerCase();
    const predefinedResponse = Object.keys(predefinedResponses).find(key => lowercasedInput.includes(key));

    if (predefinedResponse) {
      setMessages([...messages, { text: input, type: 'user' }, { text: predefinedResponses[predefinedResponse], type: 'bot' }]);
      setInput('');
      return;
    }

    // Default prompt with role description
    const prompt = `You are Doctor, a healthcare consultant. A patient is asking: "${input}". Please respond like a doctor and suggest medications and suggestions. Don't ask many questions and conclude the chat after 10 conversations by suggesting medicines at last. Don't say that you are an AI, act like a doctor.`;

    setMessages([...messages, { text: input, type: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBYHQjXv9aE6Juxfa3srSJ0lGm_KkUEmpI',
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const botMessage = response.data.candidates[0].content.parts[0].text;
        
        setMessages([...messages, { text: input, type: 'user' }, { text: botMessage, type: 'bot' }]);
      } else {
        setMessages([...messages, { text: input, type: 'user' }, { text: 'No response from bot', type: 'bot' }]);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...messages, { text: 'Error fetching response', type: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <div className="chat-messages space-y-4 mb-4 overflow-y-hidden overflow-scroll ">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
          >
            {message.text}
          </div>
        ))}
        {loading && <div className="message p-2 rounded-lg bg-gray-200 text-black">Loading...</div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l-lg"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
