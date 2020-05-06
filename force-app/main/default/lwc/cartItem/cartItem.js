/**
 * @File Name          : cartItem.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 06.05.2020, 16:53:44
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    04.05.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, api } from 'lwc';

export default class CartItem extends LightningElement {
    @api item;

    handleDelete() {
        const deleteEvent = new CustomEvent(
            'delete',
            {
                detail: this.item.Id
            }
        );

        this.dispatchEvent(deleteEvent);
    }
}