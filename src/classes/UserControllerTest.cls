@IsTest
private class UserControllerTest {
	@IsTest static void TestGetSingleUser() {
		User user = UserController.getSingleUser('00509000003T7jxAAC');
		System.assertEquals('Zakariya Beno', user.Name, 'We got another user' + user.Name);
	}
}