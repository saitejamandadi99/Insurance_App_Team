import { ActiveStatus } from "../Enums/ActiveStatus";
import { ProductType } from "../Enums/ProductType";

export interface ProductResponseDto{
    productId:number, 
    productName:string,
    productType:ProductType,
    description:string,
    activeStatus:ActiveStatus,
    createdDate:string,
    updatedDate:string
}