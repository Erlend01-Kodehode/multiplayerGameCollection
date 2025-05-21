import Nav from './Nav'
import logo from '/logo-PIXEL_PANDEMONIUM.png'

export default function Header() {
  return (
    <div className='header'>
      <img className='logo' src={logo} alt='' />
      <Nav />
    </div>
  )
}
