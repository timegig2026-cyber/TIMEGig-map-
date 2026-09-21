import React from 'react';
import { 
  Sparkles, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Share2, 
  ArrowRight, 
  DollarSign, 
  AlertTriangle, 
  Check, 
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RealReferral, TenantSubscription, TenantTab } from '../../types';

interface TenantOverviewViewProps {
  tenantName: string;
  tenantSurname: string;
  referrals: RealReferral[];
  activeSubscribers: RealReferral[];
  grossPassiveIncome: number;
  netMonthlyPassiveProfit: number;
  tenantFee: number;
  subscription: TenantSubscription;
  shareableUrl: string;
  onNavigateTab: (tab: TenantTab) => void;
  onOpenSubscriptionModal: () => void;
  onOpenPublicSignup: () => void;
  onCopyLink: () => void;
  copiedLink: boolean;
}

export default function TenantOverviewView({
  tenantName,
  tenantSurname,
  referrals,
  activeSubscribers,
  grossPassiveIncome,
  netMonthlyPassiveProfit,
  tenantFee,
  subscription,
  shareableUrl,
  onNavigateTab,
  onOpenSubscriptionModal,
  onOpenPublicSignup,
  onCopyLink,
  copiedLink
}: TenantOverviewViewProps) {
  // Recent 3 referrals
  const recentReferrals = referrals.slice(0, 3);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Overview Welcome & Standing Banner */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {tenantName.charAt(0)}{tenantSurname.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-neutral-900">
                  {tenantName} {tenantSurname}'s Passive Income Program
                </h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  subscription.isActive
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border border-amber-300 text-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${subscription.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {subscription.isActive ? 'Active Tenant Account (R299,99/mo)' : 'Tenant Subscription Overdue'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {subscription.isActive 
                  ? `Licensed to earn monthly passive income. Your next account billing is on ${subscription.nextBillingDate}.`
                  : 'Your account is past due. Pay R299,99 to keep your tenant network active and earn passive income.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!subscription.isActive ? (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay R299,99 & Reactivate
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab('share')}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Referral Link
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Passive Income From User Monthly Subscriptions */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Gross Passive Income</p>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            R {grossPassiveIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-neutral-500 leading-tight">
            From {activeSubscribers.length} active {activeSubscribers.length === 1 ? 'user subscription' : 'user subscriptions'} (R150,00 cut each)
          </p>
        </div>

        {/* Metric 2: Tenant Account Monthly Subscription Cost */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Tenant Subscription</p>
            <CreditCard className="w-4 h-4 text-neutral-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            - R 299,99
          </p>
          <p className="text-[10px] text-neutral-500 flex items-center gap-1">
            Status: 
            <span className={`font-semibold ${subscription.isActive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {subscription.isActive ? 'Active & Paid' : 'Unpaid (Due)'}
            </span>
          </p>
        </div>

        {/* Metric 3: Net Monthly Passive Profit */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Net Monthly Profit</p>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className={`text-2xl font-bold ${netMonthlyPassiveProfit >= 0 ? 'text-emerald-700' : 'text-neutral-700'}`}>
            {netMonthlyPassiveProfit >= 0 ? '+' : ''} R {netMonthlyPassiveProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-neutral-500">
            Gross income minus R299,99 tenant fee
          </p>
        </div>

        {/* Metric 4: Active User Subscribers Count */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Active Subscribers</p>
            <Users className="w-4 h-4 text-neutral-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">
            {activeSubscribers.length} <span className="text-xs font-normal text-neutral-500">of {referrals.length}</span>
          </p>
          <p className="text-[10px] text-neutral-500">
            Paying R299,99 monthly subscription
          </p>
        </div>
      </div>

      {/* Feature Separation & Deep-Dive Navigator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Feature 1: Share & Invite Hub */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">Share & Referral Network</h3>
                  <p className="text-[11px] text-neutral-500">Onboard users using your custom link</p>
                </div>
              </div>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                Live URL
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Share your link with contacts, WhatsApp groups, or social channels. When users subscribe at R299,99/month, you collect R150,00/month recurring passive cut.
            </p>

            <div className="flex items-center gap-1.5 p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="font-mono text-neutral-800 truncate flex-1 text-[11px] select-all">
                {shareableUrl}
              </span>
              <button
                type="button"
                onClick={onCopyLink}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                  copiedLink ? 'bg-emerald-600 text-white' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {copiedLink ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenPublicSignup}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Simulate Visitor
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('share')}
              className="text-xs font-semibold text-neutral-900 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>Open Share Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature 2: Subscribers & Referral Directory */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">User Subscribers Feed</h3>
                  <p className="text-[11px] text-neutral-500">{activeSubscribers.length} active paying users</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                +R {grossPassiveIncome.toFixed(0)}/mo
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Manage your subscriber roster, verify membership status, track renewal dates, and view user contribution to your monthly passive yield.
            </p>

            {/* Quick mini-preview of top 2 active users */}
            <div className="space-y-1.5 pt-1">
              {recentReferrals.slice(0, 2).map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-1.5 bg-neutral-50 rounded-lg text-[11px]">
                  <span className="font-medium text-neutral-900 truncate">{ref.name}</span>
                  <span className="font-bold text-emerald-600 shrink-0">+R {(ref.amountZar || 150).toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Total {referrals.length} registered
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('subscribers')}
              className="text-xs font-semibold text-neutral-900 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature 3: Tenant Account Subscription Hub */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">Tenant Account Subscription</h3>
                  <p className="text-[11px] text-neutral-500">R299,99 / month platform license</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                subscription.isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {subscription.isActive ? 'Active' : 'Due'}
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Tenants must maintain this R299,99/mo subscription to keep their unique referral link live, access automated banking payouts, and protect their verified standing.
            </p>

            <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex justify-between items-center">
              <span className="text-neutral-500 text-[11px]">Next Renewal:</span>
              <span className="font-semibold text-neutral-900 text-[11px]">{subscription.nextBillingDate}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenSubscriptionModal}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Manage / Pay R299,99
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('subscription')}
              className="text-xs font-semibold text-neutral-900 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>Subscription Details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature 4: Passive Income Settlement & Payouts */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900">Passive Income Settlement</h3>
                  <p className="text-[11px] text-neutral-500">Direct South African bank transfer</p>
                </div>
              </div>
              <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                ZAR Account
              </span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Automatic recurring monthly settlement into your verified South African bank account, or request immediate instant settlement of your passive income balance.
            </p>

            <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex justify-between items-center">
              <span className="text-neutral-500 text-[11px]">Available Balance:</span>
              <span className="font-bold text-emerald-600 text-sm">
                R {grossPassiveIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Next scheduled: Oct 1, 2026
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('payouts')}
              className="text-xs font-semibold text-neutral-900 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>Settlement Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Passive Income Calculation Guide Card */}
      <div className="p-4 bg-white border border-neutral-200/90 rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-semibold text-neutral-900">The Passive Income Unit Economics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
            <span className="text-neutral-500 text-[11px] block">1. User Subscription</span>
            <p className="text-base font-bold text-neutral-900">R 299,99 / month</p>
            <p className="text-[10px] text-neutral-500">Paid by every member who signs up under your tenant code.</p>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-1">
            <span className="text-emerald-700 text-[11px] block font-medium">2. Your Passive Cut</span>
            <p className="text-base font-bold text-emerald-700">R 150,00 / user / month</p>
            <p className="text-[10px] text-emerald-800">50.01% recurring passive commission paid directly to you every month.</p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
            <span className="text-neutral-500 text-[11px] block">3. Tenant License Fee</span>
            <p className="text-base font-bold text-neutral-900">- R 299,99 / month</p>
            <p className="text-[10px] text-neutral-500">Break-even at just 2 active users! All subscribers above 2 are pure profit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
