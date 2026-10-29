export interface ErrorResponseDto{
    timeStamp:Date,
    statusCode:number,
    errorType:string,
    message:string,
    requestPath:string
}