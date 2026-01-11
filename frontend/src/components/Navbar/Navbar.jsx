import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('popstate', handleLocationChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '/', type: 'primary' },
        { name: 'How it Works', href: '/how-it-works', type: 'secondary' },
        { name: 'Transparency', href: '/transparency', type: 'secondary' },
        { name: 'For Authorities', href: '/authorities', type: 'tertiary' },
        { name: 'About', href: '/about', type: 'tertiary' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
            <div className="navbar-container">
                {/* Logo Section */}
                <a href="" className="navbar-logo" aria-label="CivicLens Home">
                    <img src="/CivicLensLogo.png" alt="CivicLens Logo" className="logo-image" />
                    {/* <span className="logo-text">CivicLens</span> */}
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
                                href={link.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.history.pushState({}, '', link.href);
                                    setCurrentPath(link.href);
                                    setMobileOpen(false); // Close mobile menu on click
                                }}
                                className={`nav-link text-${link.type} ${currentPath === link.href ? 'active' : ''}`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <button className="btn-secondary">Login</button>
                        <button className="btn-primary" aria-label="Report an issue">Report Issue</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
