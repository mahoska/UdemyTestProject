/**
 * @File Name          : beerTile.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 29.04.2020, 17:27:53
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    27.04.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, api } from 'lwc';

export default class BeerTile extends LightningElement {
    @api beerRecord;

    handleAddToCart() {
        const addToCart = new CustomEvent(
            'cart',
            {
                detail: this.beerRecord.Id
            }
        );
        this.dispatchEvent(addToCart);
    }
}