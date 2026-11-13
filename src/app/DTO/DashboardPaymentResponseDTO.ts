import { PaymentMode } from "../Enums/PaymentMode";
import { PaymentStatus } from "../Enums/PaymentStatus";

export interface DashboardPaymentResponseDTO {
  paymentId: number;
  policyId: number;
  policyNumber: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionReference: string;
  paymentStatus: PaymentStatus;
}