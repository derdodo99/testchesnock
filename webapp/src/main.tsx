import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import WebApp from '@twa-dev/sdk'

WebApp.ready()
WebApp.expand()

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
