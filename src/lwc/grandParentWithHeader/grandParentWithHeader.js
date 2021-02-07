import { LightningElement, api, track } from 'lwc';
import getSingleUser from '@salesforce/apex/UserController.getSingleUser';
import Id from '@salesforce/user/Id'; //getting an id of current user

import getProductTypeOptions from '@salesforce/apex/CustomProductManager.getProductTypeOptions';
import getProductFamilyOptions from '@salesforce/apex/CustomProductManager.getProductFamilyOptions';

export default class GrandParentWithHeader extends LightningElement {
    @track error;
    @track user; //this variable will contain current user
    @track isHomePage = true; //this var checks whether we are on the starting component
    @track inCreateMode = false; //this bool checks whether we are in creation of product mode
    @track inCartMode = false; //this bool checks whether we are in cart mode

    @track typeOptions = []; //this variable holds picklist values
    @track familyOptions = []; //this one as well

    @api productsInCart = []; //this one stores products' ids for cart

    userId = Id;
    connectedCallback() {
        //when the component is connected, load the user
        getSingleUser({ userId: Id })
            .then(result => {
                this.user = result;
            })
            .catch(error => {
                this.error = error;
            });
        //end of loading the user
    }

    moveToCreateProduct(event) {
        //after you hit the button "Create Product" connect another LWC
        this.inCreateMode = true;
        this.isHomePage = false;
        this.inCartMode = false;
    }
    backFromCreateProduct(event) {
        //after you hit the button "Go back" return the previous LWC
        this.inCreateMode = false;
        this.isHomePage = true; //return to the homepage
    }

    goToCartMode(event) {
        //when you hit the button cart
        this.inCartMode = true;
        this.isHomePage = false;
        this.inCreateMode = false;
    }
    backFromCartMode(event) {
        this.inCartMode = false;
        this.isHomePage = true;
    }

    //when the cart is updated
    handleUpdateCart(event) {
        this.productsInCart.push(event.detail);
    }
}