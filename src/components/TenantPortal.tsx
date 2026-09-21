import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Share2, 
  DollarSign, 
  Users, 
  Check, 
  Plus, 
  Search, 
  Mail, 
  MessageCircle, 
  Download, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  X, 
  Phone, 
  AlertCircle,
  CreditCard,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers
} from 'lucide-react';
import { RealReferral, ReferralSource, ReferralStatus, TenantSubscription, TenantTab } from '../types';
import { exportReferralsToCSV, saveRealReferrals, saveTenantSubscription, TENANT_MONTHLY_FEE_ZAR } from '../services/referralStorage';
import TenantSubscriptionModal from './TenantSubscriptionModal';
import TenantTopBar from './tenant/TenantTopBar';
import TenantOverviewView from './tenant/TenantOverviewView';
import TenantShareView from './tenant/TenantShareView';
import TenantSubscribersView from './tenant/TenantSubscribersView';
import TenantSubscriptionView from './tenant/TenantSubscriptionView';
import TenantPayoutsView from './tenant/TenantPayoutsView';

interface TenantPortalProps {
  tenantName: string;
  tenantSurname: string;
  referrals: RealReferral[];
  onUpdateReferrals: (updated: RealReferral[]) => void;
  subscription: TenantSubscription;
  onUpdateSubscription: (sub: TenantSubscription) => void;
  onShowNotice?: (message: string) => void;
}

export default function TenantPortal({
  tenantName,
  tenantSurname,
  referrals,
  onUpdateReferrals,
  subscription,
  onUpdateSubscription,
  onShowNotice
}: TenantPortalProps) {
  const [activeTenantTab, setActiveTenantTab] = useState<TenantTab>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReferralStatus>('all');
  const [payoutStatus, setPayoutStatus] = useState<'ready' | 'processing' | 'paid'>('ready');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPublicSignupOpen, setIsPublicSignupOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<RealReferral | null>(null);

  // New Referral Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSource, setNewSource] = useState<ReferralSource>('Direct Invite');
  const [newStatus, setNewStatus] = useState<ReferralStatus>('active');
  const [newUserSubFee, setNewUserSubFee] = useState<number>(299.99);
  const [newUserSubStatus, setNewUserSubStatus] = useState<'active' | 'trial' | 'lapsed'>('active');
  const [newAmountZar, setNewAmountZar] = useState<number>(150.00);
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Public Signup Form state (Simulated external visitor using referral link)
  const [publicVisitorName, setPublicVisitorName] = useState('');
  const [publicVisitorEmail, setPublicVisitorEmail] = useState('');
  const [publicVisitorPhone, setPublicVisitorPhone] = useState('');
  const [publicVisitorError, setPublicVisitorError] = useState<string | null>(null);
  const [publicSuccessMessage, setPublicSuccessMessage] = useState<string | null>(null);

  // Derived tenant referral code and real share URL
  const refCode = `${tenantName.toLowerCase().trim().replace(/\s+/g, '-')}-${tenantSurname.toLowerCase().trim().replace(/\s+/g, '-')}-ref`;
  
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ai.studio';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const shareableUrl = `${currentOrigin}${currentPath}?ref=${refCode}`;

  // Calculations for User Monthly Subscriptions & Tenant Passive Income
  const activeReferrals = useMemo(() => {
    return referrals.filter(r => r.status === 'active' || r.status === 'verified');
  }, [referrals]);

  // Active subscribers are users whose subscription is actively paid
  const activeSubscribers = useMemo(() => {
    return activeReferrals.filter(r => r.userSubscriptionStatus === 'active' || !r.userSubscriptionStatus);
  }, [activeReferrals]);

  // Gross passive income earned by tenant from user monthly subscriptions
  const grossPassiveIncome = useMemo(() => {
    return activeSubscribers.reduce((sum, r) => sum + (r.amountZar || 150), 0);
  }, [activeSubscribers]);

  // Total subscription volume generated from users in network
  const totalUserSubscriptionVolume = useMemo(() => {
    return activeSubscribers.reduce((sum, r) => sum + (r.userSubscriptionFeeZar || 299.99), 0);
  }, [activeSubscribers]);

  // Tenant account monthly fee (R299,99)
  const tenantFee = TENANT_MONTHLY_FEE_ZAR;

  // Net monthly passive income (Gross passive income from users minus tenant account subscription)
  const netMonthlyPassiveProfit = useMemo(() => {
    return grossPassiveIncome - (subscription.isActive ? tenantFee : 0);
  }, [grossPassiveIncome, subscription.isActive, tenantFee]);

  // Filtered referrals for the live feed
  const filteredReferrals = useMemo(() => {
    return referrals.filter(ref => {
      const matchesSearch = 
        ref.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ref.phone && ref.phone.includes(searchQuery));
      
      const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [referrals, searchQuery, statusFilter]);

  // Action: Add real referral from manual form
  const handleAddReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setFormError('Please enter both full name and a valid email address.');
      return;
    }
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setFormError('Please provide a valid email format.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReferral: RealReferral = {
      id: `ref-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || undefined,
      referralCode: refCode,
      source: newSource,
      status: newStatus,
      registeredAt: formattedDate,
      userSubscriptionFeeZar: Number(newUserSubFee) || 299.99,
      userSubscriptionStatus: newUserSubStatus,
      amountZar: Number(newAmountZar) || 150.00,
      notes: newNotes.trim() || undefined
    };

    const updated = [newReferral, ...referrals];
    onUpdateReferrals(updated);
    saveRealReferrals(updated);

    // Reset and close
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setNewAmountZar(150.00);
    setNewUserSubFee(299.99);
    setNewUserSubStatus('active');
    setFormError(null);
    setIsAddModalOpen(false);

    if (onShowNotice) {
      onShowNotice(`Registered subscriber ${newReferral.name} (R299,99/mo). Passive cut: +R ${newReferral.amountZar.toFixed(2)}/mo`);
    }
  };

  // Action: Public registration via shared link
  const handlePublicSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicVisitorName.trim() || !publicVisitorEmail.trim()) {
      setPublicVisitorError('Name and email are required.');
      return;
    }
    if (!publicVisitorEmail.includes('@') || !publicVisitorEmail.includes('.')) {
      setPublicVisitorError('Please enter a valid email address.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReferral: RealReferral = {
      id: `ref-pub-${Date.now()}`,
      name: publicVisitorName.trim(),
      email: publicVisitorEmail.trim().toLowerCase(),
      phone: publicVisitorPhone.trim() || undefined,
      referralCode: refCode,
      source: 'Referral Link',
      status: 'active',
      registeredAt: formattedDate,
      userSubscriptionFeeZar: 299.99,
      userSubscriptionStatus: 'active',
      amountZar: 150.00,
      notes: `Registered via public link: ${refCode}. Subscribed to monthly membership (R299,99/mo).`
    };

    const updated = [newReferral, ...referrals];
    onUpdateReferrals(updated);
    saveRealReferrals(updated);

    setPublicSuccessMessage(`Success! User subscribed to R299,99/mo plan. Tenant earned R150,00/mo passive income.`);
    setPublicVisitorName('');
    setPublicVisitorEmail('');
    setPublicVisitorPhone('');
    setPublicVisitorError(null);

    setTimeout(() => {
      setPublicSuccessMessage(null);
      setIsPublicSignupOpen(false);
    }, 2000);

    if (onShowNotice) {
      onShowNotice(`Inbound user subscription registered via referral link! +R150,00/mo passive income`);
    }
  };

  // Action: Delete real referral
  const handleDeleteReferral = (id: string) => {
    const updated = referrals.filter(r => r.id !== id);
    onUpdateReferrals(updated);
    saveRealReferrals(updated);
    if (selectedReferral?.id === id) {
      setSelectedReferral(null);
    }
    if (onShowNotice) {
      onShowNotice('User removed from referral records.');
    }
  };

  // Action: Toggle referral status
  const handleToggleStatus = (id: string, newStatusVal: ReferralStatus) => {
    const updated = referrals.map(r => r.id === id ? { ...r, status: newStatusVal } : r);
    onUpdateReferrals(updated);
    saveRealReferrals(updated);
    if (selectedReferral?.id === id) {
      setSelectedReferral({ ...selectedReferral, status: newStatusVal });
    }
  };

  // Action: Toggle user subscription status (active, trial, lapsed)
  const handleToggleUserSubStatus = (id: string, newSubStatus: 'active' | 'trial' | 'lapsed') => {
    const updated = referrals.map(r => r.id === id ? { ...r, userSubscriptionStatus: newSubStatus } : r);
    onUpdateReferrals(updated);
    saveRealReferrals(updated);
    if (selectedReferral?.id === id) {
      setSelectedReferral({ ...selectedReferral, userSubscriptionStatus: newSubStatus });
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const openWhatsAppShare = () => {
    const text = encodeURIComponent(`Hi! Join my verified tenant network here. Monthly subscription is R299,99 with verified community perks: ${shareableUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const openEmailInvite = () => {
    const subject = encodeURIComponent(`Invitation to join ${tenantName} ${tenantSurname}'s Tenant Network`);
    const body = encodeURIComponent(`Hi,\n\nI'd like to invite you to join my official tenant network. You can register your account using my verified referral link below:\n\n${shareableUrl}\n\nUser subscription is R299,99/month.\n\nLooking forward to having you onboard!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-neutral-900">Tenant Portal & Passive Income</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Earn recurring passive income from user monthly subscriptions. Account active via R299,99 monthly fee.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportReferralsToCSV(referrals)}
            className="px-2.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
            title="Download CSV report of all real referrals"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            Export CSV
          </button>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
            subscription.isActive
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-amber-50 border border-amber-300 text-amber-800'
          }`}>
            <Building className="w-3.5 h-3.5" />
            {subscription.isActive ? 'Active Tenant (R299,99/mo)' : 'Tenant Inactive (Due)'}
          </div>
        </div>
      </div>

      {/* Top Menu Bar for Tenant Features */}
      <TenantTopBar
        activeTab={activeTenantTab}
        onTabChange={setActiveTenantTab}
        activeSubscribersCount={activeSubscribers.length}
        totalReferralsCount={referrals.length}
        isSubscriptionActive={subscription.isActive}
        grossPassiveIncome={grossPassiveIncome}
        onExportCSV={() => exportReferralsToCSV(referrals)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Active Feature View Separated By Top Bar */}
      {activeTenantTab === 'overview' && (
        <TenantOverviewView
          tenantName={tenantName}
          tenantSurname={tenantSurname}
          referrals={referrals}
          activeSubscribers={activeSubscribers}
          grossPassiveIncome={grossPassiveIncome}
          netMonthlyPassiveProfit={netMonthlyPassiveProfit}
          tenantFee={TENANT_MONTHLY_FEE_ZAR}
          subscription={subscription}
          shareableUrl={shareableUrl}
          onNavigateTab={setActiveTenantTab}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onOpenPublicSignup={() => setIsPublicSignupOpen(true)}
          onCopyLink={copyLinkToClipboard}
          copiedLink={copiedLink}
        />
      )}

      {activeTenantTab === 'share' && (
        <TenantShareView
          tenantName={tenantName}
          tenantSurname={tenantSurname}
          refCode={refCode}
          shareableUrl={shareableUrl}
          subscription={subscription}
          copiedLink={copiedLink}
          onCopyLink={copyLinkToClipboard}
          onWhatsAppShare={openWhatsAppShare}
          onEmailInvite={openEmailInvite}
          onOpenPublicSignup={() => setIsPublicSignupOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {activeTenantTab === 'subscribers' && (
        <TenantSubscribersView
          referrals={referrals}
          subscription={subscription}
          onSelectReferral={setSelectedReferral}
          onDeleteReferral={handleDeleteReferral}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onExportCSV={() => exportReferralsToCSV(referrals)}
        />
      )}

      {activeTenantTab === 'subscription' && (
        <TenantSubscriptionView
          subscription={subscription}
          tenantName={tenantName}
          tenantSurname={tenantSurname}
          onUpdateSubscription={onUpdateSubscription}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onShowNotice={onShowNotice}
        />
      )}

      {activeTenantTab === 'payouts' && (
        <TenantPayoutsView
          tenantName={tenantName}
          tenantSurname={tenantSurname}
          grossPassiveIncome={grossPassiveIncome}
          subscription={subscription}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
          onShowNotice={onShowNotice}
        />
      )}

      {/* MODAL 1: Add Real Referral Manually */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-neutral-900">Register User & Monthly Subscription</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddReferralSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">User Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sipho Dlamini"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sipho.d@example.co.za"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +27 82 123 4567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <span className="font-semibold text-neutral-800 block text-[11px]">Monthly Subscription & Passive Income</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-600 text-[10px] mb-0.5">User Monthly Sub (ZAR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newUserSubFee}
                      onChange={(e) => setNewUserSubFee(parseFloat(e.target.value) || 299.99)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 text-[10px] mb-0.5">Your Passive Cut (ZAR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAmountZar}
                      onChange={(e) => setNewAmountZar(parseFloat(e.target.value) || 150.00)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs text-emerald-700 font-semibold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span>User Subscription Status:</span>
                  <select
                    value={newUserSubStatus}
                    onChange={(e) => setNewUserSubStatus(e.target.value as 'active' | 'trial' | 'lapsed')}
                    className="px-2 py-1 bg-white border border-neutral-200 rounded text-[10px]"
                  >
                    <option value="active">Active Subscriber (R299,99/mo)</option>
                    <option value="trial">Trial Period</option>
                    <option value="lapsed">Lapsed / Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Referral Source</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as ReferralSource)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="Direct Invite">Direct Invite</option>
                    <option value="Referral Link">Referral Link</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email Invite">Email Invite</option>
                    <option value="Manual Registration">Manual Registration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReferralStatus)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="active">Active Member</option>
                    <option value="verified">Verified Member</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Subscribed via WhatsApp, colleague"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save User & Add Passive Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Public Registration Portal (Visitor signup via shareable link) */}
      {isPublicSignupOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Referral Subscription</span>
                <h3 className="text-sm font-semibold text-neutral-900">Subscribe via {tenantName}'s Tenant Network</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPublicSignupOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              When an external user subscribes through your referral link (<strong>{refCode}</strong>), their <strong>R299,99/month subscription</strong> generates recurring passive income for your tenant account.
            </p>

            {publicVisitorError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{publicVisitorError}</span>
              </div>
            )}

            {publicSuccessMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{publicSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handlePublicSignupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lerato Ndlovu"
                  value={publicVisitorName}
                  onChange={(e) => setPublicVisitorName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. lerato.ndlovu@example.co.za"
                  value={publicVisitorEmail}
                  onChange={(e) => setPublicVisitorEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +27 83 987 6543"
                  value={publicVisitorPhone}
                  onChange={(e) => setPublicVisitorPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>Monthly Subscription:</span>
                  <strong className="text-neutral-900">R 299,99 / month</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tenant Sponsor:</span>
                  <strong className="text-emerald-700">{tenantName} {tenantSurname}</strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublicSignupOpen(false)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Subscribe at R299,99/mo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Referral Detailed Information & Management */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {selectedReferral.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{selectedReferral.name}</h3>
                  <p className="text-[11px] text-neutral-500">{selectedReferral.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Referral ID</span>
                <span className="font-mono text-neutral-800">{selectedReferral.id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Contact Phone</span>
                <span className="font-medium text-neutral-900">{selectedReferral.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Channel</span>
                <span className="font-medium text-neutral-900">{selectedReferral.source}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">User Monthly Subscription</span>
                <span className="font-semibold text-neutral-900">R {(selectedReferral.userSubscriptionFeeZar || 299.99).toFixed(2)} / mo</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">User Subscription Status</span>
                <select
                  value={selectedReferral.userSubscriptionStatus || 'active'}
                  onChange={(e) => handleToggleUserSubStatus(selectedReferral.id, e.target.value as 'active' | 'trial' | 'lapsed')}
                  className="px-2 py-0.5 text-xs bg-neutral-50 border border-neutral-200 rounded font-medium focus:outline-hidden"
                >
                  <option value="active">Active (R299,99/mo Paid)</option>
                  <option value="trial">Trial</option>
                  <option value="lapsed">Lapsed / Unpaid</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Tenant Passive Income Cut</span>
                <span className="font-bold text-emerald-600">R {selectedReferral.amountZar.toFixed(2)} / month</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Membership Status</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedReferral.status}
                    onChange={(e) => handleToggleStatus(selectedReferral.id, e.target.value as ReferralStatus)}
                    className="px-2 py-0.5 text-xs bg-neutral-50 border border-neutral-200 rounded font-medium focus:outline-hidden"
                  >
                    <option value="active">Active</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              {selectedReferral.notes && (
                <div className="py-1">
                  <span className="text-neutral-500 block mb-0.5">Notes</span>
                  <p className="text-neutral-800 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    {selectedReferral.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteReferral(selectedReferral.id)}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Record
              </button>
              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Tenant Subscription Checkout / Renewal Modal */}
      <TenantSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscription={subscription}
        onUpdateSubscription={(updated) => {
          onUpdateSubscription(updated);
          saveTenantSubscription(updated);
          if (onShowNotice) {
            onShowNotice(updated.isActive ? 'Tenant subscription active (R299,99/mo). Passive income unlocked!' : 'Tenant subscription updated.');
          }
        }}
        tenantName={tenantName}
        tenantSurname={tenantSurname}
      />
    </div>
  );
}
