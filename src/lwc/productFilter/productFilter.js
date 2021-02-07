import { LightningElement, track, api } from 'lwc';
import getProductTypeOptions from '@salesforce/apex/CustomProductManager.getProductTypeOptions';
import getProductFamilyOptions from '@salesforce/apex/CustomProductManager.getProductFamilyOptions';

export default class ProductFilter extends LightningElement {
    @track typeOptions = [];
    @track familyOptions = [];

    @api typeValue;
    @api familyValue;

    connectedCallback() {
        let pickListOptions;
        let inBetweenTypeOptions = [];
        let inBetweenFamilyOptions = [];
        let i = 0;

        getProductTypeOptions()
            .then(result => {
                pickListOptions = [].concat(result);
                for (i = 0; i < pickListOptions.length; i++){
                    inBetweenTypeOptions.push( { label: pickListOptions[i], value: pickListOptions[i] } );
                }//end of for loop
                this.typeOptions = [].concat(inBetweenTypeOptions);
                this.typeOptions.push({ label: "All", value: "" });
            })
            .catch(error => {
                console.log("Instead of type we got an error")
                console.log(error);
            });
        // end of getting type options
        //getting family options
        getProductFamilyOptions()
            .then(result => {
                pickListOptions = [].concat(result);
                for (i = 0; i < pickListOptions.length; i++){
                    inBetweenFamilyOptions.push( { label: pickListOptions[i], value: pickListOptions[i] } );
                }//end of for loop
                this.familyOptions = [].concat(inBetweenFamilyOptions);
                this.familyOptions.push({ label: "All", value: "" });
            })
            .catch(error => {
                console.log("Instead of family we got an error")
                console.log(error);
            });
        //end of getting family options
    }

    handleTypeChange(event) {
        //when you choose another option, do this
        this.typeValue = event.target.value;
        // Create the event with the data.
        const typeChangeEvent = new CustomEvent("typevaluechange", {
            detail: this.typeValue
        });

        // Dispatch the event.
        this.dispatchEvent(typeChangeEvent);
    }

    handleFamilyChange(event) {
        //when you choose another option, do this
        this.familyValue = event.target.value;
        // Create the event with the data.
        const familyChangeEvent = new CustomEvent("familyvaluechange", {
            detail: this.familyValue
        });

        // Dispatch the event.
        this.dispatchEvent(familyChangeEvent);
    }
}