# MindFlow - AI-Powered Productivity App

MindFlow is a comprehensive productivity application that helps you manage your projects, tasks, journal entries, and more. The app includes an AI-powered Executive Assistant that can provide intelligent responses and suggestions based on your data.

## Features

- **Journal**: Record and analyze your thoughts and feelings
- **Projects**: Track progress on your various projects
- **Focus**: Use the Pomodoro technique to focus on important tasks
- **Admin**: Manage administrative tasks and deadlines
- **Reflection**: Guided reflection prompts for personal growth
- **AI Assistant**: Get intelligent help and insights from the AI-powered Executive Assistant

## Setting Up the AI Assistant

The Executive Assistant can be powered by an AI model through the OpenRouter API. To set this up:

1. Create a `.env` file in the root directory of the project
2. Add the following environment variables:
   ```
   REACT_APP_OPENROUTER_API_URL=https://openrouter.ai/api/v1
   REACT_APP_OPENROUTER_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual OpenRouter API key

If you don't provide an API key, the Assistant will fall back to using pre-programmed responses.

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using the AI Assistant

1. Click the "Assistant" button in the sidebar to open the Executive Assistant panel
2. Type your question or request in the input field at the bottom
3. The AI will respond with relevant information and suggestions based on your data
4. You can click on options provided by the Assistant to take specific actions

The Assistant can help with:
- Checking project status
- Managing deadlines
- Starting focus sessions
- Providing journal insights
- Task management
- And much more!

## Technologies Used

- React
- Tailwind CSS
- Axios for API requests
- OpenRouter API for AI capabilities