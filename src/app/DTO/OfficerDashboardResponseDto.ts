import { DashboardClaimDto } from './DashboardClaimDto';
import { DashboardPolicyResponseDTO } from './DashboardPolicyResponseDTO';
import { DashboardPaymentResponseDTO } from './DashboardPaymentResponseDTO';

export interface OfficerDashboardResponseDto {
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  topClaims: DashboardClaimDto[];
  recentPolicies: DashboardPolicyResponseDTO[];
  recentPayments: DashboardPaymentResponseDTO[];
}