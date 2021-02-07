import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductInCart extends NavigationMixin(LightningElement) {
    @api name;
    @api description;
    @api productId;
    @api productPrice;
    @api amount = 1;

    navigateToProductPage() {
        //this will navigate to a product's page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productId,
                objectApiName: 'Product__c',
                actionName: 'view'
            }
        });
    }

    handleAmountChange(event) {
        //when user change quantity of a product
        if (event.detail.value < 1) {
            this.amount = 1;
        } else {
            this.amount = parseInt(event.detail.value, 10);
        }

        const updateAmountEvent = new CustomEvent("updateamount", {
            detail: {Id: this.productId, Quantity: this.amount}
        });

        // Dispatch the event
        this.dispatchEvent(updateAmountEvent);
    }
}