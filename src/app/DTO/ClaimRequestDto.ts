export interface ClaimRequestDto{
    policyId:number, 
    claimAmount:number, 
    claimReason:string,
    incidentDate:Date,
    files : File[]
}