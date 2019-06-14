/* NgRx */
import { createFeatureSelector, createSelector } from "@ngrx/store";

/* Product */
import { Product } from "../product";
import { ProductActions, ProductActionTypes } from "./product.actions";

/* Root */
import * as fromRoot from '../../state/app.state';

/* Interfaces */
export interface State extends fromRoot.State {
  products: ProductState;
}
export interface ProductState {
  showProductCode: boolean;
  currentProductId: number | null;
  products: Product[];
  error: string;
}
/* Helper Constants */
const initialState: ProductState = {
  showProductCode: true,
  currentProductId: null,
  products: [],
  error: ''
}
const blankProduct: Product = {
  id: 0,
  productName: '',
  productCode: 'New',
  description: '',
  starRating: 0
}
const getProductFeatureState = createFeatureSelector<ProductState>('products');

/* Exported constants */
export const getShowProductCode = createSelector(
  getProductFeatureState,
  state => state.showProductCode
)
export const getCurrentProductId = createSelector(
  getProductFeatureState,
  state => state.currentProductId
)
export const getCurrentProduct = createSelector(
  getProductFeatureState,
  getCurrentProductId,
  (state, currentProductId) =>  {    
    if (currentProductId === 0) {
      return blankProduct;
    } else {
      return currentProductId ? state.products.find(product => product.id === currentProductId) : null;
    }
  }
)
export const getProducts = createSelector(
  getProductFeatureState,
  state => state.products
)
export const getError = createSelector(
  getProductFeatureState,
  state => state.error
)

/* Reducer function */
export function reducer(state = initialState, action: ProductActions): ProductState {
  switch (action.type) {

    case ProductActionTypes.ToggleProductCode:
      return {...state, showProductCode: action.payload };
    
    case ProductActionTypes.SetCurrentProduct:
      return {...state, currentProductId: action.payload.id };

    case ProductActionTypes.ClearCurrentProduct:
      return {...state, currentProductId: null }

    case ProductActionTypes.InitializeCurrentProduct:
      return {...state, currentProductId: 0 };

    case ProductActionTypes.LoadSuccess:
        return {...state, products: action.payload, error: '' };

    case ProductActionTypes.LoadFail:
      return {...state, products: [], error: action.payload };

    default:
      return state;
  }
}

