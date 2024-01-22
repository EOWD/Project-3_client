import React from "react";

import { Link } from "react-router-dom";
import {UserContext} from '../../context/UserContext';
import {useContext}from 'react'
function Footer() {
    const {isLoggedIn,isLoading}=useContext(UserContext)
    return (
    <div>
   { !isLoggedIn?(<> <Link to={'/home'}>Home</Link>
     <Link to={'/login'}>Login</Link>
     
     <Link to={'/signup'}>Signup</Link></>):(<> <Link to={'/home'}>Home</Link>
     
     <Link to={'/profile'}>Profile</Link></>)}
    </div>
  );
 
}

export default Footer;
