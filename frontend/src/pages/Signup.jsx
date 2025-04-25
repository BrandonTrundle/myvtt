import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const { fetchUser, user } = useContext(UserContext);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    terms: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`📝 Form field change: ${name} = ${type === 'checkbox' ? checked : value}`);
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📡 Submitting form:", form);

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match!');
      console.warn('⚠️ Passwords do not match');
      return;
    }

    if (!form.terms) {
      setMessage('You must agree to the terms of service.');
      console.warn('⚠️ Terms not agreed to');
      return;
    }

    try {
      console.log('📡 Sending signup request...');
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      if (!data || data.message) {
        setMessage(data.message || 'Signup failed');
        console.warn('⚠️ Signup failed:', data.message);
      } else {
        console.log("✅ Signup successful, storing token...");
        localStorage.setItem('token', data.token);

        await fetchUser();

        if (user?.onboardingComplete) {
          console.log("📡 Redirecting to /user-welcome");
          navigate('/user-welcome');
        } else {
          console.log("📡 Redirecting to /welcome");
          navigate('/welcome');
        }
      }
    } catch (err) {
      console.error('❌ Create error:', err);
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="bg-parchment min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-lg border border-arcanabrown">
        <h2 className="text-center text-3xl font-extrabold text-arcanadeep">
          Create your ArcanaTable account
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-arcanadeep">First Name</label>
              <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-arcanadeep">Last Name</label>
              <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-arcanadeep">Email address</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-arcanadeep">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-arcanadeep">Confirm Password</label>
            <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex items-center">
            <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} className="h-4 w-4" />
            <label className="ml-2 text-sm text-arcanadeep">Subscribe to newsletter</label>
          </div>

          <div className="flex items-center">
            <input name="terms" type="checkbox" required checked={form.terms} onChange={handleChange} className="h-4 w-4" />
            <label className="ml-2 text-sm text-arcanadeep">
              I agree to the <a href="#" className="underline text-arcanared">Terms of Service</a>.
            </label>
          </div>

          <div>
            <button type="submit" className="w-full bg-arcanared text-white py-2 px-4 rounded hover:bg-arcanabrown transition">
              Create Account
            </button>
          </div>

          {message && (
            <div className="text-center text-sm mt-2 text-arcanared">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
