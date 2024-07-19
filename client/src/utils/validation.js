import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  userName: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export const employeeValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile: Yup.string().required('Mobile number is required'),
  designation: Yup.string().required('Designation is required'),
  gender: Yup.string().required('Gender is required'),
  course: Yup.string().required('Course is required'),
  image: Yup.mixed().required('Image is required').test(
    'fileFormat',
    'Unsupported Format',
    value => value && ['image/jpeg', 'image/png'].includes(value.type)
  ),
});
