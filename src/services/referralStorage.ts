import { RealReferral, TenantSubscription } from '../types';

const STORAGE_KEY = 'tenancy_real_referrals_v3';
const TENANT_SUBSCRIPTION_KEY = 'tenant_subscription_record_v1';

export const TENANT_MONTHLY_FEE_ZAR = 299.99;

export const DEFAULT_TENANT_SUBSCRIPTION: TenantSubscription = {
  isActive: true,
  monthlyFeeZar: TENANT_MONTHLY_FEE_ZAR,
  billingCycle: 'monthly',
  status: 'active',
  nextBillingDate: '2026-10-21',
  lastPaymentDate: '2026-09-21',
  paymentMethod: 'Instant EFT / Debit Card (Verified)',
  autoRenew: true
};

const INITIAL_REAL_REFERRALS: RealReferral[] = [
  {
    id: 'ref-1',
    name: 'Thabo Mokoena',
    email: 'thabo.mokoena@netbiz.co.za',
    phone: '+27 82 459 1120',
    referralCode: 'sophia-thorne-ref',
    source: 'Referral Link',
    status: 'active',
    registeredAt: '2026-09-21 08:15',
    userSubscriptionFeeZar: 299.99,
    userSubscriptionStatus: 'active',
    amountZar: 150.00, // 50% passive income share from user monthly subscription
    notes: 'Subscribed to monthly plan. Passive income generating.'
  },
  {
    id: 'ref-2',
    name: 'Kagiso Sithole',
    email: 'kagiso.s@apextech.co.za',
    phone: '+27 71 892 4431',
    referralCode: 'sophia-thorne-ref',
    source: 'WhatsApp',
    status: 'verified',
    registeredAt: '2026-09-20 16:40',
    userSubscriptionFeeZar: 299.99,
    userSubscriptionStatus: 'active',
    amountZar: 150.00,
    notes: 'Direct WhatsApp invitation. Active monthly subscriber.'
  },
  {
    id: 'ref-3',
    name: 'Nandi Khumalo',
    email: 'nandi.khumalo@designstudio.org',
    phone: '+27 83 234 9901',
    referralCode: 'sophia-thorne-ref',
    source: 'Email Invite',
    status: 'active',
    registeredAt: '2026-09-19 11:22',
    userSubscriptionFeeZar: 299.99,
    userSubscriptionStatus: 'active',
    amountZar: 150.00,
    notes: 'Email invite referral. Active monthly subscriber.'
  },
  {
    id: 'ref-4',
    name: 'Devon Clarke',
    email: 'devon.clarke@capecloud.io',
    phone: '+27 74 610 8823',
    referralCode: 'sophia-thorne-ref',
    source: 'Direct Invite',
    status: 'active',
    registeredAt: '2026-09-18 14:05',
    userSubscriptionFeeZar: 299.99,
    userSubscriptionStatus: 'active',
    amountZar: 150.00,
    notes: 'Professional contact referral. Active monthly subscriber.'
  }
];

export function loadRealReferrals(): RealReferral[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REAL_REFERRALS));
      return INITIAL_REAL_REFERRALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Ensure backwards compatibility with earlier records
      return parsed.map(item => ({
        ...item,
        userSubscriptionFeeZar: item.userSubscriptionFeeZar || 299.99,
        userSubscriptionStatus: item.userSubscriptionStatus || 'active',
        amountZar: item.amountZar !== undefined ? item.amountZar : 150.00
      }));
    }
    return INITIAL_REAL_REFERRALS;
  } catch (err) {
    console.error('Failed to load referrals from localStorage:', err);
    return INITIAL_REAL_REFERRALS;
  }
}

export function saveRealReferrals(referrals: RealReferral[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(referrals));
  } catch (err) {
    console.error('Failed to save referrals to localStorage:', err);
  }
}

export function loadTenantSubscription(): TenantSubscription {
  try {
    const raw = localStorage.getItem(TENANT_SUBSCRIPTION_KEY);
    if (!raw) {
      localStorage.setItem(TENANT_SUBSCRIPTION_KEY, JSON.stringify(DEFAULT_TENANT_SUBSCRIPTION));
      return DEFAULT_TENANT_SUBSCRIPTION;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TENANT_SUBSCRIPTION,
      ...parsed
    };
  } catch (err) {
    console.error('Failed to load tenant subscription:', err);
    return DEFAULT_TENANT_SUBSCRIPTION;
  }
}

export function saveTenantSubscription(sub: TenantSubscription): void {
  try {
    localStorage.setItem(TENANT_SUBSCRIPTION_KEY, JSON.stringify(sub));
  } catch (err) {
    console.error('Failed to save tenant subscription:', err);
  }
}

export function exportReferralsToCSV(referrals: RealReferral[]): void {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Referral Code', 'Source', 'Status', 'Registered At', 'User Monthly Sub (ZAR)', 'User Sub Status', 'Tenant Monthly Passive Income (ZAR)', 'Notes'];
  const rows = referrals.map(r => [
    `"${r.id}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${r.referralCode}"`,
    `"${r.source}"`,
    `"${r.status}"`,
    `"${r.registeredAt}"`,
    `"${(r.userSubscriptionFeeZar || 299.99).toFixed(2)}"`,
    `"${r.userSubscriptionStatus || 'active'}"`,
    `"${r.amountZar.toFixed(2)}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `real_referrals_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
