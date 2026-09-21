import React from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Users,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { TenantSubscription } from '../../types';

interface TenantShareViewProps {
  tenantName: string;
  tenantSurname: string;
  refCode: string;
  shareableUrl: string;
  subscription: TenantSubscription;
  copiedLink: boolean;
  onCopyLink: () => void;
  onWhatsAppShare: () => void;
  onEmailInvite: () => void;
  onOpenPublicSignup: () => void;
  onOpenAddModal: () => void;
}

export default function TenantShareView({
  tenantName,
  tenantSurname,
  refCode,
  shareableUrl,
  subscription,
  copiedLink,
  onCopyLink,
  onWhatsAppShare,
  onEmailInvite,
  onOpenPublicSignup,
  onOpenAddModal
}: TenantShareViewProps) {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Shareable Link Hero Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Your Official Tenant Share & Referral Link
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Share this link with anyone. When they register and pay their R299,99/month subscription, you receive R150,00/month recurring passive income.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg border border-neutral-200">
              Code: <strong>{refCode}</strong>
            </span>
          </div>
        </div>

        {/* The Link Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
          <div className="flex-1 min-w-0 px-2 py-1 bg-white border border-neutral-200 rounded-lg">
            <span className="font-mono text-xs text-neutral-800 break-all select-all block">
              {shareableUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={onCopyLink}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0 ${
              copiedLink 
                ? 'bg-emerald-600 text-white' 
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* 1-Click Outreach Buttons */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onWhatsAppShare}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onEmailInvite}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-neutral-600" />
              <span>Email Invitation</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPublicSignup}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Test how external members subscribe through your referral link"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate User Subscription (R299,99)</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Card Preview & Conversion Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Invite Card */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Verified Tenant Pass
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-emerald-300 border border-emerald-400/20">
                Official Network
              </span>
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                {tenantName} {tenantSurname}
              </p>
              <p className="text-xs text-neutral-300 mt-0.5">
                Authorized Tenant Network Host
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-300">
                <span>User Subscription Tier:</span>
                <span className="font-semibold text-white">R 299,99 / month</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-300">
                <span>Tenant Passive Cut:</span>
                <span className="font-bold text-emerald-400">R 150,00 / month</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-300">
                <span>Referral Code:</span>
                <span className="font-mono text-white">{refCode}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Powered by Verified Community Program</span>
            <button
              type="button"
              onClick={onCopyLink}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {copiedLink ? 'Link Copied ✓' : 'Copy Share URL'}
            </button>
          </div>
        </div>

        {/* How It Works & Conversion Tips */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-semibold text-neutral-900">How You Earn Monthly Passive Income</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-neutral-900">Share Your Custom Link</p>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Post on WhatsApp status, send direct invites to colleagues, or share via email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold text-neutral-900">Users Pay R299,99 Monthly Subscription</p>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  Subscribers gain verified profile status, community features, and instant networking perks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold text-emerald-800">You Receive R150,00 Every Single Month</p>
                <p className="text-neutral-500 text-[11px] leading-relaxed">
                  As long as the user's subscription remains active and your tenant subscription is paid, passive income continues indefinitely!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onOpenPublicSignup}
              className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              <span>Launch Inbound Visitor Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
