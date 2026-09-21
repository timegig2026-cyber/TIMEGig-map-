import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  X, 
  Plus, 
  Download, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { RealReferral, ReferralStatus, TenantSubscription } from '../../types';

interface TenantSubscribersViewProps {
  referrals: RealReferral[];
  subscription: TenantSubscription;
  onSelectReferral: (referral: RealReferral) => void;
  onDeleteReferral: (id: string) => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
}

export default function TenantSubscribersView({
  referrals,
  subscription,
  onSelectReferral,
  onDeleteReferral,
  onOpenAddModal,
  onExportCSV
}: TenantSubscribersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReferralStatus>('all');
  const [subFilter, setSubFilter] = useState<'all' | 'active' | 'trial' | 'lapsed'>('all');

  // Filtered subscribers
  const filteredReferrals = useMemo(() => {
    return referrals.filter(ref => {
      const matchesSearch = 
        ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ref.phone && ref.phone.includes(searchQuery));
      
      const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;
      
      const currentSubStatus = ref.userSubscriptionStatus || 'active';
      const matchesSub = subFilter === 'all' || currentSubStatus === subFilter;

      return matchesSearch && matchesStatus && matchesSub;
    });
  }, [referrals, searchQuery, statusFilter, subFilter]);

  const activeSubscribersCount = useMemo(() => {
    return referrals.filter(r => (r.status === 'active' || r.status === 'verified') && (r.userSubscriptionStatus === 'active' || !r.userSubscriptionStatus)).length;
  }, [referrals]);

  const totalMonthlyYield = useMemo(() => {
    return referrals
      .filter(r => (r.status === 'active' || r.status === 'verified') && (r.userSubscriptionStatus === 'active' || !r.userSubscriptionStatus))
      .reduce((sum, r) => sum + (r.amountZar || 150), 0);
  }, [referrals]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Subscribers Header & Quick Summary */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-neutral-900">
                  User Subscriptions & Referral Activity Feed
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  {activeSubscribersCount} Active Paying
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every active subscriber generates <strong>R150,00/month</strong> passive revenue. Total active monthly yield: <strong className="text-emerald-700">R {totalMonthlyYield.toFixed(2)}/mo</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onExportCSV}
              className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Register User
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscribers by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Status and Subscription Tier Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Membership status */}
            <div className="flex items-center border border-neutral-200 rounded-xl p-0.5 bg-neutral-50 text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'all' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'active' ? 'bg-white shadow-2xs text-emerald-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('verified')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'verified' ? 'bg-white shadow-2xs text-blue-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Verified
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'pending' ? 'bg-white shadow-2xs text-amber-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Pending
              </button>
            </div>

            {/* Subscription status */}
            <div className="flex items-center border border-neutral-200 rounded-xl p-0.5 bg-neutral-50 text-[11px]">
              <button
                type="button"
                onClick={() => setSubFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${subFilter === 'all' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                All Subs
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${subFilter === 'active' ? 'bg-white shadow-2xs text-emerald-700 font-semibold' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Active (R299,99)
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('trial')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${subFilter === 'trial' ? 'bg-white shadow-2xs text-blue-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Trial
              </button>
              <button
                type="button"
                onClick={() => setSubFilter('lapsed')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${subFilter === 'lapsed' ? 'bg-white shadow-2xs text-red-700' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                Lapsed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Subscribers List */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
        {filteredReferrals.length === 0 ? (
          <div className="py-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 p-4 space-y-2">
            <Users className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-800">
              {referrals.length === 0 
                ? 'No user subscribers registered yet.' 
                : 'No subscribers match your search filter.'}
            </p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {referrals.length === 0
                ? 'Onboard members to your tenant network. When users subscribe at R299,99/month, you receive recurring passive income.'
                : 'Try resetting your search query or adjusting your status filters.'}
            </p>
            {referrals.length === 0 && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="mt-3 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Register First Subscriber
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredReferrals.map((ref) => {
              const isUserSubActive = ref.userSubscriptionStatus === 'active' || !ref.userSubscriptionStatus;
              return (
                <div 
                  key={ref.id} 
                  onClick={() => onSelectReferral(ref)}
                  className="group flex items-center justify-between p-3 bg-neutral-50/80 hover:bg-neutral-100/90 rounded-xl border border-neutral-100 text-xs transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                      ref.status === 'active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      ref.status === 'verified' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {ref.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-neutral-900 truncate">{ref.name}</p>
                        {ref.status === 'verified' && (
                          <span title="Verified Member">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.2 bg-white text-neutral-600 rounded-md border border-neutral-200 shrink-0">
                          {ref.source}
                        </span>
                        <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold border shrink-0 ${
                          isUserSubActive 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : ref.userSubscriptionStatus === 'trial'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                        }`}>
                          Sub: R {(ref.userSubscriptionFeeZar || 299.99).toFixed(2)}/mo
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1.5 mt-0.5">
                        <span>{ref.email}</span>
                        {ref.phone && <span>• {ref.phone}</span>}
                        <span>• Joined {ref.registeredAt}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <div className="text-right">
                      <span className={`font-bold block text-xs ${
                        isUserSubActive && subscription.isActive 
                          ? 'text-emerald-600' 
                          : 'text-neutral-400'
                      }`}>
                        +R {(ref.amountZar || 150).toFixed(2)}/mo
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {isUserSubActive 
                          ? subscription.isActive ? 'Yield Active' : 'Paused (Tenant Due)'
                          : 'Sub Inactive'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReferral(ref.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove subscriber record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
