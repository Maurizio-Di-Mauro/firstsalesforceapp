import { LightningElement, api, track } from 'lwc';
import getProducts from '@salesforce/apex/CustomProductManager.getProducts';

export default class DefaultParent extends LightningElement {
    queryTerm = "";
    @track products;
    @track typeValue = '';
    @track familyValue = '';

    @api chosenProductId = ''; //here is stored a product for the cart

    searchProducts(searchKey, typeValue, familyValue) {
        getProducts({ searchKey: searchKey, typeValue: typeValue, familyValue: familyValue })
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    connectedCallback() {
        //after we connect the component download products
        this.searchProducts('', '', '');//passing empty strings, so we will get all products
    }
    handleKeyUp(evt) {
        let queryTerm = '';
        //seek for the enter
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            queryTerm = evt.target.value;
        }
        //now, show all proper ones
        this.searchProducts(queryTerm, this.typeValue, this.familyValue);
    }


    //when the radio-groups are changed
    handleTypeValueChange(event) {
        this.typeValue = event.detail;
        this.searchProducts(this.queryTerm, this.typeValue, this.familyValue);
    }
    handleFamilyValueChange(event) {
        this.familyValue = event.detail;
        this.searchProducts(this.queryTerm, this.typeValue, this.familyValue);
    }


    //when our user wants to add to the cart
    handleAddToCart(event) {
        this.chosenProductId = event.detail;

        //now create another event to pass it to the grandparent
        const updateCartEvent = new CustomEvent("updatecart", {
            detail: this.chosenProductId
        });

        // Dispatch the event
        this.dispatchEvent(updateCartEvent);
    }
}