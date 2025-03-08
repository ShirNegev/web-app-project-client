import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import userService from '../services/user-service';
import User from '../interfaces/user';
import { useState } from 'react';
import Alerts from '../enums/alerts';
import AlertComponent from './alert';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface FormData extends z.infer<typeof loginSchema> {}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<Alerts>(Alerts.Error);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: FormData) => {
    const user: User = {
      email: data.email,
      password: data.password,
    };

    const { request } = userService.login(user);
    request
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        setShowAlert(true);
        setAlertMessage(error.response ? error.response.data : error.message);
        setAlertType(Alerts.Error);
        console.error(error);
      });
  };

  return (
    <div className="card p-4" style={{ width: '35%' }}>
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password')}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>
          Login
        </button>
      </form>
      <div className="text-center mt-3">
        <button className="btn btn-dark w-100">
          <i className="bi bi-google me-2"></i>Sign in with Google
        </button>
      </div>
      <div className="text-center mt-3">
        <p>
          Don't have an account?{' '}
          <Link
            className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            to="/register"
          >
            Sign Up
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

export default Login;
