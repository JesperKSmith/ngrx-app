import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as productReducer from '../state/product.reducer';
import * as productActions from '../state/product.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  errorMessage$: Observable<string>;
  componentActive = true;
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;

  constructor(
    private store: Store<productReducer.State>
  ) {}
  
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.setupSubscriptions();
    this.errorMessage$ = this.store.pipe(select(productReducer.getError));
    this.products$ = this.store.pipe(select(productReducer.getProducts));
    this.store.dispatch(new productActions.Load());
  }

  setupSubscriptions() {
    this.store.pipe(
      select(productReducer.getCurrentProduct),
      takeWhile(() => this.componentActive)
    ).subscribe(currentProduct => this.selectedProduct = currentProduct);

    this.store.pipe(
      select(productReducer.getShowProductCode),
      takeWhile(() => this.componentActive)
    ).subscribe(showProductCode => this.displayCode = showProductCode);
  }

  

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));    
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
  }

}
