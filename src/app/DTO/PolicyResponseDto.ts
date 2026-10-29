import { PolicyStatus } from "../Enums/PolicyStatus";

export interface PolicyResponseDto{
    policyId:number, 
    policyNumber:string, 
    customerId:number, 
    customerName:string, 
    planId:number, 
    planName:string, 
    startDate:Date,
    endDate:Date,
    dueDate:Date,   
    policyStatus:PolicyStatus,
    totalPremiumPaid:number,
    premiumAmount:number
}