import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Role } from '../../../../Enums/Role';
import { PaginationResponseDto } from '../../../../DTO/PaginationResponseDto';
import { ProductResponseDto } from '../../../../DTO/ProductResponseDto';
import { Product } from '../../../../services/Product/product';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ActiveStatus } from '../../../../Enums/ActiveStatus';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { Auth } from '../../../../services/Auth/auth';

@Component({
  imports: [ReactiveFormsModule],
  standalone:true,
  selector: 'app-view-products',
  styleUrl: './view-products.css',
  templateUrl: './view-products.html',
})
export class ViewProducts implements OnInit {

  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    sortBy: new FormControl('productName'),
    sortDirection: new FormControl('asc'),
    pageNumber: new FormControl(1),
    pageSize: new FormControl(10)
  });

  role: string = '';
 isAdmin = false;
  lstProducts!: PaginationResponseDto<ProductResponseDto>;

  isLoading = false;
  isUpdatingStatus = false;

  constructor(
    private prodService: Product,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private authService:Auth
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole() ?? '';
    this.isAdmin = this.role === Role.Admin;
    this.loadProducts();
  }

  // Load products with filtering, sorting and pagination
  loadProducts(): void {
    this.isLoading = true;

    const filters = this.filterForm.value;

    this.prodService.listProducts(
      filters.pageNumber ?? 1,
      filters.pageSize ?? 10,
      filters.sortBy ?? 'productName',
      filters.sortDirection ?? 'asc',
      filters.search ?? ''
    ).subscribe({
      next: (response) => {
        if (this.isAdmin) {
          this.lstProducts = response.data;
        } else {
          this.lstProducts = {
            ...response.data,
            records: response.data.records.filter(
              product => product.activeStatus === ActiveStatus.Active
            )
          };
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to load products.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Search products
  searchProducts(): void {
    this.filterForm.patchValue({
      pageNumber: 1
    });

    this.loadProducts();
  }

  // Reset filters
  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      sortBy: 'productName',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 10
    });

    this.loadProducts();
  }

  // Clear search
  clearSearch(): void {
    this.filterForm.patchValue({
      search: '',
      pageNumber: 1
    });

    this.loadProducts();
  }

  // Navigate to previous page
  previousPage(): void {
    if (this.lstProducts && this.lstProducts.currentPage > 1) {
      this.filterForm.patchValue({
        pageNumber: this.lstProducts.currentPage - 1
      });

      this.loadProducts();
    }
  }

  // Navigate to next page
  nextPage(): void {
    if (this.lstProducts && !this.lstProducts.isLastPage) {
      this.filterForm.patchValue({
        pageNumber: this.lstProducts.currentPage + 1
      });

      this.loadProducts();
    }
  }

  // Activate product
  activateProduct(id: number): void {
    if (this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    this.prodService.activateProduct(id).subscribe({
      next: (response) => {
        this.isUpdatingStatus = false;

        this.toastService.info(response.message);
        this.cdr.detectChanges();

        this.loadProducts();
      },
      error: (err: HttpErrorResponse) => {
        this.isUpdatingStatus = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to activate product.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Deactivate product
  deactivateProduct(id: number): void {
    if (this.isUpdatingStatus) return;

    this.isUpdatingStatus = true;

    this.prodService.deactivateProduct(id).subscribe({
      next: (response) => {
        this.isUpdatingStatus = false;

        this.toastService.info(response.message);
        this.cdr.detectChanges();

        this.loadProducts();
      },
      error: (err: HttpErrorResponse) => {
        this.isUpdatingStatus = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastService.error(
          apiError?.message ?? 'Unable to deactivate product.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  // Navigate to edit product
  editProduct(id: number): void {
    this.router.navigate(['/editproduct', id]);
  }

  // Navigate to add product
  navigateToAddProduct(): void {
    this.router.navigate(['/addproduct']);
  }

  // Search form control
  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }
}
