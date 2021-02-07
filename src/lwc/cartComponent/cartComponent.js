import { LightningElement, api, track } from 'lwc';
import getProductsForCart from '@salesforce/apex/CustomProductManager.getProductsForCart';

export default class CartComponent extends LightningElement {
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
        console.log(this.totalCost);
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
            console.log("This is our product: " + product);
            this.productsInTotal.push(product);
        }
        this.recalculateTotalCost();//recalculating totalCost
    }

    connectedCallback(){
        getProductsForCart({ ids: this.productsIdInCart })
            .then(result => {
                this.products = result;
                console.log("Our cart: " + this.products);
                console.log(this.products);
                this.manageProductsInTotal(this.products);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleUpdateAmountEvent(event) {
        console.log("Here is our change: ");
        console.log(event.detail.Id + " " + event.detail.Quantity);
        let positionOfTheProduct = 0;
        let found = false; //this will help us to determine, whether we found the product in cart or not
        console.log("Before the for loop");
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
            console.log("New cost: " + this.productsInTotal[positionOfTheProduct].Cost);
        } else {
            //if we somehow didn't found the product, tell that
            //and also don't change anything else
            console.log("We didn't find the product");
        }
        console.log("At the end");
    }


    handleMakeOrder(event) {
        //when user wants to make an order
        console.log("We need to pay: " + this.totalCost);
    }
}