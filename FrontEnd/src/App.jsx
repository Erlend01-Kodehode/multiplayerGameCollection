import { Outlet } from 'react-router-dom'

import BackgroundProvider from './utility/bgProvider.jsx'
import Header from './components/UI/Header.jsx'

function App() {
  return (
    <BackgroundProvider>
      <>
        <div className='app'>
          <Header />
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
