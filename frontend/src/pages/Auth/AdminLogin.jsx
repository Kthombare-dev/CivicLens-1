import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const { login, isAuthenticated, user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            if (currentUser.role === 'admin') navigate('/admin');
            else if (currentUser.role === 'official') navigate('/officer');
            else navigate('/dashboard');
        }
    }, [isAuthenticated, currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (serverError) {
            setServerError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setServerError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setServerError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const authData = {
                token: data.data.token,
                ...data.data.user
            };

            // STRICT ADMIN CHECK
            if (authData.role !== 'admin') {
                throw new Error('Unauthorized: Admin access only');
            }

            login(authData);
            navigate('/admin');
        } catch (err) {
            console.error('Admin Login error:', err);
            setServerError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen relative flex flex-col items-center justify-center p-4"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/admin-bg-new.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >

            {/* Header / Logo section */}
            <div className="mb-8 text-center flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-4 justify-center">
                    {/* Assuming the original image logo contains the text, applying invert to turn it white against the blue background */}
                    <img
                        src="/CivicLensLogo.png"
                        alt="CivicLens Logo"
                        className="h-24 w-auto brightness-[0] invert grayscale"
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-wide mb-2">Admin Login</h1>
                <p className="text-slate-200 text-sm">Please sign in to access the admin dashboard</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-[440px] border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Admin Email Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Admin Email"
                            className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-md bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-sm"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded">
                            {serverError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 focus:outline-none transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 text-white animate-spin" />
                        ) : (
                            'Login'
                        )}
                    </button>

                    {/* Footer Links */}
                    <div className="text-center mt-6">
                        <Link to="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                </form>
            </div>

        </div>
    );
}
