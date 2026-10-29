import { ClaimStatus } from "../Enums/ClaimStatus";

export interface AdminRemarkRequestDto{
    claimStatus:ClaimStatus,
    adminRemarks:string
}