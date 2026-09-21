import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ArrowLeft, CheckCircle, Clock, Eye, XCircle, User, FileText, AlertCircle, ShieldCheck } from 'lucide-react';

interface PendingProfile {
  uid: string;
  firstName: string;
  surname: string;
  email: string;
  idDocumentURL?: string;
  photoURL?: string;
  verificationStatus: string;
  submittedAt?: string;
}

interface AdminFeatureProps {
  onClose?: () => void;
}

export default function AdminFeature({ onClose }: AdminFeatureProps) {
  const [pendingProfiles, setPendingProfiles] = useState<PendingProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const profiles = snapshot.docs.map(doc => doc.data() as PendingProfile);
      setPendingProfiles(profiles);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => unsubscribe();
  }, []);

  const handleReview = async (uid: string, status: 'approved' | 'rejected') => {
    const profileRef = doc(db, 'users', uid);
    try {
      await updateDoc(profileRef, {
        verificationStatus: status,
        isVerified: status === 'approved',
        updatedAt: new Date().toISOString()
      });
      setSelectedProfile(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#FAF9F6] text-neutral-900 flex flex-col animate-in fade-in duration-500">
      {/* Top Menu Bar */}
      <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-neutral-500 hover:text-black transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-6 w-[1px] bg-neutral-200 mx-2" />
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle size={20} />
            <span className="font-bold text-sm tracking-tight">Verifications</span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingProfiles.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <Clock className="animate-spin mb-4" />
              <p className="text-sm">Loading applications...</p>
            </div>
          ) : pendingProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 border-2 border-dashed border-neutral-200 rounded-3xl">
              <CheckCircle size={40} className="mb-4 opacity-20" />
              <p className="text-sm">All verifications completed</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingProfiles.map(profile => (
                <div key={profile.uid} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                      {profile.photoURL ? (
                        <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-full h-full p-3 text-neutral-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate text-neutral-800">{profile.firstName} {profile.surname}</p>
                      <p className="text-xs text-neutral-500 truncate">{profile.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProfile(profile)}
                    className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-neutral-200"
                  >
                    <Eye size={14} /> Review Application
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Full Screen Review Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[2100] bg-[#FAF9F6] flex flex-col animate-in zoom-in-95 duration-200">
          <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedProfile(null)} className="text-neutral-400 hover:text-neutral-800 p-2">
                <XCircle size={24} />
              </button>
              <h2 className="font-bold text-neutral-800">Review: {selectedProfile.firstName} {selectedProfile.surname}</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleReview(selectedProfile.uid, 'rejected')}
                className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
              >
                Reject
              </button>
              <button 
                onClick={() => handleReview(selectedProfile.uid, 'approved')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10"
              >
                Approve & Verify
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                  <User size={12} /> Profile Picture
                </label>
                <div className="aspect-square max-w-sm rounded-3xl overflow-hidden border border-neutral-200 bg-white flex items-center justify-center shadow-md">
                  {selectedProfile.photoURL ? (
                    <img src={selectedProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-neutral-400 text-sm italic">No photo provided</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-[2] space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                  <FileText size={12} /> ID Document
                </label>
                <div className="w-full aspect-[4/3] rounded-3xl border border-neutral-200 bg-white overflow-hidden flex items-center justify-center p-4 shadow-md">
                  {selectedProfile.idDocumentURL ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                      <img src={selectedProfile.idDocumentURL} alt="ID Document" className="max-w-full max-h-full object-contain shadow-xl" />
                      <a href={selectedProfile.idDocumentURL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-xs flex items-center gap-1.5 hover:underline bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200">
                        Open in New Tab <Eye size={12} />
                      </a>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <AlertCircle size={32} className="mx-auto text-neutral-300" />
                      <p className="text-neutral-400 text-sm">No ID document link provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
