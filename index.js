module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'recskill' );


app.launch( function( request, response ) {
	response.say( 'Welcome to your test skill' ).reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );


app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);	
	response.say( 'Sorry an error occured ' + error.message);
};

/*
app.intent('sayNumber',
  {
    "slots":{"number":"NUMBER"}
	,"utterances":[ 
		"say the number {1-100|number}",
		"give me the number {1-100|number}",
		"tell me the number {1-100|number}",
		"I want to hear you say the number {1-100|number}"]
  },
  function(request,response) {
    var number = request.slot('number');
    response.say("You asked for the number "+number);
  }
);
*/



app.intent('haveInterview',
  {
    "slots":{"date":"DATE"}
	,"utterances":[ 
		"do I have any interviews {date}",
		"which interviews I have {date}",
		"are there any interviews {date}",
		"any interviews {date}"]
  },
  function(request,response) {
  	var dateSpoken = request.slot('date');
  	var records = [];
  	var jsforce = require('jsforce');
	var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://login.salesforce.com'
});
	conn.login('mycs1@sparkle.cstest', 'Alexa01!', function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);

  // SOQL:
  

  
	var query = conn.query("SELECT Candidate__c, Candidate__r.Name,Id,InterViewDateValue__c,Interview_Date__c,Interview_Type__c,Name FROM Interview__c where InterViewDateValue__c = " + dateSpoken)
	  .on("record", function(record) {
	    records.push(record);
	  })
	  .on("end", function() {
	    console.log("total in database : " + query.totalSize);
	    console.log("total fetched : " + query.totalFetched);
	    console.log("records " + records);
	    response.say("You have "+ query.totalFetched +  dateSpoken);
	  })
	  .on("error", function(err) {
	    console.error(err);
	  })
	  .run({ autoFetch : true, maxFetch : 4000 }); // synonym of Query#execute();



  // ...
});

    //var number = request.slot('number');
    //console.log("records " + records);

    //response.say("You have "+ dateSpoken);
  }
);

module.exports = app;