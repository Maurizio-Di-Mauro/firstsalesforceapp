public with sharing class CustomProductManager {
	//this class will create a Product__c record. Its methods will be called by LWC
	//when User with IsManager__c == true fills up the form.
	@AuraEnabled
	public static void createProduct(
			String productName,
			String productType,
			String productFamily,
			Decimal productPrice,
			String productDescription,
			String productImage) {
		System.debug('We got data: ' + productName + productImage + productPrice);
		Product__c newProduct = new Product__c ( //creating new product
				Name = productName,
				Type__c = productType,
				Family__c = productFamily,
				Price__c = productPrice,
				Description__c = productDescription,
				Image__c = productImage);
		try {
			// try to insert the new record into our database
			System.debug('Here we are inserting!');
			insert newProduct; //inserting this new product to the database
		} catch (DmlException e) {
			// catching any exception related to database update
			System.debug('An unexpected error has occurred: ' + e.getMessage());
		}
	}


	//return picklist values for product type
	@AuraEnabled(cacheable=true)
	public static List<String> getProductTypeOptions(){
		List<String> pickListValuesList = new List<String>();//create a list that will contain options

		try {
			Schema.DescribeFieldResult fieldResult = Product__c.Type__c.getDescribe();
			List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
			for( Schema.PicklistEntry pickListVal : ple){
				pickListValuesList.add(pickListVal.getLabel());
			}
			//return pickListValuesList; //return the values
			System.debug('Here we get: ' + pickListValuesList);
			return pickListValuesList; //return the values
		} catch (Exception e) {
			System.debug('An unexpected error has occurred: ' + e.getMessage());
			return pickListValuesList; //this supposedly will be undefined
		}
	}//end of getProductTypeOptions()

	//return picklist values for product family
	@AuraEnabled(cacheable=true)
	public static List<String> getProductFamilyOptions(){
		List<String> pickListValuesList = new List<String>();//create a list that will contain options

		try {
			Schema.DescribeFieldResult fieldResult = Product__c.Family__c.getDescribe();
			List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
			for( Schema.PicklistEntry pickListVal : ple){
				pickListValuesList.add(pickListVal.getLabel());
			}
			System.debug('Here we get families: ' + pickListValuesList);
			return pickListValuesList; //return the values
		} catch (Exception e) {
			System.debug('An unexpected error has occurred: ' + e.getMessage());
			return pickListValuesList; //this supposedly will be undefined
		}
	}//end of getProductFamilyOptions()


	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProducts(String searchKey, String typeValue, String familyValue) {
		//this will return a list of products, based on a search query
		//every product will return:
		//product name, product price, product description, product type, product family and product Id
		String key = '%' + searchKey + '%';
		String type = '%' + typeValue + '%';
		String family = '%' + familyValue + '%';
		System.debug('key: ' + key + '; type: ' + type + '; family: ' + family);
		return [
				SELECT Id, Name, Description__c, Family__c, Type__c, Price__c
				FROM Product__c
				WHERE (Name LIKE :key AND Type__c LIKE :type AND Family__c LIKE :family)
				LIMIT 100
		];
	}


	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProductsForCart(List<ID> ids) {
		//get product records, based on the passed IDs
		List<Product__c> products = new List<Product__c>();//create a list for products
		Product__c product = new Product__c();
		for (ID productId : ids) {
			product = [
				SELECT Id, Name, Description__c, Type__c, Family__c, Price__c
				From Product__c
				WHERE Id = :productId
				LIMIT 1
			];
			products.add(product);
		}//end of for loop
		System.debug(products);
		return products;
	}
}