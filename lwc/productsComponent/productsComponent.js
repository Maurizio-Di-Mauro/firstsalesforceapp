import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class productsComponent extends NavigationMixin(LightningElement) {
    @api name;
    @api description;
    @api productId;

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


    handleAddClick(event) {
        //this will add the product to the cart
        const addClickEvent = new CustomEvent("addclick", {
            detail: this.productId
        });

        // Dispatch the event.
        this.dispatchEvent(addClickEvent);
    }
}