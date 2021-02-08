import { LightningElement, api, track } from 'lwc';
import getProductsForCart from '@salesforce/apex/CustomProductManager.getProductsForCart';
import createOrder from '@salesforce/apex/CustomOrderManager.createOrder';

export default class CartComponent extends LightningElement {
    @api userName = ''; //here we will store buyer's (user's) name
    @api productsIdInCart = []; //these are ids from defaultParent
    @api products; //here are stored our products
    @api productsInTotal = []; //here stored products with their prices and quantities
    @track totalCost = 0; //total cost the user has to pay

    recalculateTotalCost() {
        //this function will recalculate this.totalCost
        let arrayLength = this.productsInTotal.length;
        if (arrayLength > 0) {
            //if the length is 0, then do nothing
            this.totalCost = 0;
            for (let i = 0; i < arrayLength; i++) {
                this.totalCost += this.productsInTotal[i].Cost;
            }
        }
    }

    manageProductsInTotal(products){
        for (let i = 0; i < products.length; i++) {
            //here we will fill up productsInTotal
            let product = {
                Id: products[i].Id,
                Name: products[i].Name,
                Price: products[i].Price__c,
                Quantity: 1,
                Cost: products[i].Price__c //Quantity * Price, where Quantity = 1
            }
            this.productsInTotal.push(product);
        }
        this.recalculateTotalCost();//recalculating totalCost
    }

    connectedCallback(){
        getProductsForCart({ ids: this.productsIdInCart })
            .then(result => {
                this.products = result;
                this.manageProductsInTotal(this.products);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleUpdateAmountEvent(event) {
        let positionOfTheProduct = 0;
        //this will help us to determine, whether we found the product in cart or not
        let found = false;

        for (let i = 0; i < this.productsInTotal.length; i++) {
            if (this.productsInTotal[i].Id == event.detail.Id) {
                //when we find the product, break the loop with its position
                positionOfTheProduct = i;
                found = true;
            }
        }
        if (found) {
            //after we found the position, recalculate stuff
            this.productsInTotal[positionOfTheProduct].Quantity = event.detail.Quantity;
            this.productsInTotal[positionOfTheProduct].Cost = this.productsInTotal[positionOfTheProduct].Price * event.detail.Quantity;
            this.recalculateTotalCost(); //recalculating totalCost
        } else {
            //if we somehow didn't found the product, tell that
            //and also don't change anything else
            console.log("We didn't find the product");
        }
    }


    handleMakeOrder(event) {
        //when user wants to make an order
        //this should have name "handleCheckout" instead

        //here we will store OrderItem__c objects
        let orderItems = [];
        let orderItem;

        //in this for loop we will create an array of OrderItem__c objects
        for (let i = 0; i < this.productsInTotal.length; i++) {
            //first, create an object
            orderItem = {
                Name: this.productsInTotal[i].Name,
                OrderId__c: '', //we keep it empty for now
                Price__c: this.productsInTotal[i].Price,
                ProductId__c: this.productsInTotal[i].Id,
                Quantity__c: this.productsInTotal[i].Quantity
            }
            orderItems.push(orderItem);
        }
        //now we are ready to deploy orderItems into apex
        createOrder({
            orderItems: orderItems,
            userName: this.userName,
            accountId: null,
            accountName: null
        })

        // tell the user, that order was inserted
        alert("The order is inserted!");
        //clear the cart by clearing all used variables
        this.products = [];
        this.productsInTotal = [];
        this.productsIdInCart = [];
        this.totalCost = 0;

        // now create an event to tell the grandparent to clear its variables
        const checkoutCartEvent = new CustomEvent("checkoutcart");
        // Dispatch the event
        this.dispatchEvent(checkoutCartEvent);
    }
}