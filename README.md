# BorrowShelf
This project is implemented by Flask and Vanilla JS and is using MySQL database.
It is borrowing book platform that allows the user to post a book so others an ask to borrow. 

## Prerequisites 
1. Install flask
    `pip install flask`

2. Install bcrypt
    `pip install bcrypt`

3. Install SQLAlchemy
    `pip install SQLAlchemy`

## Project Checklist 
- [✅] It is available on GitHub. 
- [✅] It uses the Flask web framework. 
- [✅] It uses at least one module from the Python Standard 
Library other than the random module.
  - Module name: datetime, os
- [✅] It contains at least one class written by you that has 
both properties and methods. It uses `__init__()` to let the 
class initialize the object's attributes (note that  
`__init__()` doesn't count as a method). This includes 
instantiating the class and using the methods in your app. 
Please provide below the file name and the line number(s) of 
at least one example of a class definition in your code as 
well as the names of two properties and two methods. 
  - File name for the class definition: book_model.py
  - Line number(s) for the class definition: 6
  - Name of two properties: title, author
  - Name of two methods:  create_book, update_book
  - File name and line numbers where the methods are used: book.by line 12, line 24
- [✅] It makes use of JavaScript in the front end and uses the 
localStorage of the web browser. 
- [✅] It uses modern JavaScript (for example, let and const 
rather than var). 
- [✅] It contains conditional statements. Please provide below 
the file name and the line number(s) of at least 
  one example of a conditional statement in your code. 
  - File name: user.py
  - Line number(s): 19
- [✅] It contains loops. Please provide below the file name 
and the line number(s) of at least 
  one example of a loop in your code. 
  - File name: book_model.py
  - Line number(s): 79
- [✅] It lets the user enter a value in a text box at some 
point. 
  This value is received and processed by your back end 
Python code. 
- [✅] It doesn't generate any error message even if the user 
enters a wrong input. 
- [✅] It is styled using your own CSS. 
- [✅] The code follows the code and style conventions as 
introduced in the course, is fully documented using comments 
and doesn't contain unused or experimental code.  
  In particular, the code should not use `print()` or 
`console.log()` for any information the app user should see. 
Instead, all user feedback needs to be visible in the 
browser.   
- [✅] All exercises have been completed as per the 
requirements and pushed to the respective GitHub repository.