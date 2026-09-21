import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Receipt, 
  FileText, 
  Download, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TenantSubscription } from '../../types';
import { TENANT_MONTHLY_FEE_ZAR } from '../../services/referralStorage';

interface TenantSubscriptionViewProps {
  subscription: TenantSubscription;
  tenantName: string;
  tenantSurname: string;
  onUpdateSubscription: (sub: TenantSubscription) => void;
  onOpenSubscriptionModal: () => void;
  onShowNotice?: (message: string) => void;
}

export default function TenantSubscriptionView({
  subscription,
  tenantName,
  tenantSurname,
  onUpdateSubscription,
  onOpenSubscriptionModal,
  onShowNotice
}: TenantSubscriptionViewProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Simulated billing invoices history
  const invoices = [
    {
      id: 'INV-2026-0921',
      date: 'September 21, 2026',
      amountZar: 299.99,
      status: subscription.isActive ? 'Paid' : 'Past Due',
      method: subscription.paymentMethod || 'Capitec Pay (Instant EFT)',
      ref: 'TENANT-SUB-SEP26'
    },
    {
      id: 'INV-2026-0821',
      date: 'August 21, 2026',
      amountZar: 299.99,
      status: 'Paid',
      method: 'Visa Debit (*4021)',
      ref: 'TENANT-SUB-AUG26'
    },
    {
      id: 'INV-2026-0721',
      date: 'July 21, 2026',
      amountZar: 299.99,
      status: 'Paid',
      method: 'Ozow Instant EFT',
      ref: 'TENANT-SUB-JUL26'
    }
  ];

  const toggleSubscriptionState = () => {
    const updated: TenantSubscription = {
      ...subscription,
      isActive: !subscription.isActive,
      status: !subscription.isActive ? 'active' : 'past_due',
      nextBillingDate: !subscription.isActive ? 'October 21, 2026' : 'Immediate (Overdue)'
    };
    onUpdateSubscription(updated);
    if (onShowNotice) {
      onShowNotice(`Tenant subscription set to ${updated.isActive ? 'Active (R299,99/mo Paid)' : 'Past Due / Unpaid'}`);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Primary Subscription Standing Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        subscription.isActive 
          ? 'bg-white border-neutral-200/90 shadow-2xs' 
          : 'bg-amber-50/80 border-amber-300 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
              subscription.isActive 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Tenant Account Monthly Subscription
                </h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  subscription.isActive 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${subscription.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {subscription.isActive ? 'Subscription Active (R299,99/mo Paid)' : 'Subscription Overdue (R299,99 Due)'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {subscription.isActive ? (
                  <>
                    Your tenant account is in good standing. Billed <strong>R299,99</strong> monthly to keep your tenant passive income program active. Next billing date is <strong className="text-neutral-900">{subscription.nextBillingDate}</strong>.
                  </>
                ) : (
                  <>
                    <strong className="text-amber-900">Payment required:</strong> Tenants must pay the monthly subscription of <strong>R299,99</strong> to keep their tenant account active. Passive income payout collection is currently on hold.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {subscription.isActive ? (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Manage Payment
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                Pay R299,99 & Reactivate
              </button>
            )}
          </div>
        </div>

        {/* Quick Testing Controls Banner */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
            <span>Subscription ID: <strong className="font-mono text-neutral-700">SUB-TENANT-{tenantName.toUpperCase()}</strong></span>
            <span>•</span>
            <span>Method: <strong className="text-neutral-800">{subscription.paymentMethod}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-400">Sandbox Test:</span>
            <button
              type="button"
              onClick={toggleSubscriptionState}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-medium transition-colors"
            >
              {subscription.isActive ? 'Simulate Past Due State' : 'Simulate Paid State'}
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Benefits & License Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why Tenants Pay R299,99 */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-semibold text-neutral-900">What's Included in Your Tenant License</h3>
          </div>

          <div className="space-y-2 text-xs text-neutral-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Recurring Passive Income Collection:</strong>
                <p className="text-[11px] text-neutral-500">Collect 50.01% (R150,00/mo) from every active user subscription under your network.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Live Custom Referral Link:</strong>
                <p className="text-[11px] text-neutral-500">Your custom URL remains active and securely routed to your tenant account 24/7.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Direct South African Bank Settlement:</strong>
                <p className="text-[11px] text-neutral-500">Automated monthly payout settlement into your verified South African bank account.</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Verified Compliance Badge:</strong>
                <p className="text-[11px] text-neutral-500">Protection against fraud, verified tenant certification, and priority support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Details & Billing Cycle */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">Billing Schedule & Cycle</span>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">Monthly Auto-Renew</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Monthly Plan Rate</span>
                <span className="font-bold text-neutral-900">R 299,99 / month (incl. VAT)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Current Standing</span>
                <span className={`font-semibold ${subscription.isActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {subscription.isActive ? 'Active & Up to Date' : 'Past Due (R299,99 Required)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Next Billing Date</span>
                <span className="font-semibold text-neutral-900">{subscription.nextBillingDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-neutral-500">Primary Payment Source</span>
                <span className="font-medium text-neutral-800">{subscription.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onOpenSubscriptionModal}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Update Billing Details / Switch Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice & Payment History */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">Tenant Billing Invoices & Receipts</h3>
          </div>
          <span className="text-[11px] text-neutral-500">Official South African Tax Invoices</span>
        </div>

        <div className="space-y-2 overflow-x-auto">
          {invoices.map((inv) => (
            <div 
              key={inv.id}
              className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100/70 rounded-xl border border-neutral-200/70 text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 font-mono text-[10px]">
                  PDF
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">{inv.id}</p>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-300'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{inv.date} • {inv.method}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-neutral-900">R {inv.amountZar.toFixed(2)}</p>
                  <p className="text-[10px] text-neutral-400">{inv.ref}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(inv.id)}
                  className="px-2.5 py-1 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 rounded-lg text-[11px] font-medium transition-colors"
                >
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Receipt Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-neutral-900">Tax Invoice {selectedReceipt}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Subscriber</span>
                <span className="font-semibold text-neutral-900">{tenantName} {tenantSurname}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Service</span>
                <span>Tenant Monthly License (Active Network Standing)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Amount (ZAR)</span>
                <span className="font-bold text-neutral-900">R 299,99</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Payment Status</span>
                <span className="text-emerald-700 font-semibold">Payment Verified & Settled ✓</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">VAT (15%)</span>
                <span>R 39,13 (Included)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
