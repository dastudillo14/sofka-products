import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseI } from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { ProductI } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
  
})
export class ProductService {
  
  constructor(private httpClient: HttpClient) {}

  get() {
    return this.httpClient.get<ResponseI<ProductI[]>>(
      `${environment.API.url}/bp/products`
    );
  }
  getById(id: string) {
    return this.httpClient.get<ProductI>(
      `${environment.API.url}/bp/products/${id}`
    );
  }

  validateById(id: string) {
    return this.httpClient.get<ResponseI<ProductI[]>>(
      `${environment.API.url}/bp/products/verification/${id}`
    );
  }

  create(product: ProductI) {
    return this.httpClient.post<ResponseI<ProductI>>(
      `${environment.API.url}/bp/products`,
      product
    );
  }

  update(product: ProductI) {
    return this.httpClient.put<ResponseI<ProductI>>(
      `${environment.API.url}/bp/products/${product.id}`,
      product
    );
  }

  delete(id: string) {
    return this.httpClient.delete<ResponseI<{ message: string }>>(
      `${environment.API.url}/bp/products/${id}`
    );
  }
}
