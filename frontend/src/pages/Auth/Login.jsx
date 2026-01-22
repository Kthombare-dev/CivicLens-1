import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import validator from 'validator';
import GridBackground from '../../components/ui/GridBackground';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    // ... rest of state
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) {
            setServerError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validator.isEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            setServerError('');

            try {
                // Mock login for now to match the user's dashboard data
                // In a real app, this would be: 
                // const response = await fetch('https://civiclens-1.onrender.com/api/auth/login', ...)
                // const data = await response.json();

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockUser = {
                    id: '1',
                    name: 'Rohit Verma',
                    email: formData.email,
                    location: 'Vijay Nagar'
                };

                login(mockUser);
                console.log('Login successful', mockUser);
                navigate('/dashboard');
            } catch (err) {
                console.error('Login error:', err);
                setServerError(err.message || 'Something went wrong. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <GridBackground>
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="fixed top-6 left-6 z-50"
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-transparent text-slate-600 font-medium hover:bg-white hover:border-emerald-200 hover:text-emerald-700 hover:shadow-lg transition-all shadow-sm group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span>Back</span>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-slate-100/50"
            >

                {/* Left Side - Decorative (Order 2 on mobile, Order 1 on desktop) */}
                <div className="order-2 md:order-1 flex flex-col justify-center px-10 py-10 md:py-0 bg-gradient-to-br from-emerald-50/80 to-slate-50/80 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-medium text-slate-900 tracking-tight">
                                Welcome back to <span className="font-bold text-emerald-600">CivicLens</span>
                            </h2>
                            <p className="mt-4 text-slate-600 leading-relaxed">
                                Track your reported issues, verify completed work, and stay
                                informed about civic actions in your city.
                            </p>
                        </motion.div>

                        <motion.ul
                            className="mt-8 space-y-4 text-sm text-slate-600/90 font-medium"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.15,
                                        delayChildren: 0.5
                                    }
                                }
                            }}
                        >
                            {[
                                "Transparent complaint tracking",
                                "Citizen-verified resolutions",
                                "Civic participation points"
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, x: -10 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                </div>

                {/* Right Side - Form (Order 1 on mobile, Order 2 on desktop) */}
                <div className="order-1 md:order-2 px-8 py-12 md:px-12 relative bg-white/60">
                    <div className="mb-8 items-center flex flex-col md:items-start">
                        <img src="/CivicLensLogo.png" alt="CivicLens Logo" className="h-24 w-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900">
                            Sign in to CivicLens
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Enter your credentials to continue.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="login@gmail.com"
                                className={`w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} bg-slate-50/50 px-4 py-2.5 text-sm transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} bg-slate-50/50 px-4 py-2.5 text-sm transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <Link to="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
                        </div>

                        {serverError && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                                {serverError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in securely'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline decoration-2 underline-offset-2 transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </motion.div>
        </GridBackground>
    );
}
