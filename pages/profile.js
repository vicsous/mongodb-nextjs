import React, { useContext } from 'react'
import styles from '../styles/Home.module.css';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Profile (){
    const { auth, user, loading } = useContext(AuthContext);
    const router = useRouter();

    if (loading) return <h1 className={styles.main}></h1>

    if (!auth) router.push('/');

    return (
    <div className={styles.main}>
        { !user ? 
        <></> : 
        <>
            <h1 className={styles.title}>Profile</h1>
            <h3>ID: {user._id}</h3>
            <h3>Username: {user.username}</h3>
            <h3>Email: {user.email}</h3>
        </>
        }
    </div>
    )
}