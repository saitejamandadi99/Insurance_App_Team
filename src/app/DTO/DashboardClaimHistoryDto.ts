import { ClaimStatus } from "../Enums/ClaimStatus";

export interface DashboardClaimHistoryDto {
  claimId: number;
  claimNumber: string;
  claimAmount: number;
  claimStatus: ClaimStatus;
  createdDate: string;
  updatedDate: string;
}