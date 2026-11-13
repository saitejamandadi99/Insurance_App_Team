import { DashboardClaimDto } from './DashboardClaimDto';
import { DashboardPolicyResponseDTO } from './DashboardPolicyResponseDTO';
import { DashboardPaymentResponseDTO } from './DashboardPaymentResponseDTO';

export interface AdminDashboardResponseDto {
  activeUsers: number;
  inactiveUsers: number;
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  topClaims: DashboardClaimDto[];
  recentPolicies: DashboardPolicyResponseDTO[];
  recentPayments: DashboardPaymentResponseDTO[];
}