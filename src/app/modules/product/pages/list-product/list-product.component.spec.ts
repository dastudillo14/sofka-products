import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductComponent } from './list-product.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductI } from '../../interfaces/product.interface';
import { OptionsEnum } from 'src/app/shared/enums/options.enum';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProductComponent ],
      imports: [HttpClientModule , FormsModule , SharedModule ],
      providers: [
        { provide: ProductService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchTerm should empty', () => {
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    component.clearSearch();        
    expect(component.searchTerm).toEqual('');
  });

 it('showModalRemove is true', () => {
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    const product:ProductI = {
      id: '1', date_release: new Date('2020-01-01'), date_revision: new Date('2021-01-01'),
      name: 'Test',
      description: 'Test',
      logo: 'Test.jpg'
    }
    component.optionSelected = OptionsEnum.DELETE;
    component.productAction(product);
    expect(component.productToRemove).toEqual(product);
    expect(component.showModalRemove).toBeTrue();
    expect(component.searchTerm).toEqual('');
  });

  it('option selected is empty', () => {
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;    
    component.optionSelected = OptionsEnum.DELETE;
    component.closeModalRemove(false);
    expect(component.optionSelected).toEqual('');
  });


});
