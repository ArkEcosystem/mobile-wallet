@login
Feature: Login Screen
	The user wants to sign in the app or create a profile

	Scenario: User can see the login page
		Given the user launches the application
		And the user navigates to "login" page
		Then the login screen is displayed correctly

	Scenario: User must register a pin before creating a profile
		When the create profile button is pressed in the login screen
		Then the pin code modal is visible
