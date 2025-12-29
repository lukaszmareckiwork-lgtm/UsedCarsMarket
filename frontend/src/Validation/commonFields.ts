import * as Yup from 'yup';

export const emailField = Yup.string()
  .required('Email is required')
  .email('Email must be a valid email');

export const passwordField = Yup.string()
  .required('Password is required')
  .min(5, 'Password must be at least 5 characters long');
