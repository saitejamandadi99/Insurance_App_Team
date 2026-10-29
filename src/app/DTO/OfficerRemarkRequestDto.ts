import { ClaimStatus } from "../Enums/ClaimStatus";

export interface OfficerRemarkRequestDto{
    claimStatus:ClaimStatus,
    officerRemarks:string
}