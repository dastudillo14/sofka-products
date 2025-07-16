import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductComponent } from './form-product.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductI } from '../../interfaces/product.interface';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormProductComponent],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: ProductService },
        {
          provide: ActivatedRoute, useValue: {
            params: of(null) //chg by {id:'1234'}
          },
        }
      ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formControl name is invalid', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const formControl = component.productForm?.controls['name'];
    formControl.setValue('test');
    expect(formControl.invalid).toBeTrue();

  });

  it('date_release should not current date', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const currentDate = '2020-01-01'; //chg another date
    const formControl = component.productForm?.controls['date_release'];
    formControl.setValue(currentDate);
    expect(component.validateCurrentDate(formControl.value)).toBeFalse();
  });


  it('should return a non-empty string', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const formControl = component.productForm?.controls['description'];
    formControl.setValue(' ');
    const errorMsg = component.getErrosMsg('description');
    expect(typeof errorMsg).toBe('string');

    expect(errorMsg).toBeTruthy();
  });

  it('date_revision should be greater than exactly one year', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const releaseDate = '2020-01-01';
    const revisionDate = '2021-01-01';
    
    expect(component.revisionIsGte(releaseDate, revisionDate)).toBeTrue();
  });

  it('date_revision should be greater than exactly one year', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const formControl = component.productForm?.controls['name'];
    formControl.markAsTouched();
    const errorMsg = component.getErrosMsg('name');    
    expect(errorMsg).toEqual('Campo obligatorio');
  });



  it('formControl id should be disable', () => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const product:ProductI = {
      id: '1', date_release: new Date('2020-01-01'), date_revision: new Date('2021-01-01'),
      name: 'Test',
      description: 'Test',
      logo: 'Test.jpg'
    }
    component.buildProductForm(product);

    const formControlId = component.productForm?.controls['id'];

    expect(formControlId.disabled).toBeTrue();
  });

});
