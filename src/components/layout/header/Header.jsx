import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react'

function Header() {
  const { isLoggedIn, isLoading } = useContext(UserContext)
  
  function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var openNavButton = document.getElementById("openNav");
  
    if(sidebar.style.width === "25%") {
      sidebar.style.width = "5%";
      document.getElementById("main").style.maxWidth = "85%";
      openNavButton.innerHTML = "&#9776;";
      openNavButton.style.padding = "10px 10px";
    } else {
      sidebar.style.width = "25%";
      document.getElementById("main").style.maxWidth = "65%";
      openNavButton.innerHTML = "X";
      openNavButton.style.padding = "12px 10px";
    }
  }  

  if(!isLoggedIn){ /* GUEST NAV */
    return(
      <div className="header-container">
        <div className="guestNav-container">
          <h2 className="guestNav-logo">Viral <span className="logoBorder">PILOT</span></h2>
          <nav className="guestNav">
            <Link to={'/'}>Home</Link>
            <Link to={'/pricing'} onClick={ (event) => event.preventDefault() }>Pricing</Link>
            <Link to={'/signup'}>Signup</Link>
          </nav>
            <Link className="guestNav-loginButton btnHover" to={'/login'}>Login</Link>
        </div>
      </div>
    ); 
  } else { /* LOGGED IN NAV */
    return(
      <>
        <nav className='loggedIn header-container' id="sidebar"> 
          <button id="openNav" onClick={toggleSidebar}>&#9776;</button>
          <br></br>
          <Link to={'/'}>Home</Link>
          <br></br>
          <Link to={'/profile'}>Profile</Link>
          <br></br>
          <Link to={'/chat'}>Chat</Link>
        </nav>
      </>
    );
  }
}

export default Header;


