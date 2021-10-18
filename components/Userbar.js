import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from '../styles/Navbar.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { AuthContext } from '../contexts/AuthContext';

// Clicking outside function
const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
  
    useEffect(() => {
      document.addEventListener("click", handleClick);
  
      return () => {
        document.removeEventListener("click", handleClick);
      };
    });
  };

export default function Userbar (){
  const { setAuth, setUser } = useContext(AuthContext)

  const router = useRouter();
    // Function to avoid 'window not defined' server side issue
    function getInitialWidth () {
      if(typeof window != 'undefined'){
          return window.innerWidth
        }
    }

    // Initialize window width variable
    const [width, setWidth] = useState(getInitialWidth());

    const [open, setOpen] = useState(false);

    // Window width update function
    function handleResize () {
        if(typeof window != 'undefined'){
          setWidth(window.innerWidth)
        }
    }

    // Hid menu button if window size is less than 640px
    useEffect(() => {
        if(typeof window != 'undefined'){
          window.addEventListener('resize', handleResize)
          if (width >= 640) {
            setOpen(false)
          }
        }
    }, [width]);

    // Clicking outside setup
    const menu = useRef();
    useOutsideClick(menu, () => {
        setOpen(!open)
    });

        // Logout
        function logout () {
          fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'applicataion/json'
            }
          }).then(response => response.json())
          .then(x => {
            if (!x.success){
              return router.push('/')
            }
            else {
              setAuth(false);
              setUser(null);
              return router.push('/')
            }
          })
        }
    return (
        <div>
            {/* Menu button nav list */}
            <nav className={styles.navbar}>
                {/* Logo */}
                <div className={styles.logo}>
                    NextApp
                </div>

                {/* Menu button */}
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => {setOpen(false)}} className={styles.menuBtn} onClick={() => setOpen(!open) } fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" } />
                    </svg>
                </button>

                {/* Nav list */}
                <ul className={styles.links}>
                    <li><Link href="/"><a className={styles.link}>Home</a></Link></li> 
                    <li><Link href="/profile"><a className={styles.link}>Profile</a></Link></li> 
                    <li><button className={styles.login} onClick={() => {logout()}}>Logout</button></li> 
                </ul>
            </nav>

            {/* Menu button nav list */}
            {open && (
                <nav ref={menu}>
                    <ul className={styles.menu}>
                        <li onClick={() => setOpen(false)}><Link href="/"><button className={styles.menuLink}>Home</button></Link></li>
                        <li onClick={() => setOpen(false)}><Link href="/profile"><button className={styles.menuLink}>Profile</button></Link></li>
                        <li onClick={() => logout()}><Link href="/login"><button className={styles.btnMenu}>Logout</button></Link></li> 
                    </ul>
                </nav>
            )}
        </div>
    )
}