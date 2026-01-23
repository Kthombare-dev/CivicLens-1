import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', targetId: 'home', type: 'primary' },
        { name: 'How It Works', path: '/how-it-works', targetId: 'how-it-works', type: 'secondary' },
        { name: 'Transparency', path: '/transparency', targetId: 'build', type: 'secondary' },
        { name: 'Impact', path: '/impact', targetId: 'impact', type: 'secondary' },
    ];

    const handleNavClick = (e, link) => {
        e.preventDefault();
        setActiveLink(link.name);
        setMobileOpen(false);

        if (location.pathname !== '/') {
            navigate('/');
            // Allow time for navigation then scroll
            setTimeout(() => {
                const element = document.getElementById(link.targetId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // Already on home
            // Update URL manually if desired, or skip
            // window.history.pushState({}, '', link.path); // Optional: keep URL clean or match path

            const element = document.getElementById(link.targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Hide Navbar on Login and Signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
            <div className="navbar-container">
                {/* Logo Section */}
                <a
                    href="/"
                    className="navbar-logo"
                    aria-label="CivicLens Home"
                    onClick={(e) => handleNavClick(e, navLinks[0])}
                >
                    <img src="/CivicLensLogo.png" alt="CivicLens Logo" className="logo-image" />
                </a>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>

                {/* Collapsible Menu Content */}
                <div className="navbar-menu">
                    {/* Desktop Links */}
                    <div className="navbar-links">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`nav-link ${link.name === activeLink ? 'active' : `text-${link.type}`}`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="navbar-actions">
                        {isAuthenticated ? (
                            <>
                                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Dashboard</button>
                                <button className="btn-primary" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
                                <button
                                    className="btn-primary"
                                    aria-label="Report an issue"
                                    onClick={() => navigate('/login')}
                                >
                                    Report Issue
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
