import React, { useState, useRef } from 'react';
import { X, Camera, MapPin, Upload, Loader2, CheckCircle } from 'lucide-react';
import { complaintService } from '../../../services/complaintService';

const VerificationModal = ({ complaint, isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState('upload'); // 'upload' | 'location' | 'submitting' | 'success'
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const locationInputRef = useRef(null);

    if (!isOpen) return null;

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setStep('location');
        setError(null);
    };

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocation("Detecting location...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Use OpenStreetMap Nominatim (free, no API key required)
                const osmResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'CivicLens-App/1.0',
                            'Accept-Language': 'en'
                        }
                    }
                );

                if (!osmResponse.ok) {
                    throw new Error('Geocoding service unavailable');
                }

                const osmData = await osmResponse.json();
                
                if (osmData && osmData.display_name) {
                    setLocation(`${latitude},${longitude}`);
                    setAddress(osmData.display_name);
                } else {
                    // Fallback to coordinates
                    setLocation(`${latitude},${longitude}`);
                    setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                // Fallback: Use coordinates
                setLocation(`${latitude},${longitude}`);
                setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            setLocation('');
            alert("Location access denied. Please enter manually.");
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setError('Please upload a verification image');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('verificationImage', image);
            if (location) formData.append('verificationLocation', location);
            if (address) formData.append('verificationAddress', address);

            const result = await complaintService.submitVerification(complaint._id, formData);
            
            setStep('success');
            setTimeout(() => {
                onSuccess(result);
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to submit verification');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('upload');
        setImage(null);
        setImagePreview(null);
        setLocation('');
        setAddress('');
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-[32px]">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Verify Complaint</h2>
                        <p className="text-slate-500 text-sm mt-1">{complaint?.title}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 'upload' && (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Camera className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Upload Verification Photo</h3>
                            <p className="text-slate-500 mb-6">
                                Take a photo showing that this issue has been resolved
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                id="verification-image"
                            />
                            <label
                                htmlFor="verification-image"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                <Upload className="w-5 h-5" />
                                Choose Image
                            </label>
                        </div>
                    )}

                    {step === 'location' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Verification preview"
                                        className="w-full h-64 object-cover rounded-2xl border-2 border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                            setStep('upload');
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            )}

                            {/* Location */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Verification Location (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        ref={locationInputRef}
                                        type="text"
                                        value={address || location}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 transition-all pl-11"
                                        placeholder="Enter location or use auto-detect"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAutoDetectLocation}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                                        title="Detect my current location"
                                    >
                                        <MapPin className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Help us verify you're at the complaint location
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Points Info */}
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <p className="text-emerald-800 text-sm font-bold">
                                    ✓ You'll earn <span className="text-lg">20 points</span> for verifying this complaint
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Verification'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Verification Submitted!</h3>
                            <p className="text-slate-500 mb-4">
                                You've earned <span className="font-black text-emerald-600">20 points</span>
                            </p>
                            <p className="text-slate-400 text-sm">Thank you for helping verify this complaint</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
