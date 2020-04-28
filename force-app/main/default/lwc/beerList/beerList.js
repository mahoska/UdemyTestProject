/**
 * @File Name          : beerList.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 28.04.2020, 12:44:46
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    28.04.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, wire, track } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
export default class BeerList extends LightningElement {

    @track beerRecords;
    @track errors;

    @wire(searchBeer)
    wireRecords({ error, data }) {
        console.log('Data', data);
        this.beerRecords = data;
        this.errors = error;
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
}