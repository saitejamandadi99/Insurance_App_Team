import { PaymentMode } from '../Enums/PaymentMode';

export interface PaymentRequestDto {
policyId: number;
paymentMode: PaymentMode;
}
