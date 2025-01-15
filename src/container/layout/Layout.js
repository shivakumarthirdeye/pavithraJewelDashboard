import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, } from 'react-router-dom';
import Sidebar from './Sidebar';
import layoutStyle from './layout.module.css';
import Header from './Header';
import {useDispatch, useSelector} from  "react-redux"
import { getProfile, setToken } from '../../redux/userSlice';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const [layout, setLayout] = useState(false);
  const path = location.pathname.split('/')[1];
  const pathName = location.pathname;
  const token = localStorage.getItem("token");
  const  {isLoggedIn}  = useSelector(state => state.user)
  


  // Get the callback URL from the query parameters
  const callbackUrl = new URLSearchParams(location.search).get('callbackUrl');

  useEffect(() => {
    if (token) {
      dispatch(setToken(token));
      dispatch(getProfile());
    }
  }, [dispatch,token])

  useEffect(() => {
    if (isLoggedIn) {
      setLayout(true)
      if (path === "" || path === "login" ) {
        if (callbackUrl) {
          return navigate(callbackUrl)
        }
        navigate('/dashboard')
      }
    } else {
      if (path === "" || path === "login" ) {
        return () => { }
      }
      // if callback url present
      if (callbackUrl) {
        return navigate(`/?callbackUrl=${callbackUrl}`)
      }

      // if user is on another route then give the callback url
      if (pathName !== "/") {
        return navigate(`/?callbackUrl=${location.pathname}`)
      }

      navigate(`/`)
    }
  }, [path, isLoggedIn,pathName,callbackUrl,location,navigate])

  // { layout ? <><Header /> <Sidebar children={children} /></> : children }

// useEffect(() => {
//     setLayout(true)
//     navigate('/dashboard')
// }, [])

  return (
    <div className={layoutStyle.mainContainer}>
      {
        path === "" || path === "login" ? children
          : <>
           <Header children={children} />
           <Sidebar />
          </>
      }
      {/* { layout ? <><Header children={children}/> <Sidebar children={children}/></> : children } */}
    </div>
  )
}

export default Layout;