trigger CalculateOrderCostTrigger on Order__c (before update) {
	// make this trigger work with multiple Order__c objects
	for (Order__c order : Trigger.New) {
		// get the order's OrderItem__c objects
		List<OrderItem__c> orderItems = [
				SELECT Id, Price__c, Quantity__c
				FROM OrderItem__c
				WHERE OrderId__c = :order.Id
		];

		// Here will be value for TotalProductCount__c
		// I use Decimal instead of Integer,
		// cause (don't know why) Quantity__c is Decimal as well
		Decimal totalCount = 0;
		// Here we will store total cost for TotalPrice__c
		Decimal totalCost = 0;
		for (OrderItem__c orderItem : orderItems) {
			//calculate the total cost
			totalCount += orderItem.Quantity__c;
			totalCost += orderItem.Price__c * orderItem.Quantity__c;
		}
		// assign these new values for the order to be updated
		order.TotalPrice__c = totalCost;
		order.TotalProductCount__c = totalCount;
		System.debug('Here is our order: ');
		System.debug(order);
	}

}