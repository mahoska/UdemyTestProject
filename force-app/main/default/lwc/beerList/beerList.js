/**
 * @File Name          : beerList.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 04.05.2020, 15:29:13
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    28.04.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, wire, track } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
import getCardId from '@salesforce/apex/BeerController.getCardId';
import cartIco from '@salesforce/resourceUrl/Cart';
import createCarItems from '@salesforce/apex/BeerController.createCartItem';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class BeerList extends NavigationMixin(LightningElement) {

    @track beerRecords;
    @track errors;
    @track cart = cartIco;
    @track cartId;
    @track itemsInCart = 0;

    connectedCallback() {
        this.defaultCartId();
    }

    defaultCartId() {
        getCardId()
            .then(data => {
                const wrapper = JSON.parse(data);
                if (wrapper) {
                    this.itemsInCart = wrapper.Count;
                    this.cartId = wrapper.CartId;
                }
            })
            .catch(error => {
                this.cartId = undefined;
                console.log(error);
            })
    }

    @wire(searchBeer)
    wireRecords({ error, data }) {
        if (data) {
            this.beerRecords = data;
            this.errors = undefined;
        }
        if (error) {
            this.beerRecords = undefined;
            this.errors = error;
        }
    }

    handleEvent(event) {
        const eventVal = event.detail;
        console.log('Search Param', eventVal);

        searchBeer({
            searchParam: eventVal
        }).then(result => {
            console.log('Beer Records', result);
            this.beerRecords = result;
            this.errors = undefined;
        }).catch(error => {
            console.log('Errors', error);
            this.beerRecords = undefined;
            this.errors = error;
        })
    }


    addToCart(event) {
        const selectBeerId = event.detail;
        console.log('selectBeerId', selectBeerId);

        const selectBeerRecord = this.beerRecords.find(
            record => record.Id === selectBeerId
        );
        console.log('selectBeerRecord', selectBeerRecord);
        /*
        for(Beer__c beer : beerRecords){
            if(beer.Id == selectedBeerId){
                return beer;
            }
        } */

        createCarItems({
            CartId: this.cartId,
            BeerId: selectBeerId,
            Amount: selectBeerRecord.Price__c
        })
            .then(data => {
                console.log('Cart Item Id : ', data);
                this.itemsInCart = this.itemsInCart + 1;
                const toast = new ShowToastEvent({
                    'title': 'Success!!!',
                    "message": selectBeerRecord.Name + ' added into Cart!',
                    "variant": "success"
                });

                this.dispatchEvent(toast);
            })
            .catch(error => {
                console.log(error);
                const toast = new ShowToastEvent({
                    'title': 'Error!!!',
                    "message": JSON.stringify(error),
                    "variant": "error"
                });

                this.dispatchEvent(toast);
            })
    }


    navigationToCartDetail() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Cart_Detail'
            },
            state: {
                c__cartId: this.cartId
            }
        });
    }
}