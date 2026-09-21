import React, { useState } from 'react';
import { 
  Building, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  X, 
  Calendar, 
  AlertCircle,
  Clock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { TenantSubscription } from '../types';

interface TenantSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: TenantSubscription;
  onUpdateSubscription: (sub: TenantSubscription) => void;
  tenantName: string;
  tenantSurname: string;
}

export default function TenantSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
  tenantName,
  tenantSurname
}: TenantSubscriptionModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'eft' | 'ozow'>('eft');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [autoRenew, setAutoRenew] = useState(subscription.autoRenew);

  if (!isOpen) return null;

  const handlePaySubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setDate(nextMonth.getDate() + 30);
      
      const formattedNextDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(nextMonth.getDate()).padStart(2, '0')}`;
      const formattedToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const updated: TenantSubscription = {
        isActive: true,
        monthlyFeeZar: 299.99,
        billingCycle: 'monthly',
        status: 'active',
        nextBillingDate: formattedNextDate,
        lastPaymentDate: formattedToday,
        paymentMethod: selectedMethod === 'card' 
          ? 'Debit/Credit Card (•••• 5412)' 
          : selectedMethod === 'ozow'
          ? 'Ozow Instant Bank Pay'
          : 'Capitec / Instant EFT',
        autoRenew
      };

      onUpdateSubscription(updated);

      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  const handleSimulateLapse = () => {
    const updated: TenantSubscription = {
      ...subscription,
      isActive: false,
      status: 'past_due',
      nextBillingDate: 'Immediate (Overdue)'
    };
    onUpdateSubscription(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Tenant Monthly Subscription</h3>
              <p className="text-[11px] text-neutral-500">Maintain active tenant status & passive income</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-neutral-900">Subscription Payment Successful!</h4>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">
              Your monthly tenant subscription of <strong>R299,99</strong> has been verified. Your tenant account is active and collecting passive income.
            </p>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Receipt:</span>
                <span className="font-semibold text-neutral-900">TEN-SUB-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-600">R 299,99</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">Active Tenant (Paid)</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePaySubscription} className="space-y-4">
            
            {/* Subscription Pricing Banner */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Monthly Plan</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold">R 299,99</span>
                    <span className="text-xs text-neutral-300">/ month</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1">
                    Billed monthly to keep your tenant account active.
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    subscription.isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  }`}>
                    {subscription.isActive ? 'Current: Active' : 'Current: Overdue'}
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-1 font-mono">Next: {subscription.nextBillingDate}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Earns recurring passive income from user subscriptions
                </span>
                <span className="text-emerald-400 font-semibold">100% Retained</span>
              </div>
            </div>

            {/* Why pay subscription explanation */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Why R299,99/month?</strong> Tenants maintain an active tenant profile to license their personal referral link and receive monthly passive income from every active user subscriber.
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-800">
                Select South African Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('eft')}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    selectedMethod === 'eft'
                      ? 'border-emerald-600 bg-emerald-50/50 text-neutral-900 font-medium ring-1 ring-emerald-600'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">Instant EFT</span>
                    {selectedMethod === 'eft' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">Capitec, FNB, Nedbank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    selectedMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50/50 text-neutral-900 font-medium ring-1 ring-emerald-600'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">Card</span>
                    {selectedMethod === 'card' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">Visa, Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('ozow')}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                    selectedMethod === 'ozow'
                      ? 'border-emerald-600 bg-emerald-50/50 text-neutral-900 font-medium ring-1 ring-emerald-600'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">Ozow Pay</span>
                    {selectedMethod === 'ozow' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">Instant Bank Link</span>
                </button>
              </div>
            </div>

            {/* Auto renew toggle */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div>
                <span className="font-semibold text-neutral-800">Auto-Debit Monthly Subscription</span>
                <p className="text-[10px] text-neutral-500">Automatically renews R299,99 every 30 days to avoid disruption</p>
              </div>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleSimulateLapse}
                className="px-2.5 py-1.5 text-neutral-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-[10px] font-medium transition-colors"
                title="Simulate what happens if the tenant subscription lapses/unpaid"
              >
                Simulate Unpaid (Test)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Processing R299,99...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay R299,99 & Keep Active
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
