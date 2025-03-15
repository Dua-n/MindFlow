import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Assistant = ({ 
  toggleAssistant, 
  colors, 
  messages = [], 
  onNewMessage,
  onOptionSelect,
  systemOverview
}) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Check environment variables on mount
  useEffect(() => {
    console.log('Environment variables:', {
      apiUrl: import.meta.env.VITE_OPENROUTER_API_URL,
      hasApiKey: !!import.meta.env.VITE_OPENROUTER_API_KEY
    });
  }, []);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Add user message to the chat
      onNewMessage(userInput.trim());
      
      try {
        setIsLoading(true);
        
        // Prepare context for the AI
        const context = {
          systemOverview: systemOverview || {},
          recentMessages: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.message
          }))
        };
        
        // Call the AI API
        const response = await callAI(userInput, context);
        
        // Process the AI response
        if (response) {
          onNewMessage(response, 'assistant');
        }
      } catch (error) {
        console.error('Error calling AI:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
        
        // Check if it's a network error
        if (error.message && error.message.includes('Network Error')) {
          errorMessage = 'Network error: Unable to connect to the AI service. Please check your internet connection.';
        }
        // Check if it's a CORS error
        else if (error.message && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
          errorMessage = 'CORS error: The browser blocked the request due to cross-origin restrictions.';
        }
        else if (error.response) {
          // Handle specific OpenRouter error codes
          if (error.response.status === 401) {
            errorMessage = 'Authentication error: Please check your API key.';
          } else if (error.response.status === 429) {
            errorMessage = 'Rate limit exceeded: The API is receiving too many requests. Please try again later.';
          } else if (error.response.status === 500) {
            errorMessage = 'The AI service is experiencing issues. Please try again later.';
          } else {
            errorMessage = `API error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
          }
        }
        
        onNewMessage(errorMessage, 'assistant');
      } finally {
        setIsLoading(false);
        setUserInput('');
      }
    }
  };

  // Function to call the AI API
  const callAI = async (userMessage, context) => {
    try {
      const apiUrl = import.meta.env.VITE_OPENROUTER_API_URL;
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      console.log('API Configuration:', {
        url: apiUrl,
        hasKey: !!apiKey
      });
      
      if (!apiUrl || !apiKey) {
        console.error('API URL or API Key not configured');
        return 'I need to be configured with an API key to provide intelligent responses.';
      }
      
      // Construct the messages array for the API
      const messages = [
        {
          role: 'system',
          content: `You are an intelligent executive assistant in a productivity app called MindFlow. 
          You help the user manage their projects, tasks, journal entries, and provide insights.
          
          Current system overview:
          ${JSON.stringify(context.systemOverview, null, 2)}
          
          Guidelines:
          1. Be proactive, helpful, and provide actionable suggestions.
          2. When appropriate, offer specific next steps the user can take.
          3. For project-related questions, analyze progress, deadlines, and priorities.
          4. For journal-related questions, identify patterns, themes, and sentiment.
          5. When suggesting focus sessions, consider task priority and deadlines.
          6. Format your responses clearly with bullet points or numbered lists when providing options.
          7. Keep responses brief but informative - under 150 words when possible.`
        },
        ...context.recentMessages,
        {
          role: 'user',
          content: userMessage
        }
      ];
      
      console.log('Making API request with messages:', messages);
      
      // The correct endpoint for OpenRouter is /api/v1/chat/completions
      const response = await axios.post(`${apiUrl}/chat/completions`, {
        model: 'deepseek/deepseek-r1',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MindFlow Assistant'
        }
      });
      
      console.log('API Response:', response.data);
      
      // Extract the assistant's response
      if (response.data && 
          response.data.choices && 
          response.data.choices.length > 0 && 
          response.data.choices[0].message) {
        return response.data.choices[0].message.content;
      } else {
        console.error('Unexpected API response structure:', response.data);
        return 'I received an unexpected response format. Please try again.';
      }
    } catch (error) {
      console.error('Error in AI API call:', error);
      if (error.response) {
        console.error('API error response:', error.response.data);
        console.error('API error status:', error.response.status);
        console.error('API error headers:', error.response.headers);
      }
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  // Format time until deadline
  const formatTimeUntil = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  // Render different message content types
  const renderMessageContent = (msg) => {
    return (
      <>
        <p className="text-sm whitespace-pre-line">{msg.message}</p>
        
        {msg.projects && (
          <div className="mt-3 space-y-2">
            {msg.projects.map((project, index) => (
              <div
                key={index}
                className="p-2 rounded-lg text-sm"
                style={{ background: colors.cardBg }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-xs">{project.progress}%</span>
                </div>
                <div className="text-xs opacity-70">Due: {project.deadline}</div>
                <div className="mt-1 h-1 rounded-full" style={{ background: colors.cardHighlight }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progress}%`,
                      background: colors.primary
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {msg.deadlines && (
          <div className="mt-3 space-y-2">
            {msg.deadlines.map((deadline, index) => (
              <button
                key={index}
                onClick={() => onOptionSelect(msg.id, index)}
                className="w-full p-2 rounded-lg text-sm text-left transition-colors hover:opacity-80"
                style={{ background: colors.cardBg }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{deadline.name}</span>
                  <ChevronRight size={16} />
                </div>
                <div className="text-xs opacity-70">Due: {deadline.deadline}</div>
              </button>
            ))}
          </div>
        )}
        
        {msg.taskList && (
          <div className="mt-3 space-y-2">
            {msg.taskList.map((task, index) => (
              <div
                key={index}
                className="p-2 rounded-lg text-sm"
                style={{ background: colors.cardBg }}
              >
                <div className="font-medium">{task.name}</div>
                <div className="text-xs opacity-70 mb-1">Due: {task.deadline}</div>
                {task.steps && (
                  <div className="ml-4 mt-1 text-xs space-y-1">
                    {task.steps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="flex items-center"
                      >
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{
                            background: step.completed ? colors.primary : colors.cardHighlight
                          }}
                        />
                        <span className={step.completed ? 'line-through opacity-50' : ''}>
                          {step.description}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {msg.options && (
          <div className="flex flex-wrap justify-end mt-2 gap-2">
            {msg.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onOptionSelect(msg.id, idx)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background:
                    msg.selectedOption === idx
                      ? colors.buttonBg
                      : "transparent",
                  color:
                    msg.selectedOption === idx
                      ? colors.buttonText
                      : colors.primary,
                  border: `1px solid ${colors.primary}`,
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        {msg.breakdown && (
          <div
            className="mt-3 p-2 rounded-lg text-sm"
            style={{ background: colors.cardBg }}
          >
            <ol className="list-decimal pl-5 space-y-1">
              {msg.breakdown.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="w-80 h-full p-4 shadow-lg rounded-l-3xl overflow-hidden flex flex-col"
      style={{ background: colors.cardBg }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Executive Assistant</h2>
        <button onClick={toggleAssistant} style={{ color: colors.text }}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-3 rounded-xl ${
              msg.type === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
            style={{
              background: msg.type === 'user' ? colors.buttonBg : colors.cardHighlight,
              color: msg.type === 'user' ? colors.buttonText : colors.text,
              maxWidth: '85%'
            }}
          >
            <div className="text-xs opacity-70 mb-1">{msg.timestamp}</div>
            {renderMessageContent(msg)}
          </div>
        ))}
        {isLoading && (
          <div 
            className="p-3 rounded-xl mr-auto"
            style={{
              background: colors.cardHighlight,
              color: colors.text,
              maxWidth: '85%'
            }}
          >
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.primary }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ background: colors.primary }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ background: colors.primary }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {systemOverview && (
        <div
          className="p-3 rounded-xl mb-4"
          style={{ background: colors.cardHighlight }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">System Overview:</h3>
            <span className="text-xs">{new Date().toLocaleDateString()}</span>
          </div>
          <ul className="text-sm space-y-2">
            {systemOverview.priority && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span style={{ color: colors.primary }}>Priority:</span>{' '}
                  {systemOverview.priority.name} ({systemOverview.priority.progress}% complete)
                  {systemOverview.priority.daysStalled > 0 && (
                    <div className="text-xs opacity-70 mt-1">
                      Needs attention - Progress stalled for {systemOverview.priority.daysStalled} days
                    </div>
                  )}
                </div>
              </li>
            )}
            {systemOverview.upcoming && (
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span style={{ color: colors.primary }}>Upcoming:</span>{' '}
                  {systemOverview.upcoming.name} ({formatTimeUntil(systemOverview.upcoming.deadline)})
                </div>
              </li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-auto">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full py-2 px-4 rounded-xl text-sm placeholder-color"
          style={{
            background: colors.buttonBg,
            color: colors.buttonText,
          }}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default Assistant; 
