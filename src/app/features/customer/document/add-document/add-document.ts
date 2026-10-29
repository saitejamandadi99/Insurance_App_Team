import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorResponseDto } from '../../../../DTO/ErrorResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { ClaimStatus } from '../../../../Enums/ClaimStatus';
import { Claim } from '../../../../services/Claim/claim';
import { ClaimDocument } from '../../../../services/ClaimDocument/claim-document';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/Toast/toast-service';
import { ClaimResponseDto } from '../../../../DTO/ClaimResponseDto';

@Component({
  imports: [ReactiveFormsModule],
  standalone:true,
  selector: 'app-add-document',
  styleUrl: './add-document.css',
  templateUrl: './add-document.html',
})
export class AddDocument implements OnInit {
  documentForm: FormGroup = new FormGroup({
    claimId: new FormControl('', [Validators.required]),
    documentName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    documentType: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),
  });

  claims: ClaimResponseDto[] = [];
  selectedFiles: File[] = [];
  filesTouched = false;
  isLoading = false;

  constructor(
    private claimServices: Claim,
    private documentServices: ClaimDocument,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastServices: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.claimServices.getMyClaims().subscribe({
      next: (response) => {
        this.claims = response.data.filter(
          (claim) =>
            claim.claimStatus !== ClaimStatus.Approved &&
            claim.claimStatus !== ClaimStatus.Rejected
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to load your claims.'
        );

        this.cdr.detectChanges();
      },
    });
  }

  onFilesSelected(event: Event): void {
    this.filesTouched = true;

    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.selectedFiles = [
        ...this.selectedFiles,
        ...Array.from(input.files)
      ];
    }

    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  addDocument(): void {
    this.filesTouched = true;

    if (
      this.documentForm.invalid ||
      this.selectedFiles.length === 0 ||
      this.isLoading
    ) {
      this.documentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.documentForm.value;
    const formData = new FormData();

    formData.append('claimId', formValue.claimId);
    formData.append('documentName', formValue.documentName);
    formData.append('documentType', formValue.documentType);

    this.selectedFiles.forEach((file) => {
      formData.append('Files', file, file.name);
    });

    this.documentServices.addClaimDocument(formData).subscribe({
      next: (response) => {
        this.toastServices.success(response.message);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/mydocuments']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        const apiError = err.error as ErrorResponseDto;

        this.toastServices.error(
          apiError?.message ?? 'Unable to upload documents.'
        );

        this.cdr.detectChanges();
      },
    });
  }

  get claimId(): FormControl {
    return this.documentForm.get('claimId') as FormControl;
  }

  get documentName(): FormControl {
    return this.documentForm.get('documentName') as FormControl;
  }

  get documentType(): FormControl {
    return this.documentForm.get('documentType') as FormControl;
  }

  navigateToMyDocuments(): void {
    this.router.navigate(['/mydocuments']);
  }
}
