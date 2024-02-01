
import Header from './header/Header'
import Footer from './Footer'
import './header/header.css';
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext';

function Layout({children}) {
  const { isLoggedIn } = useContext(UserContext)
  return (
    <div>
      <Header/>
        <div id={isLoggedIn ? 'main' : ''}>
          {children}
        <Footer />
        </div>
    </div>
  )
}

export default Layout
