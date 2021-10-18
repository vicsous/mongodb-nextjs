import React, { useState, useContext } from 'react';
import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import { useRouter } from 'next/router';

import { AuthContext } from '../contexts/AuthContext';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Signup (){
    const [submitting, setSubmitting] = useState(false);

    const { auth, loading } = useContext(AuthContext);

    const router = useRouter();

    // Formik config
     const formik = useFormik({
        initialValues: {
          username: '',
          email: '',
          password: '',
          password2: '',

        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field'),
            email: Yup.string()
                .email('Invalid email address')
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field'),
            password: Yup.string()
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field'),
            password2: Yup.string()
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: (values) => {
          setSubmitting(true);
          fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'applicataion/json'
            },
            body: JSON.stringify({ username: values.username, password: values.password, email: values.email })
          }).then(response => response.json())
          .then(data => {
            if (!data.success){
              setSubmitting(false);
              alert(data.message);
            }
            else {
              router.push('/login');
            }
          })
        },
      });
        
    if (loading) return <h1>Loading</h1>;

    if (auth) router.push('/login');

    return (
        <div className={styles.main}>
          {loading? <div>Loading...</div> :
            (!auth? 
            <>
            <h1 className={styles.title}>Signup</h1>
            <form onSubmit={() => setLoginOpen(!loginOpen)} onSubmit={formik.handleSubmit} className={styles.loginForm}>
                <input
                    className={formik.errors.username ? styles.loginInputError : styles.loginInput}
                    id="username"
                    name="username"
                    placeholder="Username"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (<div className={styles.errorMsg}>{formik.errors.username}</div>) : null}
                <input
                    className={formik.errors.username ? styles.loginInputError : styles.loginInput}
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (<div className={styles.errorMsg}>{formik.errors.email}</div>) : null}
                <input
                    className={formik.errors.password ? styles.loginInputError : styles.loginInput}
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (<div className={styles.errorMsg}>{formik.errors.password}</div>) : null}
                <input
                    className={formik.errors.password2 ? styles.loginInputError : styles.loginInput}
                    id="password2"
                    name="password2"
                    placeholder="Password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password2}
                />
                {formik.touched.password2 && formik.errors.password2 ? (<div className={styles.errorMsg}>{formik.errors.password2}</div>) : null}
                <button
                    type="submit"
                    className={!submitting ? styles.loginSubmitBtn : styles.loginSubmitBtnSbmt }
                    disabled={submitting}
                >Submit</button>
                <Link href="/"><a className={styles.pwForget}>I am already registred</a></Link>
                </form>
                </>: <></>)}
        </div>
    )
}