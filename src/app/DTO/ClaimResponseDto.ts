import { ClaimStatus } from "../Enums/ClaimStatus";

export interface ClaimResponseDto{
    claimId:number, 
    claimNumber:string,
    policyNumber:string, 
    customerName:string,
    claimAmount:number,
    claimReason:string, 
    incidentDate:string, 
    claimStatus:ClaimStatus 
    officerRemarks:string,
    adminRemarks:string, 
    createdDate:string, 
    UpdatedByName:string,
}