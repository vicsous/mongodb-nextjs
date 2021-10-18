import React from 'react';
import styles from '../styles/Navbar.module.css';

export default function LoadingNav (){
    return (
        <div>
            {/* Menu button nav list */}
            <nav className={styles.navbar}>
                {/* Logo */}
                <div className={styles.logo}>
                    NextApp
                </div>
            </nav>
        </div>
    )
}