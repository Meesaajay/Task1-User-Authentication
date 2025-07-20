import React, { useState } from "react";
import axios from "axios";
import DialogBox from "./DialogBox";
import "./AuthForm.css";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    agree: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    agree: "",
  });
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (
          isSignup &&
          !value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        ) {
          error = "Please enter a valid email address";
        }
        break;
      case "username":
        if (value.length < 4) {
          error = "Username must be at least 4 characters";
        } else if (!value.match(/^[a-zA-Z0-9_]+$/)) {
          error = "Only letters, numbers and underscores allowed";
        }
        break;
      case "password":
        if (isSignup && value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (
          isSignup &&
          (!value.match(/[A-Z]/) || !value.match(/[0-9]/))
        ) {
          error = "Include at least one number and uppercase letter";
        }
        break;
      case "agree":
        if (isSignup && !value) {
          error = "You must accept the terms";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", form.email),
      username: validateField("username", form.username),
      password: validateField("password", form.password),
      agree: validateField("agree", form.agree),
    };

    setErrors(newErrors);

    if (isSignup) {
      return (
        !newErrors.email &&
        !newErrors.username &&
        !newErrors.password &&
        !newErrors.agree
      );
    } else {
      return !newErrors.username && !newErrors.password;
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (error) {
      showDialog("Validation Error", error, "error");
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setForm({ email: "", username: "", password: "", agree: false });
    setErrors({ email: "", username: "", password: "", agree: "" });
  };

  const showDialog = (title, message, type = "success") => {
    setDialog({ show: true, title, message, type });
    setTimeout(
      () => setDialog({ show: false, title: "", message: "", type: "" }),
      3000
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessage = isSignup
        ? "Please fix all form errors before signing up"
        : "Please enter valid credentials";
      return showDialog("Form Error", errorMessage, "error");
    }

    try {
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignup
        ? {
            email: form.email,
            username: form.username,
            password: form.password,
          }
        : {
            username: form.username,
            password: form.password,
          };

      const res = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload
      );

      if (res.data && res.data.user) {
        showDialog(
          "Success!",
          isSignup
            ? `Account created for ${res.data.user.username}!`
            : `Welcome back, ${res.data.user.username}!`,
          "success"
        );

        if (isSignup) {
          setIsSignup(false);
          setForm((prev) => ({ ...prev, email: "", agree: false }));
        }
      } else {
        showDialog("Error", "Unexpected response from server", "error");
      }
    } catch (err) {
      let errorMsg = "Authentication failed";

      if (err.response) {
        if (err.response.status === 401) {
          errorMsg = "Invalid username or password";
        } else if (err.response.status === 400) {
          errorMsg = err.response.data.message || "Invalid request";
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      }

      showDialog("Error", errorMsg, "error");
    }
  };

  const closeDialog = () => {
    setDialog({ show: false, title: "", message: "", type: "" });
  };

  return (
    <div className={`auth-container ${isSignup ? "signup-mode" : ""}`}>
      {/* Login Form */}
      <div className="form-container login-container">
        <form className="form-content" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <div className={`input-group ${errors.username ? "error" : ""}`}>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
            />
            <label>Username</label>
            {errors.username && (
              <span className="input-error">{errors.username}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "error" : ""}`}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
            />
            <label>Password</label>
            {errors.password && (
              <span className="input-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Log In
          </button>

          <p className="switch-text">
            Don't have an account?{" "}
            <span className="switch-link" onClick={toggleForm}>
              Sign Up
            </span>
          </p>
        </form>
      </div>

      {/* Signup Form */}
      <div className="form-container signup-container">
        <form className="form-content" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <div className={`input-group ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required={isSignup}
            />
            <label>Email</label>
            {errors.email && (
              <span className="input-error">{errors.email}</span>
            )}
          </div>

          <div className={`input-group ${errors.username ? "error" : ""}`}>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
            />
            <label>Username</label>
            {errors.username && (
              <span className="input-error">{errors.username}</span>
            )}
          </div>

          <div className={`input-group ${errors.password ? "error" : ""}`}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder=" "
              required
            />
            <label>Password</label>
            {errors.password && (
              <span className="input-error">{errors.password}</span>
            )}
          </div>

          {isSignup && (
            <div className={`checkbox-container ${errors.agree ? "error" : ""}`}>
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="agree">
                I agree to the <a href="#terms">Terms and Conditions</a>
              </label>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Sign Up
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <span className="switch-link" onClick={toggleForm}>
              Log In
            </span>
          </p>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div
            className={`overlay-panel ${
              isSignup ? "overlay-right" : "overlay-left"
            }`}
          >
            <h2>{isSignup ? "Welcome Back!" : "Hello, Friend!"}</h2>
            <p>
              {isSignup
                ? "To keep connected with us please login with your personal info"
                : "Enter your personal details and start your journey with us"}
            </p>
            <button className="ghost-btn" onClick={toggleForm}>
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      {dialog.show && (
        <div className="dialog-container">
          <DialogBox
            title={dialog.title}
            message={dialog.message}
            type={dialog.type}
            onClose={closeDialog}
          />
        </div>
      )}
    </div>
  );
};

export default AuthForm;
