import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductType } from '../../../../Enums/ProductType';
import { Product } from '../../../../services/Product/product';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ProductRequestDto } from '../../../../DTO/ProductRequestDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  standalone:true,
  selector: 'app-add-product',
  styleUrl: './add-product.css',
  templateUrl: './add-product.html',
})
export class AddProduct {
  productForm :FormGroup = new FormGroup({
    productName:new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    productType:new FormControl('',[Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)])
  });

  ProductType = ProductType;
  productTypes = Object.values(ProductType);

  isLoading = false;
  constructor(private prodService:Product, private router:Router, private toastService:ToastService){}

  addProduct(){
     if (this.productForm.invalid || this.isLoading) {
      this.productForm.markAllAsTouched();
      return;
    }

     this.isLoading = true;
     const request: ProductRequestDto = this.productForm.value

      this.prodService.addProduct(request).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.toastService.success(response.message);
        this.router.navigate(['/viewproducts']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to add product. Please try again.'
        );
      }
    });
  }

  get productName(): FormControl {
    return this.productForm.get('productName') as FormControl;
  }

  get productType(): FormControl {
    return this.productForm.get('productType') as FormControl;
  }

  get description(): FormControl {
    return this.productForm.get('description') as FormControl;
  }

  navigateToProducts(): void {
    this.router.navigate(['/viewproducts']);
  }



}

