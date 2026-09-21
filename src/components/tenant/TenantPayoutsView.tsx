import React, { useState } from 'react';
import { 
  DollarSign, 
  Landmark, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  CreditCard, 
  Download,
  ShieldCheck,
  Building
} from 'lucide-react';
import { TenantSubscription } from '../../types';

interface TenantPayoutsViewProps {
  tenantName: string;
  tenantSurname: string;
  grossPassiveIncome: number;
  subscription: TenantSubscription;
  onOpenSubscriptionModal: () => void;
  onShowNotice?: (message: string) => void;
}

export default function TenantPayoutsView({
  tenantName,
  tenantSurname,
  grossPassiveIncome,
  subscription,
  onOpenSubscriptionModal,
  onShowNotice
}: TenantPayoutsViewProps) {
  const [payoutStatus, setPayoutStatus] = useState<'ready' | 'processing' | 'paid'>('ready');
  const [lastWithdrawnAmount, setLastWithdrawnAmount] = useState<number | null>(null);

  // Past settlements ledger
  const settlements = [
    {
      id: 'SET-2026-0901',
      date: 'September 1, 2026',
      amountZar: 1200.00,
      bank: 'First National Bank (FNB)',
      accEnding: '*8491',
      status: 'Completed',
      ref: 'PAY-ZAR-883912'
    },
    {
      id: 'SET-2026-0801',
      date: 'August 1, 2026',
      amountZar: 900.00,
      bank: 'First National Bank (FNB)',
      accEnding: '*8491',
      status: 'Completed',
      ref: 'PAY-ZAR-771928'
    },
    {
      id: 'SET-2026-0701',
      date: 'July 1, 2026',
      amountZar: 600.00,
      bank: 'First National Bank (FNB)',
      accEnding: '*8491',
      status: 'Completed',
      ref: 'PAY-ZAR-664910'
    }
  ];

  const handleWithdraw = () => {
    if (!subscription.isActive) {
      if (onShowNotice) {
        onShowNotice('Please pay your R299,99 tenant subscription to activate your account and withdraw.');
      }
      return;
    }
    if (grossPassiveIncome <= 0) {
      if (onShowNotice) {
        onShowNotice('No active passive income balance available to withdraw.');
      }
      return;
    }

    setPayoutStatus('processing');
    setLastWithdrawnAmount(grossPassiveIncome);

    setTimeout(() => {
      setPayoutStatus('paid');
      if (onShowNotice) {
        onShowNotice(`Direct bank settlement of R ${grossPassiveIncome.toFixed(2)} completed successfully!`);
      }
    }, 1600);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Primary Balance & Immediate Settlement Hero */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Available Passive Income Balance
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  R {grossPassiveIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-neutral-500 font-medium">ZAR</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Ready for immediate bank settlement or automated monthly payout.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={!subscription.isActive || payoutStatus === 'processing' || payoutStatus === 'paid' || grossPassiveIncome === 0}
              className={`px-5 py-3 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-2 ${
                !subscription.isActive ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200' :
                payoutStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                payoutStatus === 'processing' ? 'bg-amber-100 text-amber-800' :
                grossPassiveIncome === 0 ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200' :
                'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-[1.02]'
              }`}
            >
              {!subscription.isActive ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Tenant Due (R299,99 Required)</span>
                </>
              ) : payoutStatus === 'paid' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Settlement Dispatched ✓</span>
                </>
              ) : payoutStatus === 'processing' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-amber-700" />
                  <span>Processing Bank Settlement...</span>
                </>
              ) : grossPassiveIncome === 0 ? (
                <span>No Passive Income Balance</span>
              ) : (
                <>
                  <Landmark className="w-4 h-4" />
                  <span>Withdraw Now to Bank Account</span>
                </>
              )}
            </button>

            {!subscription.isActive && (
              <button
                type="button"
                onClick={onOpenSubscriptionModal}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline"
              >
                Pay R299,99 to Unlock Payouts
              </button>
            )}
          </div>
        </div>

        {/* Warning if tenant subscription is inactive */}
        {!subscription.isActive && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Passive income withdrawal locked:</strong> Tenants must maintain an active monthly subscription of R299,99 to receive bank payouts.
            </span>
          </div>
        )}
      </div>

      {/* Settlement Account Details & Automated Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified South African Bank Account */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-neutral-800" />
              <h3 className="text-xs font-semibold text-neutral-900">Verified Settlement Bank Account</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Verified EFT
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Bank Name</span>
              <span className="font-semibold text-neutral-900">First National Bank (FNB)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Account Holder</span>
              <span className="font-medium text-neutral-800">{tenantName} {tenantSurname}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Account Number</span>
              <span className="font-mono text-neutral-800">6284••••••8491 (Cheque)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Branch Code</span>
              <span className="font-mono text-neutral-800">250655 (Universal)</span>
            </div>
          </div>
        </div>

        {/* Schedule & Payout Rules */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-800" />
              <h3 className="text-xs font-semibold text-neutral-900">Automated Settlement Cycle</h3>
            </div>
            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
              1st of Every Month
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Next Scheduled Run</span>
              <span className="font-semibold text-neutral-900">October 1, 2026 (00:00 SAST)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Settlement Currency</span>
              <span className="font-medium text-neutral-800">South African Rand (ZAR)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="text-neutral-500">Minimum Payout Threshold</span>
              <span className="font-medium text-neutral-800">R 0,00 (No minimum)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Fee on Withdrawal</span>
              <span className="font-semibold text-emerald-700">R 0,00 (Free Direct EFT)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Settlements Table */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">Settlement Ledger & Historical Payouts</h3>
          </div>
          <span className="text-[11px] text-neutral-500">Direct SARB & Bank Cleared</span>
        </div>

        <div className="space-y-2">
          {settlements.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100/70 rounded-xl border border-neutral-200/70 text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">R {item.amountZar.toFixed(2)}</p>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {item.date} • {item.bank} ({item.accEnding})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-[11px] text-neutral-600 block">{item.ref}</span>
                <span className="text-[10px] text-neutral-400">Direct EFT</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
