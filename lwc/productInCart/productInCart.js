import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductInCart extends NavigationMixin(LightningElement) {
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
}