/**
 * @File Name          : beerSearch.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 28.04.2020, 12:52:41
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    27.04.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, track } from 'lwc';

export default class BeerSearch extends LightningElement {

    @track searchValue;

    handleChange(event) {
        console.log('IN');
        const value = event.target.value;
        console.log(value);
        const searchEvent = new CustomEvent(
            'search',
            {
                detail: value
            }
        );

        this.dispatchEvent(searchEvent);
    }

}