import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../services/axiosInstance';

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const MyForm = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post('/login', values);
      localStorage.setItem('authToken', response.data.token); // Save token
    } catch (error) {
      console.error('Failed to submit data:', error);
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Field name="username" type="text" placeholder="Username" />
        <Field name="password" type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default MyForm;
