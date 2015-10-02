
var Smile = (function() {

    // PRIVATE VARIABLES
        
    // The backend we'll use for Part 2. For Part 3, you'll replace this 
    // with your backend.
    var apiUrl = 'https://smileback-cs169.herokuapp.com'; 

    // FINISH ME (Task 4): You can use the default smile space, but this means
    //            that your new smiles will be merged with everybody else's
    //            which can get confusing. Change this to a name that 
    //            is unlikely to be used by others. 
    var smileSpace = 'JohnsonSpace'; // The smile space to use. 


    var smiles; // smiles container, value set in the "start" method below
    var smileTemplateHtml; // a template for creating smiles. Read from index.html
                           // in the "start" method
    var create; // create form, value set in the "start" method below


    // PRIVATE METHODS
      
   /**
    * HTTP GET request 
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
        
    /**
     * Insert smile into smiles container in UI
     * @param  {Object}  smile       smile JSON
     * @param  {boolean} beginning   if true, insert smile at the beginning of the list of smiles
     * @return {None}
     */
    var insertSmile = function(smile, beginning) {
        // Start with the template, make a new DOM element using jQuery
        var newElem = $(smileTemplateHtml);
        // Populate the data in the new element
        // Set the "id" attribute 
        newElem.attr('id', smile.id); 
        // Now fill in the data that we retrieved from the server
        newElem.find('.title').text(smile.title);
        // FINISH ME (Task 2): fill-in the rest of the data
        newElem.find('.story').text(smile.story);
        newElem.find('.happiness-level').addClass('happiness-level-' + parseInt(smile.happiness_level));
        newElem.find('.count').text(smile.like_count);
        newElem.find('.timestamp').text(time(smile.created_at));
        if (beginning) {
            smiles.prepend(newElem);
        } else {
            smiles.append(newElem);
        }
    };

    var time = function(arg) {
        var date = new Date(1000*arg);
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var posttime = 'Posted at ' + date.getHours() + ':' + date.getMinutes() + ' ' + month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        return posttime;
    }
    
    /**
     * Get recent smiles from API and display 10 most recent smiles
     * @return {None}
     */
    var displaySmiles = function() {
        // Prepare the AJAX handlers for success and failure
        var onSuccess = function(data) {
            /* FINISH ME (Task 2): display smiles with most recent smiles at the beginning */
            if (data.status == -1) {
                console.error(data.errors);
                return;
            }
            data.smiles.forEach( function(e) {
                insertSmile(e, false)
                });
        };
        var onFailure = function() { 
            console.error('display smiles failed'); 
        };
        /* FINISH ME (Task 2): make a GET request to get recent smiles */
        makeGetRequest('/api/smiles?space='+smileSpace+'&count=10&order_by=created_at', onSuccess, onFailure);
    };

    /**
     * Add event handlers for clicking like.
     * @return {None}
     */
    var attachLikeHandler = function(e) {
        // Attach this handler to the 'click' action for elements with class 'like'
        smiles.on('click', '.like', function(e) {
            // FINISH ME (Task 3): get the id of the smile clicked on to use in the POST request
            var smileId = $(this).parents(".smile").attr("id"); 
            // Prepare the AJAX handlers for success and failure
            var onSuccess = function(data) {
                /* FINISH ME (Task 3): update the like count in the UI */
                if (data.status == -1) {
                    console.error(data.errors);
                    return;
                }
                var newElem = $('.smile#'+smileId);
                newElem.find('.title').text(data.smile.title);
                newElem.find('.story').text(data.smile.story);
                newElem.find('.happiness-level').addClass('happiness-level-' + parseInt(data.smile.happiness_level));
                newElem.find('.count').text(data.smile.like_count);
                newElem.find('.timestamp').text(time(smile.created_at));
                
            };
            var onFailure = function() { 
                console.error('like smile error'); 
            };
            /* FINISH ME (Task 3): make a POST request to like this smile */
            makePostRequest('/api/smiles/'+smileId+'/like', null, onSuccess, onFailure);

        });
    };


    /**
     * Add event handlers for submitting the create form.
     * @return {None}
     */
    var attachCreateHandler = function(e) {
        // First, hide the form, initially 
        create.find('form').hide();

        // FINISH ME (Task 4): add a handler to the 'Share a smile...' button to
        //                     show the 'form' and hide to button
        create.on('click', '.my-button.share', function (e) {
            create.find('form').show();
            create.find('.my-button.share').hide();
        });
        // FINISH ME (Task 4): add a handler for the 'Cancel' button to hide the form
        // and show the 'Shared a smile...' button
        create.on('click', '.my-button.cancel', function (e) {
            create.find('form').hide();
            create.find('.my-button.share').show();
        });
        // The handler for the Post button in the form
        create.on('click', '.my-button.post', function (e) {
            e.preventDefault (); // Tell the browser to skip its default click action

            var smile = {}; // Prepare the smile object to send to the server
            smile.title = create.find('.title-input').val();
            if (smile.title.length <= 0 || smile.title.length > 64) {
                alert("Warning: title should not be empty or longer than 64 characters!")
                create.find('.title-input').val('');
                create.find('.story-input').val('');
                create.find('.happiness-level-input').val('1');
                return
            }
            // FINISH ME (Task 4): collect the rest of the data for the smile
            smile.story = create.find('.story-input').val();
            if (smile.story.length <= 0 || smile.story.length > 2048) {
                alert("Warning: story should not be empty, or longer than 2048 characters!")
                create.find('.title-input').val('');
                create.find('.story-input').val('');
                create.find('.happiness-level-input').val('1');
                return
            }
            smile.happiness_level = parseInt(create.find('.happiness-level-input').val());
            if (smile.happiness_level <= 0 || smile.happiness_level > 3) {
                alert("Warning: the happiness level is beyond range!")
                create.find('.title-input').val('');
                create.find('.story-input').val('');
                create.find('.happiness-level-input').val('1');
                return
            }
            smile.space = smileSpace;
            var onSuccess = function(data) {
                // FINISH ME (Task 4): insert smile at the beginning of the smiles container
                if (data.status == -1) {
                    console.error(data.errors);
                    return;
                }
                insertSmile(data.smile, true);
                create.find('.title-input').val('');
                create.find('.story-input').val('');
                create.find('.happiness-level-input').val('1');
            };
            var onFailure = function() { 
                console.error('create smile failed'); 
            };
            
            // FINISH ME (Task 4): make a POST request to create the smile, then 
            //            hide the form and show the 'Shared a smile...' button
            makePostRequest('/api/smiles', smile, onSuccess, onFailure);
            create.find('form').hide();
            create.find('.my-button.share').show();
        });

    };

    
    /**
     * Start the app by displaying the most recent smiles and attaching event handlers.
     * @return {None}
     */
    var start = function() {
        smiles = $(".smiles");
        create = $(".create");

        // Grab the first smile, to use as a template
        smileTemplateHtml = $(".smiles .smile")[0].outerHTML;
        // Delete everything from .smiles
        smiles.html('');

        displaySmiles();
        attachLikeHandler();
        attachCreateHandler();
    };
    

    // PUBLIC METHODS
    // any private methods returned in the hash are accessible via Smile.key_name, e.g. Smile.start()
    return {
        start: start
    };
    
})();
