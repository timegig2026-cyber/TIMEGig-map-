import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Camera, Calendar, MapPin, Phone, Mail, Link, Upload, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import SpatialIcon3D from './SpatialIcon3D';

export default function UserProfileFeature() {
  const { profile, updateProfile, submitForReview, login, signup, user } = useFirebase();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      if (authMode === 'login') {
        await login(authEmail, authPass);
      } else {
        await signup(authEmail, authPass);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    dateOfBirth: '',
    address: '',
    contactNumber: '',
    socialLinks: [''],
    idDocumentURL: '',
    photoURL: ''
  });

  const startEditing = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        middleName: profile.middleName || '',
        surname: profile.surname || '',
        dateOfBirth: profile.dateOfBirth || '',
        address: profile.address || '',
        contactNumber: profile.contactNumber || '',
        socialLinks: profile.socialLinks.length > 0 ? profile.socialLinks : [''],
        idDocumentURL: profile.idDocumentURL || '',
        photoURL: profile.photoURL || ''
      });
    }
    setEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, ''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photoURL) {
      alert("Profile picture (face only) is required for verification.");
      return;
    }
    await submitForReview(formData);
    setEditing(false);
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (error) {
          console.error("Geocoding failed", error);
        }
      });
    }
  };
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-sm mx-auto">
        <SpatialIcon3D icon={ShieldCheck} size="lg" active={false} />
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Secure Access</h2>
          <p className="text-neutral-500 text-sm">Join the GiG economy securely with your private account.</p>
        </div>

        <form onSubmit={handleAuth} className="w-full space-y-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl">
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Email address"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition-all"
              required
            />
            <input 
              type="password" 
              placeholder="Password"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition-all"
              required
            />
          </div>

          {authError && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">{authError}</p>}

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-black text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isAuthenticating ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <button 
            type="button"
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            className="text-xs text-neutral-500 hover:text-black transition-colors"
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-neutral-100">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                <Camera size={40} />
              </div>
            )}
          </div>
          {profile?.isVerified && (
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-[#FAF9F6] shadow-lg">
              <CheckCircle size={18} strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.firstName} {profile?.middleName && `${profile.middleName} `}{profile?.surname}
          </h1>
          <p className="text-emerald-500 text-sm font-mono flex items-center justify-center gap-1.5 mt-1">
            {profile?.verificationStatus === 'approved' && <><ShieldCheck size={14} /> Verified Member</>}
            {profile?.verificationStatus === 'pending' && <><Clock size={14} /> Verification Pending (15-25m)</>}
            {profile?.verificationStatus === 'rejected' && <><AlertTriangle size={14} /> Verification Rejected</>}
            {profile?.verificationStatus === 'unsubmitted' && <span className="text-neutral-500">Identity Not Verified</span>}
          </p>
        </div>
      </div>

      {!editing ? (
        <div className="grid gap-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Contact Info</label>
                <div className="flex items-center gap-3 text-neutral-800">
                  <Mail size={16} className="text-emerald-500" />
                  <span className="text-sm truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-800">
                  <Phone size={16} className="text-emerald-500" />
                  <span className="text-sm">{profile?.contactNumber || 'Not set'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Identity</label>
                <div className="flex items-center gap-3 text-neutral-800">
                  <Calendar size={16} className="text-emerald-500" />
                  <span className="text-sm">{profile?.dateOfBirth || 'Date of birth not set'}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-800">
                  <MapPin size={16} className="text-emerald-500" />
                  <span className="text-sm line-clamp-1">{profile?.address || 'Address not set'}</span>
                </div>
              </div>
            </div>

            {profile?.socialLinks && profile.socialLinks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Social Connections</label>
                <div className="flex flex-wrap gap-2">
                  {profile.socialLinks.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="bg-neutral-50 hover:bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 transition-colors border border-neutral-200">
                      <Link size={12} />
                      {new URL(link).hostname.replace('www.', '')}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={startEditing}
            className="w-full bg-white border border-neutral-200 hover:border-emerald-500/50 text-neutral-800 font-bold py-4 rounded-3xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {profile?.verificationStatus === 'unsubmitted' ? 'Complete Profile & Verify' : 'Edit Information'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">Surname</label>
              <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" required />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500">Middle Name (Optional)</label>
            <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">Contact Number</label>
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-500">Address</label>
              <button type="button" onClick={locateUser} className="text-[10px] text-emerald-600 flex items-center gap-1 hover:underline">
                <MapPin size={10} /> Auto-locate
              </button>
            </div>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-neutral-500">Social Media Links</label>
            {formData.socialLinks.map((link, i) => (
              <input key={i} type="url" value={link} onChange={(e) => handleSocialLinkChange(i, e.target.value)} placeholder="https://..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all" />
            ))}
            <button type="button" onClick={addSocialLink} className="text-xs text-neutral-400 flex items-center gap-1.5 hover:text-neutral-600">
              <Link size={14} /> Add another link
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">Profile Picture (Face Only)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-all cursor-pointer">
                  <Camera size={24} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-xs text-neutral-400">Upload Face Photo</p>
                  <input 
                    type="text" 
                    placeholder="Enter photo URL (Simulation)" 
                    value={formData.photoURL} 
                    onChange={(e) => setFormData(prev => ({ ...prev, photoURL: e.target.value }))}
                    className="mt-4 w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-[10px]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500">ID Document</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-all cursor-pointer">
                  <Upload size={24} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-xs text-neutral-400">Upload ID (PDF, JPG, PNG)</p>
                  {/* Mock file upload for demo */}
                  <input 
                    type="text" 
                    placeholder="Enter document URL (Simulation)" 
                    value={formData.idDocumentURL} 
                    onChange={(e) => setFormData(prev => ({ ...prev, idDocumentURL: e.target.value }))}
                    className="mt-4 w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold py-3 rounded-2xl transition-all">Cancel</button>
            <button type="submit" className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/10">Submit for Review</button>
          </div>
        </form>
      )}
    </div>
  );
}
