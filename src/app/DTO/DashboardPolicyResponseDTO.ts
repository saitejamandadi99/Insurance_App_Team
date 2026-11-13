import { PolicyStatus } from "../Enums/PolicyStatus";

export interface DashboardPolicyResponseDTO {
  policyId: number;
  policyNumber: string;
  customerName: string;
  productName: string;
  planName: string;
  startDate: string;
  endDate: string;
  policyStatus: PolicyStatus;
  totalPremiumPaid: number;
  createdDate: string;
}