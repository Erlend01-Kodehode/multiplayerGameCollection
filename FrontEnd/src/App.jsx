import { Outlet } from 'react-router-dom'

import BackgroundProvider from './utility/bgProvider.jsx'
import Header from './components/UI/Header.jsx'
import './App.css'

function App() {
  return (
    <BackgroundProvider>
      <>
        <div className='app'>
          <header>
            <Header />
          </header>
          <main>
            <Outlet />
          </main>
          <footer></footer>
        </div>
      </>
    </BackgroundProvider>
  )
}

export default App
