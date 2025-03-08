import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import userPlaceHolder from "../assets/user-placeholder.svg";
import { Link } from "react-router-dom";

interface FormData {
  profilePicture: FileList | null;
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onChange" });

  // Watch password field to compare with confirm password
  const password = watch("password");

  const onSubmit = (data: FormData) => {
    console.log("Registered User:", data);
    alert("Registration successful!");
  };

  // Handle profile picture selection
  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  return (
      <div className="card p-4" style={{ width: "400px" }}>
        <h3 className="text-center">Sign Up</h3>

        {/* Profile Picture Upload */}
        <div className="text-center mb-2 mt-2">
          <label htmlFor="profilePicture" className="d-block">
            <img
              src={profilePreview || userPlaceHolder}
              alt="Profile"
              className="rounded-circle"
              width="100"
              height="100"
              style={{ objectFit: "cover", cursor: "pointer" }}
            />
          </label>
          <input
            id="profilePicture"
            type="file"
            className="form-control mt-2 d-none"
            accept="image/*"
            {...register("profilePicture")}
            onChange={handleProfileChange}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          {/* Full Name */}
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              {...register("fullName", { required: "Full name is required" })}
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={!isValid}>
            Sign Up
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            Already have an account? <Link className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" to="/login">Login</Link>
          </p>
        </div>
      </div>
  );
};

export default Register;
