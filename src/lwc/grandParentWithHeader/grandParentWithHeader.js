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

        //when the component is connected, load the picklist values
        //for createProductComponent and productFilter

        //I tried to "centralize" the loading of typeOptions and familyOptions
        //But it wasn't working properly
        //So I had to violate the general rule of not repeating your code
//        let pickListOptions;
//        let inBetweenTypeOptions = [];
//        let inBetweenFamilyOptions = [];
//        let i = 0;
//
//        getProductTypeOptions()
//            .then(result => {
//                pickListOptions = [].concat(result);
//                for (i = 0; i < pickListOptions.length; i++){
//                    inBetweenTypeOptions.push( { label: pickListOptions[i], value: pickListOptions[i] } );
//                }//end of for loop
//                this.typeOptions = [].concat(inBetweenTypeOptions);
//                console.log(this.typeOptions);
//            })
//            .catch(error => {
//                console.log("Instead of type we got an error")
//                console.log(error);
//            });
//        // end of getting type options
//        //getting family options
//        getProductFamilyOptions()
//            .then(result => {
//                pickListOptions = [].concat(result);
//                for (i = 0; i < pickListOptions.length; i++){
//                    inBetweenFamilyOptions.push( { label: pickListOptions[i], value: pickListOptions[i] } );
//                }//end of for loop
//                this.familyOptions = [].concat(inBetweenFamilyOptions);
//                console.log(this.familyOptions);
//            })
//            .catch(error => {
//                console.log("Instead of family we got an error")
//                console.log(error);
//            });
//        //end of getting family options
//        console.log("We have ended connection stuff in grandparent")
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