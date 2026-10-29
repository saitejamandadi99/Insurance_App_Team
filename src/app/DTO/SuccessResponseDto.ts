export interface SuccessResponseDto<T>{
    success:boolean,
    message:string,
    data:T,
    timeStamp:string,
}