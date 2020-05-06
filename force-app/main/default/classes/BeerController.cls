/**
 * @File Name          : BeerController.cls
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 05.05.2020, 16:08:06
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    27.04.2020   Anna Makhovskaya     Initial Version
**/
public with sharing class BeerController {
    public BeerController() {

    }

    @AuraEnabled(cacheable=true)
    public  static List<sObject> searchBeer(String searchParam){
        String likeParam = '%'+searchParam+'%';
        String query = '';
        if(searchParam != null){
            query = 'SELECT Id, Name, Alcohol__c, brewery_id__c, brewery_Name__c, Id__c, Price__c, Image__c, Remaining_Quantity__c, Tags__c, Total_Quantity__c FROM Beer__c WHERE Name LIKE :likeParam LIMIT 50 ';
        }else{
            query = 'SELECT Id, Name, Alcohol__c, brewery_id__c, brewery_Name__c, Id__c, Price__c, Image__c, Remaining_Quantity__c, Tags__c, Total_Quantity__c FROM Beer__c  LIMIT 50 ';
        }

        List<sObject> sObjectList = Database.query(query);
        return sObjectList;
        
    }

    @AuraEnabled
    public static Coupon__c couponInfo(String name){

        Coupon__c Coupon = getCouponInformation(name);
        return Coupon;
        
    }

    public static Coupon__c  getCouponInformation(String name){
        Coupon__c couponRec = [SELECT Id, Name, Price__c
                                FROM Coupon__c
                                WHERE Expired__c = false AND (Remaining_Quantity__c > 0 OR Name ='Default') AND Name = :name];

        return couponRec;
    }


    public static String generateCardId(){
        String CharList = 'abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
        Integer position;
        Integer LengthRequired = 30;
        String Res = '';
        
        for(Integer i = 0; i <=LengthRequired; i++ ){
            position = Integer.valueof(String.valueof(Math.roundToLong(CharList.length()*Math.random()))) - 1;
            Res += CharList.substring(position, position+1);
        }

        return Res;
    }



    @AuraEnabled(cacheable=false)
    public static string getCardId(){
        List<Cart__c> cartInfo = [SELECT Id, Name
        FROM Cart__c WHERE User__c = : UserInfo.getUserId() AND Cart_Status__c = 'Open' AND Is_Active__c = true];
        
        if(cartInfo != null && cartInfo.size() >0){
            List<Cart_item__c> cartItems = new List<Cart_Item__c>();
            cartItems = [SELECT Id, Name, Beer__c, Cart__c, Item_Quantity__c, Item_Amount__c
            FROM Cart_Item__c
            WHERE Cart__c =: cartInfo.get(0).Id];

            String cartItem = '';

            Decimal itemQuantity = 0;
            for(Cart_Item__c item : cartItems){
                itemQuantity = itemQuantity + item.Item_Quantity__c;
            }

            CartWrapper wrapper = new CartWrapper();
            wrapper.CartId = cartInfo.get(0).Id;
            wrapper.items  = cartItems;
            wrapper.Count = itemQuantity;

            return JSON.serialize(wrapper);

        }else{
            Cart__c defaultCart = new Cart__c();
            Coupon__c  coupon =  getCouponInformation('Default');
            
            defaultCart.Cart_Id__c = String.valueOf(Math.random());//generateCardId();
            defaultCart.Cart_Status__c = 'Open';
            defaultCart.Is_Active__c = true;
            defaultCart.Coupon__c = coupon.Id;
            defaultCart.User__c = UserInfo.getUserId();

            insert defaultCart;

            CartWrapper wrapper = new CartWrapper();
            wrapper.CartId = defaultCart.Id;
            wrapper.items  = null;
            wrapper.Count = 0;

            return JSON.serialize(wrapper);

        }
    }

    

    @AuraEnabled
    public static string createCartItem(String CartId, String BeerId, Decimal Amount){
        Cart_Item__c item = new Cart_Item__c();
        Map<Id, Cart_Item__c> cartItemsMap = getCartItems(CartId);
        if(cartItemsMap.containsKey(BeerId)){

            item = cartItemsMap.get(BeerId);
            item.Item_Amount__c = item.Item_Amount__c + Amount;
            item.Item_Quantity__c = item.Item_Quantity__c + 1;
            update  item;

        }else{
        
            item.Beer__c = BeerId;
            item.Cart__c = CartId;
            item.Item_Quantity__c = 1;
            item.Item_Amount__c = Amount;
            
            insert item;
        }
        
        return item.Id;
    }

public static Map<Id, Cart_Item__c> getCartItems(String cartId){
    
    Map<Id, Cart_Item__c> cartItemsMap = new Map<Id, Cart_Item__c>();
    for (Cart_Item__c cart :[SELECT Id, Name, Beer__c, Cart__c, Item_Quantity__c, Item_Amount__c
                        FROM Cart_Item__c
                        WHERE Cart__c =: cartId]){
        
        cartItemsMap.put(cart.Beer__c, cart);
    }

    return cartItemsMap;
}
    

@AuraEnabled
public static string getItems(String cartId){
    List<Cart_Item__c> items = [Select Id, Name, Beer__c, Cart__c, 
                            Item_Quantity__c, Item_Amount__c,
                            Total_Amount__c,
                            Beer__r.Name
                            FROM Cart_Item__c
                            Where Cart__c =: cartId];
    return JSON.serialize(items);
}

@AuraEnabled
public static Address_Book__c saveAddress(String addressDetails){
    // {City__c : '', State__c : ''}
    Address_Book__c addressInfo = (Address_Book__c)JSON.deserialize(addressDetails,
                                                    Address_Book__c.class);
    // Address_Book__c addrs = new Address_Book__c()
    // addrs.City__c = '';
    // addrs.State__c = '';
    // 1 - String whihch contains information in form of Object
    // 2 - Actual Object/Apex Class
    // 3 - (Account)JSON.deserialize(addressDetails,Account.class);
    addressInfo.User__c = UserInfo.getUserId();
    insert addressInfo;
    return addressInfo;
}

@AuraEnabled
    public static List<Address_Book__c> addressDetails(){
        List<Address_Book__c> addressList = [SELECT Id, City__c, Country__c, 
                                                    Postal_Code__c, State__c, 
                                                    Street__c, User__c 
                                                    FROM Address_Book__c
                                                Where User__c != null 
                                                AND User__c =: UserInfo.getUserId()];
        return addressList;
    }

    public class CartWrapper {
        @AuraEnabled
        public String CartId {get;set;}
        @AuraEnabled
        public Decimal Count {get;set;}
        @AuraEnabled
        public List<Cart_Item__c> items {get;set;}
    }

}
