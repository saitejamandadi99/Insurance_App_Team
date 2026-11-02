import { PremiumType } from '../Enums/PremiumType';

export interface PolicyPlanRequestDto {
  productId: number;
  planName: string;
  coverageAmount: number;
  premiumAmount: number;
  premiumType: PremiumType;
  duration: number;
  termsAndConditions: string;
}