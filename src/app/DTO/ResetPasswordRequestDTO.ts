export interface ResetPasswordRequestDTO{
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}