import React from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from '../../../context/UserContext';
import { useContext } from 'react'
import { Sliders, CircleUserRound, Globe, LogOut, Folder, AudioLines, Image, CalendarDays, NotebookPen } from 'lucide-react';

function Header() {
  const { isLoggedIn, isLoading, handleLogout } = useContext(UserContext);
  const iconSize = 28;

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const openNavButton = document.getElementById("openNav");

    if (sidebar.style.width === "10%") {
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

  if (!isLoggedIn) { /* GUEST NAV */
    return (
      <div className="header-container">
        <div className="guestNav-container">
          <h2 className="guestNav-logo">Viral <span className="logoBorder">PILOT</span></h2>
          <nav className="guestNav">
            <Link to={'/'}>Home</Link>
            <Link to={'/pricing'} onClick={(event) => event.preventDefault()}>Pricing</Link>
            <Link to={'/signup'}>Signup</Link>
          </nav>
          <Link className="guestNav-loginButton btnHover" to={'/login'}>Login</Link>
        </div>
      </div>
    );
  } else { /* LOGGED IN NAV */
    return (
      <>
        <nav className='loggedIn header-container toggled' id="sidebar">
          <button id="openNav" onClick={toggleSidebar}>&#9776;</button>
          <br></br>
          <div className="sidebar-container">
            <div>
              <NavLink to={'/'} className="toggledIcon">
                <AudioLines size={iconSize} /> <span className="toggledName">VoiceAI</span>
              </NavLink>
            </div>
            <br></br>
            <div>
              <NavLink to={'/tools'} className="toggledIcon">
                <Sliders size={iconSize} /> <span className="toggledName">AI Tools</span>
              </NavLink>
            </div>
            <br></br>
            <div>
              <div>
                <NavLink to={'/drive'} className="toggledIcon">
                  <Folder size={iconSize} /> <span className="toggledName">Drive</span>
                </NavLink>
              </div>
              <div className="subMenu">
                <NavLink to={'/drive/images'}><Image />Images</NavLink>
                <NavLink to={'/drive/calendar'}><CalendarDays />Calendar</NavLink>
                <NavLink to={'/drive/diary'}><NotebookPen />Diary</NavLink>
              </div>
            </div>
            <br></br>
            <div>
              <div>
                <NavLink to={'/profile'} className="toggledIcon">
                  <CircleUserRound size={iconSize} /> <span className="toggledName">Profile</span>
                </NavLink>
              </div>
            </div>
            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
            <br></br>
            <div className="logoutButton" onClick={handleLogout}>
              <LogOut size={22} color="gray" />
            </div>
            <div>
              <NavLink to={'/voice'} className="toggledIcon">
                <Globe size={iconSize} /> <span className="toggledName">Explore</span>
              </NavLink>
            </div>
          </div>
          <br></br>
        </nav>
      </>
    );
  }
}

export default Header;


