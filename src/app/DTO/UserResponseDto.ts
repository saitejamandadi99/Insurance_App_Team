import { ActiveStatus } from "../Enums/ActiveStatus";

export interface UserResponseDto{
    userId:number,
    fullName:string,
    email:string,
    mobileNumber:string,
    role:string,
    activeStatus:ActiveStatus,
    createdDate:string
}