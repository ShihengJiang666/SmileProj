# Smile ^_^ Warmup Project

## Part 2: Javascript - Smiles Become Alive

In part 2, you'll be adding Javascript to make requests to our server to get
smiles and create smiles.
You'll also be adding some Javascript animations to make the UI nicer.

.Task 1: Get Started
-

For Part 2 you will need to use and edit the files that you finished for
Part 1. Even if you did not complete all of Part 1, you can still use those
files (you need at least the result of Part 1 Task 2.1; if you did not get the
styling done, your files should still be usable).

1. Create a local branch named `part2`, from your `part1` branch
```
git checkout -b part2
```

1. You will now be editing locally, and **remember to commit frequently**.

1. You will find the following provided files (in addition to those you used
   for Part 1):
    - static/scripts
        - `smiles.js` where all the Javascript goes
        - `jquery.min.js` jQuery library you'll use

   You will have to make changes to the .css, the .html, and the .js files.


1. Add code to the `index.html` to load the Javascript files. Add the
following code inside the `<head>` element at the end (not `<header>`).
```
<script src="scripts/jquery.min.js"></script>
<script type="text/javascript" src="scripts/smiles.js"></script>
<script type="text/javascript">
    // This is a jQuery convention to say that once all the files
    // load, the function Smile.start() should run.
    // This function is defined in the smiles.js
    $(function() {
        Smile.start();
    });
/script>
```

This code will load the jQuery library and the Javascript library for our
project (`smiles.js`).

Smile Spaces
---

In order to allow all of you to use a common backend, we will keep the
smile posts separated into "spaces". Each smile post lives in one space, named
with a non-empty string of length at most 128.

At the top of `smiles.js` you will see the URL to the backend that you will
use for Part 2. (In Part 3 of the project you will write your own backend.)
The provided backend has a space called `initial` that is populated with a few
smile posts, to help you get started. In the `initial` smile space,
the shared backend will allow you to
read the smile posts (Task 2 below), and to increase their like counts (Task 3
below), but not to add new
smile posts. When you get to creating new smile posts (Task 4 below),
you will have to change the `smileSpace` variable in `smiles.js` to
a new name that will give you your own smile space. 


.Task 2: Display All Smiles
-

1. We will not need the posts you have added to `index.html` in Part 1.
   However, we will keep one around to use as a template for
   creating more posts. So, delete all but one of the posts in `index.html`.
   
1. In `scripts/smiles.js`, fill in the function `displaySmiles` to make a GET
   request to our Smile server to get the most recently created 10 smiles.
   - You will need to show the smiles sorted in decreasing order of the
      created time.
  - Our API by default returns smiles by recently updated (e.g. if someone
    likes a smile, we update the updated_at timestamp).
    You'll need to pass in the right params to our API (see below for
    documentation)
  - Please be aware that requests to Heroku backends sometimes take a
     few seconds to return, especially if the backend has not been
     used in a while.
1. In `scripts/smiles.js`, fill in the function `success` in `displaySmiles`
   to sort the smiles returned from the server, and to call `insertSmile`. 
  - Smiles in the UI should be ordered so that the smile with the most likes
    show at the beginning.
  - In case the server returns an error, you should call the function
    "console.error()" with the error messages
    
1. Finish the implementation of `insertSmile`
  - You'll need to convert the created timestamp into a user-friendly format
     in the local timezone, using the format "13:08 May 25, 2015".
     Our API returns the timestamp in epoch time. Javascript has a built in
     Date library for converting times.
     Read more about [converting epoch time](http://www.epochconverter.com/programming/#javascript).


<a name='get_smiles'/>
#### GET /api/smiles
---
Gets the most recently updated smiles

##### Query Parameters
```
space: the name of the smile space to use. Each smile lives in the separate
           space (mandatory, non-empty, at most 128 characters) 
count: maximum number of smiles to return (optional, integer or the string
           'all'; default = 20)
order_by: the name of the field by which to sort in decreasing order. One of:
           like_count
           happiness_level
           updated_at  (default)
           created_at
```

##### Example Request
```
GET /api/smiles?space=default&count=5&order_by=created_at
```

##### Example Response
The response contains a status field (with value 1 if there were no errors, and -1 if there were errors).
If there were no errors, then the field `smiles` contains the list of smiles.
```javascript
{
    "status" : 1,
    "smiles": [
                          {
                              "id": 2,
                              "space" : "initial",
                              "title": "Surround yourself with close friends",
                              "story": "Studies show that the more close friends you have, and the more social support you have, the happier and healthier you tend to be. This means surround yourself with close friends and family who you can rely on, who truly care about you, are there to help you in times of need, and there to enjoy times with you. Remember to be there for them too!\r\n\r\nhttp://www.bmj.com/content/337/bmj.a2338",
                              "happiness_level": 3,
                              "like_count": 338,
                              "created_at": 1432364394.15,
                              "updated_at": 1432364394.25
                          },
                          ...
    ]
}
```

If there were errors, then the response contains only two fields:
```javascript
{
    "status" : -1,
    "errors" : [ ...list of error messages ... ]
}
```

The following error messages may be included for this request:
* "space must be non-empty" (if the submitted "space" is missing or empty
  string)
* "Invalid order_by" (if the `order_by` query parameter did not have one of
  the values specified above
* "Invalid count" (if the `count` query parameter was neither the string
       "all", nor an integer greater than 0)


At this point if you open `index.html` it should look like this:

![Part 2 Task 2](https://raw.githubusercontent.com/necula01/smile_cs169/part1/README.d/screen-index-2-2.png)

### Task 3: Handle Liking a Smile
---

Now we'll handle incrementing the like count for the clicked on smile.

1. In the `attachLikeHandler` function add code to find the `smileId` of the
    clicked Like button.
    - You can use the JavaScript debugger in your browser to put a breakpoint
       on the `smileId` and the click a Like button.
    - Recall that in the code that you modified in Task 2, the `id` of
       each smile is set as an attribute for the smile `<article>`.
    - In jQuery, the event handler received the DOM element on which
       the event was triggered in the `this` variable.
    - In jQuery, there is a function called `parents` that allows you
       find parents of an element given some selector. 

1. In the `attachLikeHandler` function add code to make a POST request to
   increase the like count.
     - See documentation below for the POST request
     - Upon success this POST request returns the updated JSON data
        for the smile that was liked.

1. In the `success` handler in the `attachLikeHandler` function,
    add code to update the like count of the updated smile,
    based on the data returned by the POST request.
    - In case the server returns an error, you should call the function
      "console.error()" with the error messages


<a name='post_like'>
#### POST /api/smiles/:id/like
---
Like specified smile. Liking a smile updates its `updated_at` timestamp.

##### Example Request
```
POST /api/smiles/4/like
```

##### Example Response
The response contains a status field (with value 1 if there were no errors, and -1 if there were errors).
If there were no errors, then the field `smile` contains the updated smile.
```javascript
{
    "status" : 1,
    "smile" : {
        "id": 4,
        "space": "initial",
        "title": "Think positive!",
        "story": "Instead of thinking 'My goal is to not overweight', think 'I want to be fit and healthy!'",
        "happiness_level": 2,
        "like_count": 26,
        "created_at": 1432364394.15,
        "updated_at": 1432364394.25,
    }
}
```

If there were errors, then the response contains only two fields:
```javascript
{
    "status" : -1,
    "errors" : [ ...list of error messages ... ]
}
```

The following error messages may be included for this request:
* "Invalid smile id" (if the smile with the given id does not exist)


### Task 4: Handle Creating a New Smile
---

Let's move the create form onto the home page, so we don't load a new webpage
every time a user decides to post a smile.
Now that we know some Javascript, we can use it to hide most of the form by
default and
just show it when users intend to share a smile.

1. Go to the `create.html` that you created in Part 1, and copy the HTML for
   the `<form>` to `index.html` inside the `<div class="create">`, after the
   'Share a smile...' link.

1. The function `attachCreateHandler` hides the `<form>` when it starts
   (already implemented). This means that the `<form>` is there but
   we do not see it initially. 

1. Change the function `attachCreateHandler` to add a handler for the
    `Share a smile...` link, to show the `<form>` and hide the link.

   At this point, if you open `index.html` and click on the
   `Share a smile...` you will see the following:

    ![Part 2 Task 4](https://raw.githubusercontent.com/necula01/smile_cs169/part1/README.d/screen-index-2-4.1.png)

1. Edit the value of the `smileSpace` in `smiles.js` to pick a new smile
   space where you can create smiles. It is probably easier to pick a
   name that nobody is likely to use, but you can also share a space
   with friends, as long as you understand that you will all be
   creating smiles there. 
   
1. Change the function `attachCreateHandler` to add a handler
   for the Cancel button in the form, to close the form  (without reloading the page).

1. Change the function `attachCreateHandler`,
    to finish the implementation of
    the existing handler for the submit button for the form:
      - Add code to collect the remaining fields of the new smile
      - Add code at the end of the handler to make the POST
         request (see documentation below), and to close the form.
       - Add code to the `success` handler to insert
          the newly added smile at the beginning of the
          current list of smiles. 
      - In case the server returns an error, you should call the function
        "console.error()" with the error messages

<a name='post_create'>
#### POST /api/smiles
----
Create a new smile.

##### Example Request
```
POST /api/smiles
```
with the following data:
```javascript
{
    "title": "Pursue fulfilling goals",
    "space": "my space",
    "story": "The goals that give you the most happiness and fulfillment are  those that are authentic and intrinsic - meaning it's a cause you personally really believe in. It's not done out of pressure from peers, parents, or family. It's not done just to gain ego, money, or power. You do it because you believe it's right, that it'll help yourself and others.",
    "happiness_level": 3
}
```

##### Example Response
The response contains a status field (with value 1 if there were no errors, and -1 if there were errors).
If there were no errors, then the field `smile` contains the created smile.
```javascript
{
    "status" : 1,
    "smile" : {
        "id": 4,
        "space": "initial",
        "title": "Think positive!",
        "story": "Instead of thinking 'My goal is to not overweight', think 'I want to be fit and healthy!'",
        "happiness_level": 2,
        "like_count": 26,
        "created_at": 1432364394.15,
        "updated_at": 1432364394.25,
    }
}
```

If there were errors, then the response contains only two fields:
```javascript
{
    "status" : -1,
    "errors" : [ ...list of error messages ... ]
}
```

The following error messages may be included for this request:
* "space must be non-empty" (if the submitted "space" is missing or empty
  string)
* "space must be at most 128 characters" (if the submitted "space" is too long)
* "title must be non-empty" (if the submitted "title" is missing or empty
  string)
* "title must be at most 64 characters" (if the submitted "title" is too long)
* "story must be non-empty" (if the submitted "space" is missing or empty
  string)
* "story must be at most 2048 characters" (if the submitted "story" is too long)
* "happiness_level must be an integer from 1 to 3" (if the submitted
   "happiness_level" is missing or is not an integer, or is not from 1 to 3)
* "Operation not  allowed on 'initial' space" (this is an error you get from
   the provided backend, if you are trying to create a new smile
   in the 'initial' space. You must choose another space for this Task;
   you do not need to implement this error in your own backend)

### Task 5: Add Error Checking for Creating a New Smile
---

1. In case the user tries to create an invalid smile,
    we want the JavaScript to tell the user, without
    submitting the data to the server.
    - Show an error if the `title` is empty or longer than 64 characters.
    - Show an error if the `happiness-level` is not between 1 and 3
    - Show an error if the `story` is empty, or longer than 2048 characters.
    - Use a Javascript "alert(...)" statement to report the error. The text of
      the alert should contain all errors in the data, one per line. 


### How to Submit
---

Again, we'll use Github Pages to host your Smile app like you did in Part 1. 

1.  Commit your changes locally. Make sure you are in branch `part2`.

1. Push the `part2` branch to GitHub:
```
git push origin part2
```
   - You can submit multiple times, after intermediate tasks, but on the deadline
      you need to have submitted the end result (after Task 5).
   
1. Push the GitHub pages:
```
git push -f origin part2:gh-pages
```

1. Now your finished project should be up on http://your_username.github.io/smile_cs169
