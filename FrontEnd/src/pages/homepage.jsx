import styles from '../CSSModule/homepage.module.css'

const HomePage = () => {
  return (
    <div className='main'>
      <h1>Welcome to the Home Page</h1>
      <p>This is the content of the home page.</p>
      <div className='game-list'>
        <div className='game-card'>
          <div className='game-thumbnail'></div>
          <div className='game-title'>Game title</div>
        </div>
        <div className='game-card'>
          <div className='game-thumbnail'></div>
          <div className='game-title'>Game title</div>
        </div>
        <div className='game-card'>
          <div className='game-thumbnail'></div>
          <div className='game-title'>Game title</div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
