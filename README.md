# API Automation with Playwright
This is a test suite in Playwright, for Airport Gap API

## Run tests
1. Clone the repo
2. Create .env file following "env README.txt" directions
3. Install dependencies: `npm install`
4. Run tests from **airport-gap** folder:  
   `npx playwright test --ui` for test runner

## Test cases
![screenshot](https://github.com/egaraujo/airport-gap-api-automation/blob/main/screenshot.jpg)  
• Should retrieve specific paginated set of airports  
• Should retrieve a specific airport  
• Should not find a wrong airport code  
• Should retrieve information between two given airports  
• Should ask for airports when not provided  
• Should retrieve token  
• Should retrieve created favorite  
• Should update favorite airport  
• Should delete all favorites  

## Links
Airport Gap API: https://airportgap.com/docs  
Airport Gap Repository: https://github.com/dennmart/airport_gap
