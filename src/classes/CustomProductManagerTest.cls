@IsTest
private class CustomProductManagerTest {
	@IsTest static void createProductTest(){
		//No idea how to test this one, to be honest

	}

	@IsTest static void getProductTypeOptionsTest() {
		List<String> pickListValuesList = CustomProductManager.getProductTypeOptions();
		System.assertEquals(3, pickListValuesList.size(), 'We have different amount of values');
	}

	@IsTest static void getProductFamilyOptionsTest() {
		List<String> pickListValuesList = CustomProductManager.getProductFamilyOptions();
		System.assertEquals(3, pickListValuesList.size(), 'We have different amount of values');
	}

	@IsTest static void getProductsTest() {
		//I don't know whether I should create a copy of a certain product record
		//to see whether this works or not, so I will just use search query that should return only one product
		List<Product__c> products = CustomProductManager.getProducts('Ch', '', '');
		System.assertEquals(1, products.size(), 'We get wrong search result');
	}

	@IsTest static void getProductsForCartTest() {
		List<ID> ids = new List<ID>();
		ids.add('a010900000SGvmcAAD');
		ids.add('a010900000SGiVrAAL');
		List<Product__c> products = CustomProductManager.getProductsForCart(ids);
		System.assertEquals(2, products.size(), 'We got wrong size');
	}
}