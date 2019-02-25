---
title: "Oracle APEX - The Power of Interactive Reports"
date: 2019-02-25 04:17:21 +0600
toc: true
toc_sticky: true
toc_label: "Table of Contents"
toc_icon: terminal
tags:
    - oracle
    - database
    - apex
    - interactive
    - reports
categories:
    - Oracle
    - APEX
---
This post intends to be an in-depth tutorial on Oracle APEX's Interactive Reports and their different options. This is the second in a series of posts about APEX
<!--more-->

The views expressed here are my own and do not necessarily reflect the views of Oracle
{: .notice}

# TL;DR

You can download the finished application from [orders_app.apex.sql](/assets/files/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/orders_app.apex.sql). It includes the data in the [Orders.csv](/assets/files/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/Orders.csv) file.

# Step by Step Tutorial

APEX was designed with Database Applications in mind. Nowadays many people perform their day to day management with a spreadsheet software, it might seem simpler than getting a database set up for the task, but it really isn't. What if you had to share your excel file with your other store locations? Would you share it via e-mail? How would your changes be synced?

With APEX you have the power to change that with just a few clicks. Just upload your data as it is and it will generate an application with a report and a form for you. You'll be able to keep adding data while making your app available to other people so they can do the same.

The following steps will provide guidance on how to build an APEX Application from an orders spreadsheet and how to make APEX's Interactive Reports work for you.

Once you have an APEX workspace set up and have accessed it. A screen like the following should appear:

![Application Builder Main Page](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/001.png)

Click on the Create button. This will take you to the "Create an Application" page, where you can choose from a range of options to start creating your application. 
![Create an Application](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/002.png)

Click on "From a spreadsheet" button.

![From a Spreadsheet - Step 1](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/003.png)

You will be presented with two options. Pick "From a file".

![From a Spreadsheet - Step 2](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/004.png)

Next to this file you should have found the [Orders.csv](/assets/files/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/Orders.csv) file. Pick such file in the "Text File" file browser, then enter a comma `,` as the "Separator" if nor already there and enter a double quotation mark `"` as the "Optionally Enclosed By" field. Click the "Next" button at the bottom of the page and wait for the file to be uploaded.

After a few seconds the below screen will appear:

![From a Spreadsheet - Step 3](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/005.png)

<!-- TODO: Put the values as code and decide how to indicate the fields -->

Write "ORDERS" in the "Table Name" field and then type "DD/MM/YY" in the "Format" row of the "ORDER_DATE" column. Continue by clicking the "Load Spreadsheet" button at the bottom of the page.

After the file is loaded the following screen will be shown.

![From a Spreadsheet - Step 4](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/006.png)

Then, click on "Continue to Create Application Wizard" button.

Enter "ORDERS" into the "Name" field and click the "Create Application" button at the bottom of the page.

![Create an Application](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/007.png)

The "Application Builder" is displayed with our application, for which six pages have been created.

![Application Builder - ORDERS Application](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/008.png)

Click on the "Run Application" icon at the middle of the page. The application user login will appear.

![ORDERS Application - Login Page](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/009.png)

Enter your workspace login details and click on the "Sign In" button.

You will now see the Home Page, click on the "Orders" button from the page or from the navigation menu. Then a report with all the uploaded data will be shown.

![ORDERS Application - Orders Page](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/010.png)

Doesn't seem like much, but wait to see the following. Now click on one of the pencil icons at the beginning of the rows.

A form will appear, this was created automatically based upon the uploaded data.

![ORDERS Application - Orders Form](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/011.png)

It will allow you to get new data into the database you now have. Scroll down and click on the "Cancel" button. We will now remove the clutter from our report.

Sometimes there's data in the report we don't always need to see. With the help of APEX's interactive reports we can select the data columns we want to see. Click in the "Actions" menu next to the search bar and then pick the "Columns" option from the menu. A dialog will appear.

![Orders Report - Select Columns Step 1](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/012.png)

Click on the "<<" button displayed on the dialog, this will hide all the columns in the report. We'll now pics the columns we want by selecting a name in the "Do Not Display" column and clicking on the ">" button. You can reorder the names by clicking the icons located to the right of the "Display in Report" column later on.

![Orders Report - Select Columns Step 2](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/013.png)

Pick at least Order Date, Product Name, and Sales to be in the report. A more simplified report will appear.

Lets use the "Actions" menu once more by picking the "Save Report" option from the sub-menu "Report".

![Orders Report - Save Primary Report Step 1](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/014.png)

Pick the "As Default Report Settings" option on the "Save" field. A new dialog will appear.

![Orders Report - Save Primary Report Step 2](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/015.png)

Select the "Primary" option and click "Apply". By doing this we're telling APEX to make this simplified view of our table the default view for all the Application users.

Once someone enters the Orders page they will see the report as it is now. Now lets make it more interesting.

Click on the "Actions" menu once more and hover over the "Data" option, then pick the "Compute" option in the sub-menu. We will now generate a couple of columns that are said to be "computed", meaning that such columns will have calculated values, normally depending on the original report columns.

![Orders Report - Compute Uppercase Product Name](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/016.png)

Enter "Uppercase Product Name" as the "Column Heading" and now type the following as the "Computation Expression":

`UPPER( Q )`

Make sure the Q letter corresponds to the "Product Name" column under the "Columns" list, if it doesn't, then replace it with the letter that corresponds to it. You can find all the supported operations for these "Computations" under the "Functions / Operations" list. Click "Apply"

![Orders Report - Created Uppercase Product Name Column](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/017.png)

We now see the "Uppercase Product Name" at the right side of our report. This column will be useful because the Orders.csv file contained product names that were just different in the character case used. With the "Uppercase Product Name" column we have something that we know will be different independently of the character case it is written on.

Can we have a "Sales by Product" report? Yes. Interactive Reports allow us to group things by one or more columns.

Click on the "Actions" menu and select the "Group By" option. A dialog will open.

![Orders Report - Group By Uppercase Product Name](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/018.png)

Select the "**Uppercase Product Name" column (The two asterisk characters before the name mean that the selected column is a "Computed" column) as the "Group By Column". Now select "Sum" as the "Function", "Sales" as the "Column" and type "Total Sales" as the "Label" and click "Apply".

This generates a new report which has only two columns: The "Uppercase Product Name" and the "Total Sales"

![Orders Report - Total Sales](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/019.png)

Now let's save this report to use it later.

Hover the "Report" sub-menu from the "Actions" menu and select the "Save Report" option.

![Orders Report - Save Named Report](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/020.png)

Select "As Named Report" in the "Save" field and type "Sales By Product" as the "Name". Then click "Apply". You will now see a select control next to the "Actions" menu. That new control will list all the reports we've saved.

Notice that the new report is listed as "Private", this means that only developers will be able to see that saved report. We'll make it public later on. Now let's return to our "Primary Report"

Select the "Reset" option from the sub-menu "Report" in the "Actions" menu to get it back to normal.

![Orders Report - Reset](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/021.png)

Click "Apply" on the dialog that appears. And it will get back to the saved report. We'll now create another computed column for the year of the sale.
Click on the "Actions" menu once more and select the "Compute" option from the "Data" submenu.

![Orders Report - Compute Order Year](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/022.png)

Type "Order Year" as the "Column Heading" and get the following on the "Computation Expression" 

`TO_CHAR( B, ‘YYYY' )`

Once more, make sure the letter B corresponds to the "Order Date" in the "Columns" list and if not, please change it for the corresponding letter in the "Computation Expression". Click "Apply"

![Orders Report - Created Order Year Column](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/023.png)

Back to the report, lets create a new "Group By" by selecting such option from the "Actions" menu.

![Orders Report - Group By Order Year Column](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/024.png)

Select "**Order Year" as the "Group By Column", "Sum" as the "Function", "Sales" as the "Column", and "Total Sales" as the "Label". Click "Apply".

We now have a "Sales by Year" report. Let's save it.

![Orders Report - Sales by Year Report](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/025.png)

![Orders Report - Sales by Year Report Save](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/026.png)

Save it as a "Named Report" and name it "Sales by Year". Then click "Apply" Now lets get a chart from the displayed data.

Click on the "X" button next to the "Edit Group By" element just below the search bar.

Select the "Chart" option from the "Actions" menu

![Orders Report - Chart](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/027.png)

Now pick "**Order Year" as the "Label", "Sales" as "Value", "Sum" as the "Function", "Label - Ascending" as the "Sort", "Year" as the "Axis Title for Label", "Total Sales" as the "Axis Title for Value" and "Vertical" as the "Orientation". Click "Apply"

![Orders Report - Sales By Year Chart](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/028.png)

You now have a chart of "Sales by Year".

![Orders Report - Sales By Year Chart Save](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/029.png)

Save it as a named report and give it the name "Sales by Year (Chart)". Then click "Apply".

Notice you now have three Private reports. Private reports are only visible by their developer. This can be useful when creating or modifying a report without modifying the user's report list. Now that our reports are ready, let's make them available for the users.

Select a report from the list next to the search bar and then select the "Reset" option from the "Report" sub-menu under the "Actions" menu. This will get the report back to its saved state.

Click on the "Save Report" option from the "Report" sub-menu. Now, instead of saving it "As Named Report" we will save it "As Default Report Settings", this will make the report visible to the application users.

![Orders Report - Save Alternative Report](/assets/images/posts/2019-02-25-oracle-apex-the-power-of-interactive-reports/030.png)

Once the above dialog appears, select "Alternative" as the "Default Report Type" and enter the corresponding report name as the "Name", then click "Apply".​􏰀

Once saved, the report will appear under the "Default" category in the reports list next to the search bar and will be visible by the application users.

As a final note, it is worth mentioning that the application users can also make use of the report features depicted in this document, although when saving a report it will be visible only for the user that created it depending on the report's internal options.
