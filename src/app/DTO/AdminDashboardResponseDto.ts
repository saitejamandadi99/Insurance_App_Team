import { DashboardClaimDto } from './DashboardClaimDto';

export interface AdminDashboardResponseDto {
  activeUsers: number;
  inactiveUsers: number;
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  topClaims: DashboardClaimDto[];
}