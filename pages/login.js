import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react'
import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import { AuthContext } from '../contexts/AuthContext';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Login (){
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const { loading, setAuth, setUser, auth } = useContext(AuthContext);

    // Formik config
    const formik = useFormik({
        initialValues: {
          username: '',
          password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field'),
            password: Yup.string()
                .max(32, 'Must be 32 characters or less')
                .min(8, 'Must be 8 characters or more')
                .required('Required field'),
        }),
        onSubmit: (values) => {
          setSubmitting(true);
          fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'applicataion/json'
            },
            body: JSON.stringify({ username: values.username, password: values.password })
          }).then(response => response.json())
          .then(x => {
            if (!x.success){
              setSubmitting(false)
              alert(x.message)
            }
            else {
              setUser(x.user)
              setAuth(x.success);
            }
          })
        },
      });
      if (auth) router.push('/profile');
      return (
        <div className={styles.main}>
            {loading? <div>Loading...</div> :
            (!auth?
            <>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
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
                <div>
                    <input type="checkbox" id="chkbox" className="inline-flex items-center" className={styles.pwChkbox}/>
                    <label htmlFor="chkbox" className={styles.pwChkbox}> Remind my password</label>
                </div>
                <button
                    type="submit"
                    className={!submitting ? styles.loginSubmitBtn : styles.loginSubmitBtnSbmt }
                    disabled={submitting}
                >Submit</button>
                <Link href="/"><a className={styles.pwForget}>I am already registred</a></Link>
                </form>
              </>
            : <></>)}
          </div>
    )
}