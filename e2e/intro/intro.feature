@intro
Feature: Intro Screen
	In order to understand the app
	The user needs to see the intro screen

	Scenario: User can see the first slide
		Given the user launches the application
		And the user navigates to "intro" page
		Then the intro screen is displayed correctly

	Scenario: User can proceed to next slide using the button
		When the "next" button is pressed in the intro screen
		Then the second slide is visible in the intro screen

	Scenario: User must navigate to the login page after completing the slide
		Given the user navigates to "intro" page
		When the user completes the sliding in the intro screen
		Then the done button is visible in the intro screen

	Scenario: User can skip to login page
		Given the user navigates to "intro" page
		When the "skip" button is pressed in the intro screen
		Then the user is in the "login" page
