import { LightningElement, track } from 'lwc';
import createProduct from '@salesforce/apex/CustomProductManager.createProduct';
import getProductTypeOptions from '@salesforce/apex/CustomProductManager.getProductTypeOptions';
import getProductFamilyOptions from '@salesforce/apex/CustomProductManager.getProductFamilyOptions';

export default class createProductComponent extends LightningElement {
    @track error;
    @track testPickList;
    @track typeOptions = [];
    @track familyOptions = [];

    handleCreateProduct() {
        //after you hit the button "Create" you do this

        var values = [];//here will be stored the values
        //clear the inputs
        this.template.querySelectorAll('lightning-input').forEach(each => {
            values.push(each.value); //before cleaning inputs, store their values
            each.value = '';
        });
        this.template.querySelectorAll('lightning-combobox').forEach(each => {
            values.push(each.value); //before cleaning inputs, store their values
            each.value = '';
        });
        //before cleaning, store description
        values.push(this.template.querySelector('lightning-textarea').value);
        this.template.querySelector('lightning-textarea').value = '';//clears textarea

        //for debugging purposes show the values in my log
        console.log("Here are the values:")
        console.log(values);

        createProduct({ productName: values[0], //name,
                        productType: values[3], //type,
                        productFamily: values[4], //family,
                        productPrice: values[1], //price,
                        productDescription: values[5], //description,
                        productImage: values[2] //image_url
                        });
    }//end of the button function


    connectedCallback() {
        //after the component is connected to the page, load the options
        let pickListOptions;
        var inBetweenTypeOptions = [];
        var inBetweenFamilyOptions = [];
        let i = 0;


        //getting type options
        //Don't forget that calling apex method makes it async connection.
        getProductTypeOptions()
            .then(result => {
                pickListOptions = [].concat(result);
                for (i = 0; i < pickListOptions.length; i++){
                    inBetweenTypeOptions.push( { label: pickListOptions[i], value: pickListOptions[i] } );
                }//end of for loop
                this.typeOptions = [].concat(inBetweenTypeOptions);
            })
            .catch(error => {
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
            })
            .catch(error => {
                console.log(error);
            });
        //end of getting family options
    }
}