import { DashboardClaimDto } from './DashboardClaimDto';

export interface OfficerDashboardResponseDto {
  pendingClaimsCount: number;
  pendingClaimsAmount: number;
  topClaims: DashboardClaimDto[];
}