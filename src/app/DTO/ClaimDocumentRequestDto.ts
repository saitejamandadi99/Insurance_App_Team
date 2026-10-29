export interface ClaimDocumentRequestDto{
    claimId:number, 
    documentName:string, 
    documentType:string,
    files:File[]
}