import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import userPlaceHolder from '../assets/user-placeholder.svg';
import User from '../interfaces/user';
import userService from '../services/user-service';
import AlertComponent from './alert';
import Alerts from '../enums/alerts';

const registerSchema = z
  .object({
    profilePicture: z.any().refine((file) => file?.length > 0, {
      message: 'Profile picture is required',
      path: ['profilePicture'],
    }),
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(1, 'Full name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

interface FormData extends z.infer<typeof registerSchema> {}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<Alerts>(Alerts.Error);

  const inputFileRef: { current: HTMLInputElement | null } = { current: null };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });

  const [profilePicture] = watch(['profilePicture']);

  const onSubmit = (data: FormData) => {
    const { request } = userService.uploadImage(data.profilePicture[0]);
    request
      .then((response) => {
        const user: User = {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          imageUrl: response.data.url,
        };
        const { request } = userService.register(user);
        request
          .then(() => {
            navigate('/');
          })
          .catch((error) => {
            setAlertMessage((error.response ? error.response.data : error.message));
            setAlertType(Alerts.Error);
            setShowAlert(true);
            console.error(error);
          });
      })
      .catch((error) => {
        setAlertMessage((error.response ? error.response.data : error.message));
        setAlertType(Alerts.Error);
        setShowAlert(true);
        console.error(error);
      });
  };

  useEffect(() => {
    if (profilePicture != null && profilePicture[0]) {
      setProfilePreview(URL.createObjectURL(profilePicture[0]));
    }
  }, [profilePicture]);

  const { ref, ...restRegisterParams } = register('profilePicture');

  return (
    <div className="card p-3" style={{ width: '40%' }}>
      <h3 className="text-center">Sign Up</h3>

      {/* Profile Picture Upload */}
      <div className="text-center mb-2 mt-2">
        <label htmlFor="profilePicture" className="d-block" style={{ cursor: 'pointer' }}>
          <img
            src={profilePreview || userPlaceHolder}
            alt="Profile"
            className="rounded-circle"
            width="100"
            height="100"
            style={{ objectFit: 'cover' }}
          />
        </label>
        <input
          id="profilePicture"
          ref={(item) => {
            inputFileRef.current = item;
            ref(item);
          }}
          {...restRegisterParams}
          type="file"
          className="form-control mt-2 d-none"
          accept="image/*"
        />
        <div className="text-danger mt-1 fs-6">
          {profilePicture == null || !profilePicture[0] ? 'Profile picture is required' : ''}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 vh-5">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="mb-2">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            {...register('fullName')}
          />
          <div className="invalid-feedback">{errors.fullName?.message}</div>
        </div>

        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password')}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            {...register('confirmPassword')}
          />
          <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>
          Sign Up
        </button>
      </form>
      <div className="text-center mt-3">
        <p>
          Already have an account?{' '}
          <Link
            className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
      <AlertComponent
        showAlert={showAlert}
        alertType={alertType}
        message={alertMessage}
        onCloseAlert={() => setShowAlert(false)}
      ></AlertComponent>
    </div>
  );
};

export default Register;
