import { PaymentMode } from '../Enums/PaymentMode';
import { PaymentStatus } from '../Enums/PaymentStatus';

export interface PaymentResponseDto {
paymentId: number;
policyNumber: string;
amount: number;
paymentDate: Date;
paymentMode: PaymentMode;
transactionReference: string;
paymentStatus: PaymentStatus;
}
