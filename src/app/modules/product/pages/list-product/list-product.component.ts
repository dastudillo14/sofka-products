import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductI } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { OptionsEnum } from 'src/app/shared/enums/options.enum';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
})
export class ListProductComponent implements OnInit, OnDestroy {
  displayedProducts: ProductI[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 15, 20];
  searchSubject: Subject<string> = new Subject();
  productOptions = [
    { id: OptionsEnum.EDIT, label: 'Editar' },
    { id: OptionsEnum.DELETE, label: 'Eliminar' },
  ];
  optionSelected = '';
  productToRemove: ProductI | null = null;
  showModalRemove = false;
  loading = false;

  private products: ProductI[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
    this.subscriptions.add(
      this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
        this.searchTerm = term;
        this.updateDisplayedProducts();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getProducts() {
    this.loading = true;
    //! Se agrega time out para poder ver el uso del skeleton
    setTimeout(() => {
      const productsSub = this.productService.get().subscribe(
        (response) => {
          this.products = response.data;
          this.updateDisplayedProducts();
        },
        null,
        () => {
          this.loading = false;
        }
      );
      this.subscriptions.add(productsSub);
    }, 1000);
  }

  updateDisplayedProducts() {
    const filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.displayedProducts = filteredProducts.slice(0, this.pageSize);
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  clearSearch() {
    this.searchTerm = '';
    this.updateDisplayedProducts();
  }

  updatePageSize(size: number) {
    this.pageSize = size;
    this.updateDisplayedProducts();
  }

  productAction(product: ProductI) {
    switch (this.optionSelected) {
      case OptionsEnum.EDIT:
        this.goToEditProduct(product);
        break;
      case OptionsEnum.DELETE:
        this.productToRemove = product;
        this.showModalRemove = true;
        break;
      default:
        break;
    }
  }

  goToAddProduct() {
    this.router.navigateByUrl('/products/new');
  }

  goToEditProduct(product: ProductI) {
    this.router.navigateByUrl(`/products/edit/${product.id}`);
  }

  removeProduct() {
    if (this.productToRemove) {
      const deleteSub = this.productService
        .delete(this.productToRemove.id)
        .subscribe(() => {
          this.getProducts();
        });
      this.subscriptions.add(deleteSub);
    }
  }

  closeModalRemove(ok: boolean) {
    if (ok) {
      this.removeProduct();
    }
    this.showModalRemove = false;
    this.optionSelected = '';
  }
}
