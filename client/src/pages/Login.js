import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '../utils/validation';
import axios from '../services/axios';

const Login = ({ history }) => {
  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{ userName: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await axios.post('/users/auth', values);
            localStorage.setItem('token', res.data.token);
            history.push('/dashboard');
          } catch (err) {
            alert('Invalid login details');
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="userName">Username</label>
              <Field type="text" name="userName" />
              <ErrorMessage name="userName" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
