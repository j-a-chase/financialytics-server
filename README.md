# James A. Chase
## Financialytics - Server

### Overview

Money is essential to our everyday lives, and accurately managing one's money is equally vital. Many people, especially college students and young newlyweds, have not learned how to manage their finances or make a budget responsibly. They lack the knowledge and experience to plan or discuss finances in a meaningful way.

Financialytics is a QuickBooks-inspired program for personal use. It's designed to help college-age students and young newlyweds keep better track of their finances through an easy-to-use web application, enabling them to have the conversations they need to better manage their money. It is designed to help them track their spending and income, and determine if their money is working for or against them.

### How To

Financialytics is still under heavy development, with many exciting features on the horizon, but it isn't quite ready for widespread use on the web. However, if you're technologically adept and have the right resources, you'll be able to run your own local instance of Financialytics with ease and be able to have quick and easy financial tracking in no time. Simply ensure that both this server and the <a href="https://github.com/j-a-chase/financialytics-api">API</a> are running on your local machine, and you'll be able to explore and use the application.

Financialytics currently allows you to categorize and track your transactions by adding, editing, or deleting them. It also allows you to customize your targets, allowing for the addition of financial goals, new categories, or changing the budget amounts for your categories. There's currently no support for separating transaction totals by month, but that feature is first on the list of many to be implemented as time allows.

### Future Work

The following features are slated for development and estimated times for availability will be added as time is budgeted for them. These will not necessarily be implemented in the order they are listed as some are smaller quality of life (QoL) features and others are massive changes:

- Separation of transactions by month and by year
    - Allows budgets to be more effectively interpreted
- Charts!
    - Analytical charts to quickly see how you're doing at a glance!
- User Feedback System
    - Notifications when spending is apporaching or has exceeded a category limit
    - Tooltips and help buttons to explain how certain features work
    - Debt Reduction Goals
        - Allows user to identify a place where they are struggling with spending and grants encouragement and advice to help improve in that area with the ultimate goal of reducing debt
    - Spending trend analysis
- Database Upgrade
    - Migrate from JSON storage to a SQLite JDBC
        - Still focusing on local usage of the application for now
- Upgrades to Transaction History
    - Sorting options for the transaction lists
    - Support for .csv file importing of transactions
    - Generation of monthly and end of year reports for their transactional data
        - Includes summaries for all targets
- Upgrades to Categories
    - The ability to define subcategories within a category
        - Ex: Food (subcategories: groceries, restaurants)
- ...and more!

### Development Environment and Tools

Server:
- VSCode
- Node.js v21.7.3
- EJS

API:
- IntelliJ IDEA 2024.1.2
- Java 21
- SpringBoot 3.4.2

### Resources Used

- [EJS](https://ejs.co/)
- [Difference Between em and rem Units](https://www.geeksforgeeks.org/difference-between-em-and-rem-units-in-css/)
- [Format Number](https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places)
- [Remove Space Between Table Cells and Rows](https://stackoverflow.com/questions/351058/space-between-two-rows-in-a-table)
- [HTML input type=date](https://www.geeksforgeeks.org/html-dom-input-date-object/)
- [How to Install and Use NVM on Windows](https://www.geeksforgeeks.org/how-to-install-and-use-nvm-on-windows/)
- [Set select Element value JavaScript](https://stackoverflow.com/questions/78932/how-do-i-programmatically-set-the-value-of-a-select-box-element-using-javascript)
- [Go Back Arrow Image](https://www.svgrepo.com/svg/346526/arrow-go-back)
- [Writing Tests with Supertest and Mocha](https://medium.com/@ehtemam/writing-test-with-supertest-and-mocha-for-expressjs-routes-555d2910d2c2)
- [Unit Testing Routes with Express](https://stackoverflow.com/questions/9517880/how-does-one-unit-test-routes-with-express)
- [Under Construction Image](https://www.svgrepo.com/svg/396062/construction)
- [Add EJS Helper Functions](https://stackoverflow.com/questions/13221760/nodejs-ejs-helper-functions)
- [Insert Child Node at Specific Position](https://stackoverflow.com/questions/5882768/how-to-append-a-childnode-to-a-specific-position)
- [Hamburger Menu Image](https://www.svgrepo.com/svg/491033/hamburger-menu)
- [toTitleCase Function](https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city)
- [JavaScript replaceAll method](https://www.w3schools.com/jsref/jsref_string_replaceall.asp)
