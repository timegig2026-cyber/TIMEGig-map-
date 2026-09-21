import React from 'react';
import { 
  LayoutDashboard, 
  Share2, 
  Users, 
  CreditCard, 
  DollarSign, 
  Download,
  Plus,
  Sparkles
} from 'lucide-react';
import { TenantTab } from '../../types';

interface TenantTopBarProps {
  activeTab: TenantTab;
  onTabChange: (tab: TenantTab) => void;
  activeSubscribersCount: number;
  totalReferralsCount: number;
  isSubscriptionActive: boolean;
  grossPassiveIncome: number;
  onExportCSV?: () => void;
  onOpenAddModal?: () => void;
}

export default function TenantTopBar({
  activeTab,
  onTabChange,
  activeSubscribersCount,
  totalReferralsCount,
  isSubscriptionActive,
  grossPassiveIncome,
  onExportCSV,
  onOpenAddModal
}: TenantTopBarProps) {
  const tabs: {
    id: TenantTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeType?: 'default' | 'success' | 'warning' | 'primary';
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'share',
      label: 'Share & Invite',
      icon: Share2,
      badge: 'Link Ready',
      badgeType: 'default'
    },
    {
      id: 'subscribers',
      label: 'Subscribers',
      icon: Users,
      badge: `${activeSubscribersCount} Active`,
      badgeType: activeSubscribersCount > 0 ? 'success' : 'default'
    },
    {
      id: 'subscription',
      label: 'My Subscription',
      icon: CreditCard,
      badge: isSubscriptionActive ? 'R299,99 Active' : 'R299 Due',
      badgeType: isSubscriptionActive ? 'success' : 'warning'
    },
    {
      id: 'payouts',
      label: 'Payouts & Bank',
      icon: DollarSign,
      badge: `R ${grossPassiveIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      badgeType: grossPassiveIncome > 0 ? 'primary' : 'default'
    }
  ];

  return (
    <nav aria-label="Tenant Features" className="bg-white border border-neutral-200/90 rounded-2xl p-1.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        {/* Horizontally scrollable tabs list */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
                
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeType === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : tab.badgeType === 'warning'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                        : tab.badgeType === 'primary'
                        ? 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick action buttons on the right side of top bar */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 pl-2 border-l border-neutral-200/80">
          {onOpenAddModal && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
              title="Manually register a user referral"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-600" />
              <span>Register User</span>
            </button>
          )}

          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors"
              title="Download CSV export"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
