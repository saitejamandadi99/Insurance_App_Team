import { DashboardClaimHistoryDto } from './DashboardClaimHistoryDto';

export interface CustomerDashboardResponseDto {
  totalClaimsCount: number;
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  claimHistory: DashboardClaimHistoryDto[];
}