import { Outlet } from 'react-router-dom';

import './App.css'
import BackgroundProvider from './utility/bgProvider.jsx';

function App() {

  return (
    <BackgroundProvider>
    <>
      <div className='app'>
        <header>

        </header>
        <main>
          <Outlet/>
        </main>
        <footer>

        </footer>
      </div>
    </>
    </BackgroundProvider>
  )
}

export default App
