import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, X, Loader2, ArrowRight, Sparkles, UploadCloud } from 'lucide-react';
import { complaintService } from '../../../services/complaintService';

const ReportIssue = () => {
    // Steps: 'upload' -> 'review' -> 'success'
    const [step, setStep] = useState('upload');
    const [loading, setLoading] = useState(false);

    // Form Data
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Roads & Potholes');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // AI Analysis Data
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const fileInputRef = useRef(null);

    // --- STEP 1: Upload & Analyze ---

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        // Auto-start analysis
        await analyzeImage(file);
    };

    const analyzeImage = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const result = await complaintService.analyzeComplaint(formData);

            // Populate form with AI results
            setTitle(result.title || '');
            setDescription(result.description || '');
            setCategory(result.category || 'Other');
            setAiAnalysis(result);

            // Move to next step
            setStep('review');
        } catch (error) {
            console.error('Analysis failed:', error);
            // Don't block flow on analysis failure, let manual entry proceed
            setStep('review');
        } finally {
            setLoading(false);
        }
    };

    // --- Geolocation ---

    const handleAutoDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        const btn = document.activeElement;
        if (btn) btn.disabled = true;

        const originalPlaceholder = location;
        setLocation("Detecting location...");

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Using the key provided by user directly
                const API_KEY = "AIzaSyACJMzQFOLWkMCv5jQVLDdaz1Qr8JqnWKk";
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`);
                const data = await response.json();

                if (data.status === "OK" && data.results?.[0]) {
                    setLocation(data.results[0].formatted_address);
                } else {
                    console.error("Geocoding failed:", data);
                    setLocation(originalPlaceholder || "");
                    alert("Could not detect address from coordinates.");
                }
            } catch (error) {
                console.error("Geocoding error:", error);
                setLocation(originalPlaceholder || "");
                alert("Failed to fetch address.");
            } finally {
                if (btn) btn.disabled = false;
            }
        }, (error) => {
            console.error("Geolocation error:", error);
            setLocation(originalPlaceholder || "");
            alert("Location access denied or unavailable.");
            if (btn) btn.disabled = false;
        });
    };

    // --- STEP 2: Review & Submit ---

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !location || !image) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('location', location);
            formData.append('description', description);
            formData.append('image', image);
            formData.append('address', location);

            await complaintService.createComplaint(formData);
            setStep('success');

        } catch (error) {
            console.error('Failed to report issue:', error);
            if (error.message.includes('Authorization denied') || error.message.includes('Invalid token')) {
                alert('Session expired. Please logout and login again.');
            } else {
                alert('Failed to report issue. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('Roads & Potholes');
        setLocation('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        setAiAnalysis(null);
        setStep('upload');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- RENDERING ---

    return (
        <div className="bg-white rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 max-w-3xl mx-auto overflow-hidden">

            {/* Header */}
            <div className="p-8 pb-0 text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Report a New Issue</h2>
                <p className="text-slate-500 font-medium mt-2">
                    {step === 'upload' && "Start by uploading a photo of the issue."}
                    {step === 'review' && "Review the details before submitting."}
                    {step === 'success' && "Thank you for your contribution!"}
                </p>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-6 mb-2">
                    <div className={`h-1.5 w-12 rounded-full transition-all ${step === 'upload' ? 'bg-emerald-500' : 'bg-emerald-200'}`}></div>
                    <div className={`h-1.5 w-12 rounded-full transition-all ${step === 'review' ? 'bg-emerald-500' : (step === 'success' ? 'bg-emerald-200' : 'bg-slate-100')}`}></div>
                    <div className={`h-1.5 w-12 rounded-full transition-all ${step === 'success' ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                </div>
            </div>

            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
                <div className="p-12">
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className="border-3 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all cursor-pointer h-80 flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
                    >
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
                                <p className="font-bold text-emerald-700 animate-pulse">Analyzing image with AI...</p>
                            </div>
                        )}

                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <UploadCloud className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">Click to Upload Photo</h3>
                            <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG (Max 10MB)</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            )}

            {/* STEP 2: REVIEW */}
            {step === 'review' && (
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-8 duration-500">

                    {/* Image Preview & AI Badge */}
                    <div className="relative rounded-3xl overflow-hidden h-64 shadow-md group">
                        <img src={imagePreview} alt="Issue" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                                    <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-1">Category</p>
                                    <p className="font-bold text-slate-700 text-sm leading-tight">{aiAnalysis.category}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                                    <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-1">Priority</p>
                                    <p className={`font-bold text-sm leading-tight ${aiAnalysis.priority === 'High' ? 'text-red-500' :
                                            aiAnalysis.priority === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
                                        }`}>{aiAnalysis.priority}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                                    <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-1">Est. Completion</p>
                                    <p className="font-bold text-slate-700 text-sm leading-tight">{aiAnalysis.estimatedResolutionTime || '3-5 Days'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
                                    <p className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-1">Confidence</p>
                                    <p className="font-bold text-slate-700 text-sm leading-tight">{(aiAnalysis.confidence.category * 100).toFixed(0)}%</p>
                                </div>
                            </div>

                            <p className="text-xs opacity-80 font-medium mt-4">Click "Back" to change photo</p>
                        </div>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 transition-colors text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Issue Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 transition-all"
                                placeholder="What's the issue?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 transition-all appearance-none"
                            >
                                <option>Roads & Potholes</option>
                                <option>Sanitation & Waste</option>
                                <option>Electricity & Lights</option>
                                <option>Water Supply</option>
                                <option>Public Parks</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 transition-all pl-11"
                                    placeholder="Add location"
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
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-700 transition-all text-sm leading-relaxed"
                                placeholder="Add more details..."
                            ></textarea>
                            {aiAnalysis && (
                                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1.5 ml-1">
                                    <Sparkles className="w-3 h-3" />
                                    AI generated description based on image
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#10b981] text-white rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                Confirm & Submit Report
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                </form>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 'success' && (
                <div className="p-16 text-center animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Complaint Registered!</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Your issue has been successfully reported to the {category} department. You can track its status in "My Issues".
                    </p>
                    <button
                        onClick={resetForm}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Report Another Issue
                    </button>
                </div>
            )}

        </div>
    );
};

export default ReportIssue;
