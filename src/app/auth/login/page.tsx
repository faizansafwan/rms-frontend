'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number,
}

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Check for token in localStorage on component mount
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000; // in seconds
  
        if (decoded.exp > currentTime) {
          router.push('/main');
        } else {
          localStorage.removeItem('token'); // Optional: remove expired token
        }
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('token'); // Optional: clean up if token is malformed
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Shop/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/main');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-semibold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded transition duration-300 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-brown cursor-pointer'
          }`} >
          {loading ? 'Logging in...' : 'Login'}
        </button>

      </form>
    </div>
  );
};

export default LoginPage;
