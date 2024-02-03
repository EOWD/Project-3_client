import React from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react'
import { MessagesSquare, CircleUserRound, Home, LogOut, Folder, AudioLines } from 'lucide-react';

function Header() {
  const { isLoggedIn, isLoading, handleLogout } = useContext(UserContext);
  const iconSize = 28;
  
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const openNavButton = document.getElementById("openNav");
  
    if(sidebar.style.width === "10%") {
      sidebar.style.width = "5%";
      document.getElementById("main").style.maxWidth = "95%";
      openNavButton.innerHTML = "&#9776;";
      openNavButton.style.padding = "10px 14px";
      sidebar.classList.add("toggled");
    } else {
      sidebar.style.width = "10%";
      document.getElementById("main").style.maxWidth = "90%";
      openNavButton.innerHTML = "X";
      openNavButton.style.padding = "12px 17px";
      sidebar.classList.remove("toggled");
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
        <nav className='loggedIn header-container toggled' id="sidebar"> 
          <button id="openNav" onClick={toggleSidebar}>&#9776;</button>
          <br></br>
          <div className="sidebar-container">
            <div>
              <NavLink to={'/'} className="toggledIcon">
                <Home size={iconSize} />
              </NavLink>
              <NavLink to={'/'}>Home</NavLink>
            </div>
            <br></br>
            <div>
              <NavLink to={'/profile'} className="toggledIcon">
                <CircleUserRound size={iconSize} />
              </NavLink>
              <NavLink to={'/profile'}>Profile</NavLink>
            </div>
            <br></br>
            <div>
              <NavLink to={'/voice'} className="toggledIcon">
                <AudioLines size={iconSize} />
              </NavLink>
              <NavLink to={'/voice'}>Chat</NavLink>
            </div>
          </div>
          <br></br>
          <div>
            <div>
              <NavLink to={'/drive'} className="toggledIcon">
                <Folder size={iconSize} />
              </NavLink>
              <NavLink to={'/drive'}>Drive</NavLink>
            </div>
          </div>
          <br></br>
          <div className="logoutButton" onClick={handleLogout}>
              <LogOut size={22} color="gray" />
          </div>
        </nav>
      </>
    );
  }
}

export default Header;


