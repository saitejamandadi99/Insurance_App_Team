import { ProductType } from "../Enums/ProductType";

export interface ProductRequestDto{
    productName:string,
    productType:ProductType,
    description:string
}