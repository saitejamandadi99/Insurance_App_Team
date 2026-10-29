import { ToastType } from "./ToastType";

export interface Toast{
    id:number, 
    type:ToastType,
    title:string,
    message:string, 
    duration:number,
}