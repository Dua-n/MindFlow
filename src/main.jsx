import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MindflowApp from './MindflowApp.jsx'
import { RootProvider } from './context/RootProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootProvider>
      <MindflowApp />
    </RootProvider>
  </React.StrictMode>,
)