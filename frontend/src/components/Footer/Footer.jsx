import React from 'react';
import { Twitter, Linkedin, Github, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <a href="/" className="flex items-center gap-2">
                            <img
                                src="/CivicLensLogo.png"
                                alt="CivicLens Logo"
                                className="h-14 w-auto"
                            />
                        </a>
                        <p className="text-sm leading-6 text-slate-600 max-w-sm">
                            Empowering citizens and enabling authorities to build better cities together through transparency and shared accountability.
                        </p>
                        <div className="flex space-x-6">
                            <SocialLink href="" icon={Twitter} label="Twitter" />
                            <SocialLink href="" icon={Linkedin} label="LinkedIn" />
                            <SocialLink href="" icon={Github} label="GitHub" />
                            <SocialLink href="" icon={Facebook} label="Facebook" />
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <FooterLink href="/how-it-works">How it Works</FooterLink>
                                    <FooterLink href="/transparency">Transparency Dashboard</FooterLink>
                                    <FooterLink href="/authorities">For Authorities</FooterLink>
                                    <FooterLink href="/mobile-app">Mobile App</FooterLink>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <FooterLink href="/about">About Us</FooterLink>
                                    <FooterLink href="/careers">Careers</FooterLink>
                                    <FooterLink href="/partners">Partners</FooterLink>
                                    <FooterLink href="/news">News</FooterLink>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Resources</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <FooterLink href="/help">Help Center</FooterLink>
                                    <FooterLink href="/guidelines">Community Guidelines</FooterLink>
                                    <FooterLink href="/api">API Documentation</FooterLink>
                                    <FooterLink href="/status">System Status</FooterLink>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-slate-900">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <FooterLink href="/privacy">Privacy Policy</FooterLink>
                                    <FooterLink href="/terms">Terms of Service</FooterLink>
                                    <FooterLink href="/cookies">Cookie Policy</FooterLink>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-slate-900/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-slate-500">
                        &copy; {new Date().getFullYear()} CivicLens. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon: Icon, label }) => (
    <a href={href} className="text-slate-400 hover:text-slate-500 transition-colors">
        <span className="sr-only">{label}</span>
        <Icon className="h-5 w-5" aria-hidden="true" />
    </a>
);

const FooterLink = ({ href, children }) => (
    <li>
        <a href={href} className="text-sm leading-6 text-slate-600 hover:text-slate-900 transition-colors">
            {children}
        </a>
    </li>
);

export default Footer;
