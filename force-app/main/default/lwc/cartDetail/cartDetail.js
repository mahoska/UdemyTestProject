/**
 * @File Name          : cartDetail.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 05.05.2020, 12:53:52
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    04.05.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, wire, track } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import getItems from '@salesforce/apex/BeerController.getItems';
import { deleteRecord } from 'lightning/uiRecordApi';
export default class CartDetail extends NavigationMixin(LightningElement) {

    @track cartid;
    @track Items;
    @track errors;
    @track totalItems;
    @track totalAmount = 0.00;
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.cartid = currentPageReference.state.c__cartId;
        console.log(' Cart Id => ', this.cartid);
    }


    connectedCallback() {
        this.cartItems();
    }

    handleProceed() {

    }

    handleDeleteItem(event) {
        const selectedItemId = event.detail;

        const selectedItem = this.Items.find(
            item => item.Id === selectedItemId
        );

        const indexItem = this.Items.indexOf(selectedItem);
        console.log(indexItem);

        deleteRecord(selectedItemId)
            .then(() => {
                console.log('Item deleted');
                this.Items.splice(indexItem, 1);
                this.totalAmount = this.totalAmount - selectedItem.Total_Amount__c;
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleContinue() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Beer_Explorer' // Cart Detail
            },
            state: {
                c__cartId: this.cartId
            }
        });
    }

    cartItems() {
        getItems({
            cartId: this.cartid
        })
            .then(result => {
                console.log(' Cart Items ', JSON.parse(result));
                this.Items = JSON.parse(result);
                this.totalItems = this.Items.length;
                this.errors = undefined;

                for (let i = 0; i < this.Items.length; i++) {
                    if (this.Items[i]) {
                        this.totalAmount = this.totalAmount + this.Items[i].Total_Amount__c;
                    }
                }
            })
            .catch(error => {
                this.carteItems = undefined;
                this.errors = error;
            });
    }

    handleCoupon() {

    }

}