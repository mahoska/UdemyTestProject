/**
 * @File Name          : orderDetail.js
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 06.05.2020, 16:54:24
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    06.05.2020   Anna Makhovskaya     Initial Version
**/
import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import orderDetails from '@salesforce/apex/BeerController.orderDetails'

export default class OrderDetail extends NavigationMixin(LightningElement) {
    @track orderId;
    @track orderInfo;
    @track orderItems;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.orderId = currentPageReference.state.c__orderId;
        console.log(' c__orderId => ', this.orderId);
    }


    connectedCallback() {
        this.getOrderDetails();
    }


    getOrderDetails() {
        orderDetails({
            orderId: this.orderId
        })
            .then(result => {
                this.orderInfo = result.order;
                this.orderItems = result.Orderitems;
            })
            .catch(error => {
                console.error(error);
            })
    }
}