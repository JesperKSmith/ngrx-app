/* Angular */
import { Injectable } from '@angular/core';

/* NgRx */
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as productActions from './product.actions';

/* Services */
import { ProductService } from '../product.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Product } from '../product';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ProductEffects {

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  @Effect()
  loadProducts$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.Load),
    mergeMap(action => 
      this.productService.getProducts().pipe(
        map((products: Product[]) => (new productActions.LoadSuccess(products))),
        catchError(err => of(new productActions.LoadFail(err)))
    ))
  )

  @Effect()
  updateProduct$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) => 
      this.productService.updateProduct(product).pipe(
        map(updatedProduct => (new productActions.UpdateProductSuccess(updatedProduct))),
        catchError(err => of(new productActions.UpdateProductFail(err)))
      )
    )
  )

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$.pipe(
    ofType(productActions.ProductActionTypes.DeleteProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) => 
      this.productService.deleteProduct(product.id).pipe(
        map(() => new productActions.DeleteProductSuccess(product)),
        catchError(err => of(new productActions.DeleteProductFail(err)))      )
    )
  )
}