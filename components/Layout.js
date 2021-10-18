import LoadingNav from '../components/LoadingNav';
import Userbar from '../components/Userbar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Head from 'next/head';

import React, { useEffect, useState } from 'react';

import { AuthContext } from '../contexts/AuthContext';

export default function Layout ({children}) {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=> {
        async function getUser(){
            try{
                    const res = await fetch('/api/user', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'applicataion/json',
                          'Credentials':'include'
                        }})
                    const data = await res.json();
                    if (!data.data) {
                        setUser(null);
                        setAuth(false);
                    } else {
                        setUser(data.data);
                        setAuth(true);
                    }
                setLoading(false);
                } catch(error) {
                    setUser(null);
                    setAuth(false);
                    setLoading(false);
                    }
            }
        if (auth) {
            setLoading(false);
        }   else {
            getUser()
        }
    }, [])
    return(
            <AuthContext.Provider value={{ auth, loading, user, setAuth, setUser }}>
                <div>
                    <Head>
                        <title>Create Next App</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    { loading ? <LoadingNav /> : ( auth ? <Userbar/> : <Navbar />) }
                    <main className="bg-gray-100">
                        { children }
                    </main>
                    <Footer />
                </div>
            </AuthContext.Provider>
    )
}