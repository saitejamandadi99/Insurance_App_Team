import { DashboardClaimHistoryDto } from './DashboardClaimHistoryDto';
import { DashboardPolicyResponseDTO } from './DashboardPolicyResponseDTO';
import { DashboardPaymentResponseDTO } from './DashboardPaymentResponseDTO';
export interface CustomerDashboardResponseDto {
  totalClaimsCount: number;
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  claimHistory: DashboardClaimHistoryDto[];
  recentPolicies: DashboardPolicyResponseDTO[];
  recentPayments: DashboardPaymentResponseDTO[];
}