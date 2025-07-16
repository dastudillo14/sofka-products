import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductI } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css'],
})
export class FormProductComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  productToEdit: ProductI | null = null;
  showModalAlert = false;
  modalText = '';
  loading = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) {}
  ngOnInit() {
    this.subscriptions.add(
      this.activatedRouter.params?.subscribe((params) => {
        if (params && params['id']) {
          this.getProductByUrl(params['id']);
        } else {
          this.buildProductForm();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildProductForm(product?: ProductI) {
    this.productForm = this.fb.group({
      id: [
        product?.id,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        product?.name,
        [
          Validators.required,
          //En el pdf decia 5 sin embargo el api pide 6
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      description: [
        product?.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [product?.logo, [Validators.required]],
      date_release: [product?.date_release, Validators.required],
      date_revision: [product?.date_revision, Validators.required],
    });

    if (product) {
      this.productForm.controls['id'].disable();
    }
  }

  private getProductByUrl(id: string) {
    this.productService.getById(id).subscribe((r) => {
      this.productToEdit = r;
      this.buildProductForm(this.productToEdit);
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const { date_release, date_revision } = this.productForm.value;
    if (!this.validateCurrentDate(date_release)) {
      this.showModalAlert = true;
      this.modalText = 'Fecha de liberación debe ser igual a la fecha actual.';
      return;
    }

    if (!this.revisionIsGte(date_release, date_revision)) {
      this.showModalAlert = true;
      this.modalText =
        'Fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.';
      return;
    }

    if (this.productToEdit) {
      this.update();
    } else {
      this.create();
    }
  }

  getErrosMsg(controlName: string) {
    const errors = this.productForm.controls[controlName].errors;
    if (errors) {
      if (
        errors['required'] &&
        this.productForm.controls[controlName].touched
      ) {
        return 'Campo obligatorio';
      }

      if (errors['minlength']) {
        return `Se requiere de al menos ${errors['minlength']['requiredLength']} caracteres.`;
      }

      if (errors['maxlength']) {
        return `Campo debe contener hasta ${errors['maxlength']['requiredLength']} caracteres.`;
      }
    }
    return '';
  }

  create() {
    const formValue = this.productForm.value;

    this.subscriptions.add(
      this.productService.validateById(formValue.id).subscribe((r) => {
        if (!r) {
          this.productService.create(formValue).subscribe(
            () => {
              this.goBack();
            },
            null,
            () => {
              this.loading = false;
            }
          );
        } else {
          this.modalText = `Ya existe un producto con el id ${formValue.id}`;
          this.showModalAlert = true;
        }
      })
    );
  }

  update() {
    const formValue = {
      ...this.productForm.value,
      id: this.productToEdit?.id,
    };
    this.loading = true;
    this.subscriptions.add(
      this.productService.update(formValue).subscribe(
        () => {
          this.goBack();
        },
        null,
        () => {
          this.loading = false;
        }
      )
    );
  }

  goBack() {
    this.router.navigateByUrl('/products');
  }

  validateCurrentDate(dateRelease: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return dateRelease === `${year}-${month}-${day}`;
  }

  revisionIsGte(dateRelease: string, dateRevision: string): boolean {
    const [year1, month1, day1] = dateRelease.split('-').map(Number);
    const [year2, month2, day2] = dateRevision.split('-').map(Number);

    return year2 === year1 + 1 && month2 === month1 && day2 === day1;
  }

  close(ok: boolean) {
    this.showModalAlert = false;
  }
}
