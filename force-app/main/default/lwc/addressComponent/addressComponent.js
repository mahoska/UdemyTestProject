/**
 * @File Name          : addressComponent.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 06.05.2020, 16:25:03
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    05.05.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, api } from 'lwc';

export default class AddressComponent extends LightningElement {

    @api address;

    handleSelect() {

        const addressEvent = new CustomEvent(
            'address',
            {
                detail: this.address.Id
            }
        );

        this.dispatchEvent(addressEvent);
    }
}