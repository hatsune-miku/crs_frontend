import React from 'react'
import './App.scss'

import 'element-react'
import 'element-theme-default'
import { Button } from 'element-react'

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button type='primary'>Learn React</Button>
      </header>
    </div>
  )
}
