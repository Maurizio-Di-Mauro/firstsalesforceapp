public with sharing class UserController {
	@AuraEnabled(cacheable=true)
	public static User getSingleUser(ID userId){
		return [
				SELECT Id, Name, IsManager__c
				FROM User
				WHERE Id = :userId
				LIMIT 1
		];
	}

}