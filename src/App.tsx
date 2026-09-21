/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, User, Users, ShieldCheck } from 'lucide-react';
import SpatialIcon3D from './components/SpatialIcon3D';
import LiveWorldMap from './components/LiveWorldMap';
import UserProfileFeature from './components/UserProfileFeature';
import AdminFeature from './components/AdminFeature';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';

type Tab = 'gigs' | 'seekers' | 'profile' | 'admin';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('gigs');
  const { isAdmin } = useFirebase();

  return (
    <div id="app-root" className="relative w-screen h-screen overflow-hidden bg-[#FAF9F6] text-neutral-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Main Feature Area */}
      <main id="main-content" className="relative flex-1 w-full h-full overflow-y-auto">
        {activeTab === 'gigs' && <LiveWorldMap />}
        {activeTab === 'seekers' && (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            <SpatialIcon3D icon={Users} size="lg" active={true} interactive />
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-neutral-800 capitalize tracking-tight">Seekers</h1>
              <p className="text-sm text-neutral-500 font-mono">Feature incoming</p>
            </div>
          </div>
        )}
        {activeTab === 'profile' && <UserProfileFeature />}
        {activeTab === 'admin' && isAdmin && <AdminFeature onClose={() => setActiveTab('gigs')} />}
      </main>

      {/* Bottom Menu Bar with 3D Icons */}
      <nav
        id="bottom-menu-bar"
        aria-label="Bottom Navigation"
        className="fixed bottom-0 inset-x-0 bg-[#FAF9F6]/90 backdrop-blur-md border-t border-neutral-200/80 z-[1500] px-4 py-2"
      >
        <div id="bottom-menu-container" className="max-w-md mx-auto flex items-center justify-between gap-1">
          {/* Seekers Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('seekers')}
            className={`group flex flex-col items-center justify-center min-h-[52px] flex-1 px-1 py-1.5 rounded-2xl transition-all duration-150 active:translate-y-0.5 focus:outline-none ${
              activeTab === 'seekers' ? 'bg-white shadow-sm ring-1 ring-neutral-200' : 'hover:bg-white/60'
            }`}
          >
            <div className="transition-transform duration-150 group-hover:scale-105">
              <Users size={20} className={`${activeTab === 'seekers' ? 'text-black' : 'text-neutral-500'} transition-colors`} />
            </div>
            <span className={`text-[9px] font-semibold tracking-wider mt-1 transition-colors ${activeTab === 'seekers' ? 'text-black' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
              Seekers
            </span>
          </button>

          {/* GiGs Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('gigs')}
            className={`group flex flex-col items-center justify-center min-h-[52px] flex-1 px-1 py-1.5 rounded-2xl transition-all duration-150 active:translate-y-0.5 focus:outline-none ${
              activeTab === 'gigs' ? 'bg-white shadow-sm ring-1 ring-neutral-200' : 'hover:bg-white/60'
            }`}
          >
            <div className="transition-transform duration-150 group-hover:scale-105">
              <Briefcase size={20} className={`${activeTab === 'gigs' ? 'text-black' : 'text-neutral-500'} transition-colors`} />
            </div>
            <span className={`text-[9px] font-semibold tracking-wider mt-1 transition-colors ${activeTab === 'gigs' ? 'text-black' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
              GiGs
            </span>
          </button>

          {/* Profile Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`group flex flex-col items-center justify-center min-h-[52px] flex-1 px-1 py-1.5 rounded-2xl transition-all duration-150 active:translate-y-0.5 focus:outline-none ${
              activeTab === 'profile' ? 'bg-white shadow-sm ring-1 ring-neutral-200' : 'hover:bg-white/60'
            }`}
          >
            <div className="transition-transform duration-150 group-hover:scale-105">
              <User size={20} className={`${activeTab === 'profile' ? 'text-black' : 'text-neutral-500'} transition-colors`} />
            </div>
            <span className={`text-[9px] font-semibold tracking-wider mt-1 transition-colors ${activeTab === 'profile' ? 'text-black' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
              Profile
            </span>
          </button>

          {/* Admin Tab (Conditional) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`group flex flex-col items-center justify-center min-h-[52px] flex-1 px-1 py-1.5 rounded-2xl transition-all duration-150 active:translate-y-0.5 focus:outline-none ${
                activeTab === 'admin' ? 'bg-white shadow-sm ring-1 ring-neutral-200' : 'hover:bg-white/60'
              }`}
            >
              <div className="transition-transform duration-150 group-hover:scale-105">
                <ShieldCheck size={20} className={`${activeTab === 'admin' ? 'text-black' : 'text-neutral-500'} transition-colors`} />
              </div>
              <span className={`text-[9px] font-semibold tracking-wider mt-1 transition-colors ${activeTab === 'admin' ? 'text-black' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
                Admin
              </span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
