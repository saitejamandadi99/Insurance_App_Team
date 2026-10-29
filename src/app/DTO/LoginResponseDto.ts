export interface LoginResponseDto{
    jwtToken:string, 
    tokenType:string,
    userEmail:string,
    userRole:string,
    expiresAt:string;
}