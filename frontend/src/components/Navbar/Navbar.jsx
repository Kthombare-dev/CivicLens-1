import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

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

        // Update URL
        window.history.pushState({}, '', link.path);

        // Smooth Scroll
        const element = document.getElementById(link.targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                        <button className="btn-secondary">Login</button>
                        <button className="btn-primary" aria-label="Report an issue">Report Issue</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
