import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from '../services/axios';
import { employeeValidationSchema } from '../utils/validation';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/employees', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employees/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          course: '',
          image: null,
        }}
        validationSchema={employeeValidationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
          });

          try {
            if (selectedEmployee) {
              await axios.put(`/employees/${selectedEmployee._id}`, formData, {
                headers: {
                  'x-auth-token': localStorage.getItem('token'),
                  'Content-Type': 'multipart/form-data',
                },
              });
            } else {
              await axios.post('/employees', formData, {
                headers: {
                  'x-auth-token': localStorage.getItem('token'),
                  'Content-Type': 'multipart/form-data',
                },
              });
            }

            setSelectedEmployee(null);
            resetForm();
            const res = await axios.get('/employees', {
              headers: { 'x-auth-token': localStorage.getItem('token') },
            });
            setEmployees(res.data);
          } catch (error) {
            console.error('Error submitting form:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="mobile">Mobile</label>
              <Field type="text" name="mobile" />
              <ErrorMessage name="mobile" component="div" />
            </div>
            <div>
              <label htmlFor="designation">Designation</label>
              <Field type="text" name="designation" />
              <ErrorMessage name="designation" component="div" />
            </div>
            <div>
              <label htmlFor="gender">Gender</label>
              <Field type="text" name="gender" />
              <ErrorMessage name="gender" component="div" />
            </div>
            <div>
              <label htmlFor="course">Course</label>
              <Field type="text" name="course" />
              <ErrorMessage name="course" component="div" />
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                type="file"
                name="image"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                }}
              />
              <ErrorMessage name="image" component="div" />
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      <h2>Employee List</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id}>
            <img
              src={`http://localhost:5000/${emp.image}`}
              alt={emp.name}
              width="50"
              height="50"
            />
            {emp.name} - {emp.email} - {emp.mobile} - {emp.designation} - {emp.gender} - {emp.course}
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeManagement;
