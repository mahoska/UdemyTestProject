/**
 * @File Name          : beerSearch.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 27.04.2020, 15:37:33
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    27.04.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, track } from 'lwc';

export default class BeerSearch extends LightningElement {
    @track searchValue;

    handleChange(event) {
        const value = event.target.value;
        const searchEvent = new CustomEvent(
            'search',
            {
                default: value
            }
        );

        this.dispatchEvent(searchEvent);
    }

}