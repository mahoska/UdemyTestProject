/**
 * @File Name          : BeerController.cls
 * @Description        : 
 * @Author             : Anna Makhovskaya
 * @Group              : 
 * @Last Modified By   : Anna Makhovskaya
 * @Last Modified On   : 27.04.2020, 17:58:57
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
}
