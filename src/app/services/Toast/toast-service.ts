import { Injectable, Service } from '@angular/core';
import { ToastType } from '../../Enums/ToastType';
import { Toast } from '../../Enums/Toast';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class ToastService {
    private toastSubject = new BehaviorSubject<Toast[]>([]);
    readonly toasts$ = this.toastSubject.asObservable();
    private currentToasts: Toast[] = [];
    show(type:ToastType, title:string,message:string,duration:number = 60000):void{
        const toast:Toast={
            id:Date.now()+Math.random(),
            type,
            title,
            message,
            duration
        };

        this.currentToasts.unshift(toast);
        this.toastSubject.next([...this.currentToasts]);

        setTimeout(()=>{
            this.remove(toast.id)
        }, duration);
    }

    success(message:string, title:string='Success', duration:number=4000):void{
        this.show(ToastType.Success,title, message, duration);
    }

     error(message:string, title:string='Error', duration:number=4000):void{
        this.show(ToastType.Error,title, message, duration);
    }

     info(message:string, title:string='Info', duration:number=4000):void{
        this.show(ToastType.Info,title, message, duration);
    }

     warning(message:string, title:string='Warning', duration:number=4000):void{
        this.show(ToastType.Warning,title, message, duration);
    }

    remove(id:number):void{
        this.currentToasts=this.currentToasts.filter(toast=>toast.id !== id);
        this.toastSubject.next([...this.currentToasts]);

    }
}
