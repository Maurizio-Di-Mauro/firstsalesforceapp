import { LightningElement, api, track } from 'lwc';
import getProductsForCart from '@salesforce/apex/CustomProductManager.getProductsForCart';

export default class CartComponent extends LightningElement {
    @api productsIdInCart = [];
    @track products; //here are stored our products

    connectedCallback(){
        getProductsForCart({ ids: this.productsIdInCart })
            .then(result => {
                this.products = result;
                console.log("Our cart: " + this.products);
                console.log(this.products);
            })
            .catch(error => {
                console.log(error);
            });
    }
}