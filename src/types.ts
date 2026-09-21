export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface UserProfileSubmission {
  id: string;
  profilePic: string;
  name: string;
  middleName: string;
  surname: string;
  dob: string;
  contactNumber: string;
  email: string;
  homeAddress: string;
  location: string;
  province: string;
  workingSkills: string[];
  socialLinks: SocialLink[];
  idFileName: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export type ReferralSource = 
  | 'Referral Link' 
  | 'Direct Invite' 
  | 'WhatsApp' 
  | 'Email Invite' 
  | 'Manual Registration';

export type ReferralStatus = 'active' | 'pending' | 'verified';

export interface RealReferral {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode: string;
  source: ReferralSource;
  status: ReferralStatus;
  registeredAt: string; // ISO date or formatted string
  userSubscriptionFeeZar: number; // e.g. 299.99 monthly subscription paid by this user
  userSubscriptionStatus: 'active' | 'trial' | 'lapsed'; // user subscription state
  amountZar: number; // monthly passive income earned by tenant from this user subscription (e.g. 150.00 / mo)
  notes?: string;
}

export interface TenantSubscription {
  isActive: boolean;
  monthlyFeeZar: number; // 299.99
  billingCycle: 'monthly';
  status: 'active' | 'past_due' | 'unpaid';
  nextBillingDate: string; // e.g. "2026-10-21"
  lastPaymentDate: string; // e.g. "2026-09-21"
  paymentMethod: string;
  autoRenew: boolean;
}

export interface TenantSubscriptionPayment {
  id: string;
  date: string;
  amountZar: number; // 299.99
  status: 'successful' | 'pending' | 'failed';
  referenceId: string;
  method: string;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amountZar: number;
  referralCount: number;
  status: 'completed' | 'processing' | 'queued';
  referenceId: string;
}

export type TenantTab = 'overview' | 'share' | 'subscribers' | 'subscription' | 'payouts';

