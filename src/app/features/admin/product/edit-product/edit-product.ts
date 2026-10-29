import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../../services/Product/product';
import { ProductType } from '../../../../Enums/ProductType';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { ProductRequestDto } from '../../../../DTO/ProductRequestDto';

@Component({
  imports: [ReactiveFormsModule],
  standalone:true,
  selector: 'app-edit-product',
  styleUrl: './edit-product.css',
  templateUrl: './edit-product.html',
})
export class EditProduct implements OnInit {
  productForm: FormGroup = new FormGroup({
    productName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    productType: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)
    ])
  });

  ProductType = ProductType;
  productTypes = Object.values(ProductType);

  isLoading = false;
  id!: number;

  constructor(
    private prodService: Product,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    const productId = Number(idParam);

    if (!idParam || !Number.isInteger(productId) || productId <= 0) {
      this.toastService.error('Invalid product ID.');
      this.router.navigate(['/viewproducts']);
      return;
    }

    this.id = productId;
    this.isLoading = true;

    this.prodService.getProductById(this.id).subscribe({
      next: (response) => {
        if (!response.data) {
          this.isLoading = false;
          this.toastService.error('Product not found.');
          this.router.navigate(['/viewproducts']);
          this.cdr.detectChanges();
          return;
        }

        this.productForm.patchValue({
          productName: response.data.productName,
          productType: response.data.productType,
          description: response.data.description
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load product details.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  editProduct(): void {
    if (this.productForm.invalid || this.isLoading) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request: ProductRequestDto = this.productForm.value;

    this.prodService.updateProduct(this.id, request).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.toastService.success(response.message);
        this.cdr.detectChanges();

        this.router.navigate(['/viewproducts']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to update product. Please try again.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/viewproducts']);
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
}
