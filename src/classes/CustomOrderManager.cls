public with sharing class CustomOrderManager {
	//this class works with Order__c and OrderItem__c objects

	@AuraEnabled
	public static void createOrder(List<OrderItem__c> orderItems, String userName, ID accountId, String accountName) {
		//this will create an Order__c object and insert it into the database

		if (accountId == null) {
			//we will hardcode for now an AccountId and AccountName
			accountId = '00109000008OZwTAAW';
			accountName = 'Burlington Textiles Corp of America';
		}

		//now we will create an Order__c object
		Order__c newOrder = new Order__c(
				Name = userName + ' buys from ' + accountName,
				AccountId__c = accountId
		);

		//upload to the database
		try {
			insert newOrder;
		} catch (DmlException e) {
			// catching any exception related to database update
			System.debug('An unexpected error has occurred: ' + e.getMessage());
			// because we are having an exception, we have to stop this function
			return;
		}

		//after we have uploaded the new order, we need to "populate" it with its order items
		for (OrderItem__c newOrderItem : orderItems) {
			if (newOrderItem.Quantity__c < 1) {
				//just in case something went wrong on front-end
				newOrderItem.Quantity__c = 1;
			}
			//assign Order__c.Id to the order's OrderItem__c
			newOrderItem.OrderId__c = newOrder.Id;
			try {
				insert newOrderItem;
			} catch (DmlException e) {
				System.debug('An unexpected error has occurred: ' + e.getMessage());
			}
		}
		//just to see the order
		System.debug(newOrder);
	}
}