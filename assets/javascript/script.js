$(document).ready(function () {

 


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBtQRiZMCaYMHXQBMsSj4YwFppwBlC-l14",
    authDomain: "train-sked.firebaseapp.com",
    databaseURL: "https://train-sked.firebaseio.com",
    projectId: "train-sked",
    storageBucket: "",
    messagingSenderId: "268285965501",
    appId: "1:268285965501:web:0ddc1167b77aeca0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

 refresh();
  setInterval(refresh, 60 * 1000)  

function refresh( ){
database.ref().on("value", function(childSnapshot) {
        
  childSnapshot.forEach(function(childNodes) {
    var trainFreq = childNodes.val().frequency;
    var trainFirst = childNodes.val().first;
    var trainID=childNodes.key;
    var updatedArrival = childNodes.val().updatedArrival;
    var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
    var timeRemainder = diffTime % trainFreq;
    var minutesToNextTrain = trainFreq - timeRemainder;
    var nextTrain = moment().add(minutesToNextTrain, "minutes")


if (updatedArrival !== "") {
    var currentTime = moment().format("HH:mm");
    var start = moment.utc(currentTime, "HH:mm");
    var end = moment.utc(updatedArrival, "HH:mm");
    var min = moment.duration(end.diff(start)).asMinutes();
    
    // account for being passed the delayed time //
    if (min < 1) {

        var updatedTrain = {
                    
            updatedArrival:""
         }

         database.ref().child(trainID).update(updatedTrain);

        $("#next"+ trainID).text(moment(nextTrain).format("HH:mm"))
        $("#next"+ trainID).css("color", "black")
        $("#m"+ trainID).text(minutesToNextTrain)
        refresh();

    } else {
        
        $("#next"+ trainID).text(updatedArrival + " Delayed")
        $("#next"+ trainID).css("color", "red")
        $("#m"+ trainID).text(min)

       
       

    }
    // calculate the duration
   
    

} else {
    $("#next"+ trainID).text(moment(nextTrain).format("HH:mm"))
    $("#m"+ trainID).text(minutesToNextTrain)
}

/*end loop*/
        });

    });


  };


$(document).on("click", "#refresh", function(event) {
event.preventDefault(); 

    refresh();
/* end refresh click*/
});


  $(document).on("click", "#submit-add", function(event) {
    event.preventDefault();
       
             var trainName= $("#input-train").val().trim();
             var trainDestination= $("#input-destination").val().trim();
             var trainFrequency= $("#input-frequency").val().trim();
             var trainFirst= $("#input-time").val().trim();
             var newTrain = {
                 name: trainName,
                 destination: trainDestination,
                 frequency: trainFrequency,
                 first: trainFirst,
                 updatedArrival: ""
                 };
       
         database.ref().push(newTrain);

  $("#add-form").trigger("reset");     
/*end on click*/       
});

/* check for new data in database and update table*/
database.ref().on("child_added", function(childSnapshot) {


var trainName = childSnapshot.val().name;
var trainDest = childSnapshot.val().destination;
var trainFreq = childSnapshot.val().frequency;
var trainFirst = childSnapshot.val().first;
var trainID=childSnapshot.key;
var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
var currentTime = moment();
var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
var timeRemainder = diffTime % trainFreq;
var minutesToNextTrain = trainFreq - timeRemainder;
var nextTrain = moment().add(minutesToNextTrain, "minutes")

/* Push to the DOM*/

var newRow = $("<tr>");
newRow.attr("id", "row"+trainID);


var nameCell=$("<td>");
nameCell.attr("id", "n"+ trainID)
nameCell.text(trainName)

var destCell=$("<td>");
destCell.attr("id", "d"+trainID);
destCell.text(trainDest)

var freqCell=$("<td>");
freqCell.attr("id", "f"+trainID);
freqCell.text(trainFreq);

var nextCell=$("<td>");
nextCell.attr("id", "next"+ trainID);
nextCell.text(moment(nextTrain).format("HH:mm"));

var minCell=$("<td>");
minCell.attr("id", "m" + trainID);
minCell.text(minutesToNextTrain);

var deleteCell =$("<td>");
deleteCell.html('<button type="button" class="btn btn-danger delete" value="' + trainID + '">Delete</button>')

var updateCell =$("<td>");
updateCell.html('<button type="button" class="btn btn-primary update" value="' + trainID + '">Update</button>')
  
 $("#train-sked").append(newRow);
 $("#row"+trainID).append(nameCell, destCell,freqCell,nextCell,minCell,updateCell, deleteCell);


var editRow=$("<tr>");
editRow.attr("id", "er" + trainID);
editRow.css("display", "none")

var editName=$("<td>");
editName.html('<input type="text" class="form-control" id="update-train' + trainID +'" placeholder=""></input>');

var editDest=$("<td>");
editDest.html('<input type="text" class="form-control" id="update-dest'+trainID+'" placeholder=""></input>');

var blank1=$("<td>");
blank1.text("");

var submitCell =$("<td>");
submitCell.html('<button type="button" class="btn btn-primary submit" value="' + trainID + '">Submit</button>')

var editTime=$("<td>");
editTime.html('<input type="text" class="form-control" id="update-time'+ trainID+'" placeholder=""></input>');

$("#train-sked").append(editRow);
$("#er"+trainID).append(editName,editDest,blank1,editTime,submitCell);

database.ref().on("child_removed", function(childSnapshot) {
$("#row"+ childSnapshot.key).remove();
$("#er"+ childSnapshot.key).remove();

      });

database.ref().on("child_changed", function(childSnapshot) {
$("#n"+ childSnapshot.key).text(childSnapshot.val().name);
$("#d" + childSnapshot.key).text(childSnapshot.val().destination)


var currentTime = moment().format("HH:mm");
var updatedtime=childSnapshot.val().updatedArrival;

var start = moment.utc(currentTime, "HH:mm");
var end = moment.utc(updatedtime, "HH:mm");

// account for crossing over to midnight the next day
if (end.isBefore(start)) end.add(1, 'day');

// calculate the duration
var min = moment.duration(end.diff(start)).asMinutes();



if (updatedtime !== "") { 
    
    $("#next"+ childSnapshot.key).text(updatedtime + " Delayed");
    $("#next"+ childSnapshot.key).css("color", "red")
    $("#m"+ childSnapshot.key).text(min);
  
}

        
              });



      $(".delete").on("click", function(){
        console.log ("Delete clicked");
        var key =$(this).attr("value"); 
      
        database.ref().child(key).remove();

        });

        $(".update").on("click", function(){
            console.log ("Update clicked");
            var key =$(this).attr("value"); 
            $("#er"+key).css("display", "table-row")
            
            });



        $(".submit").on("click", function(){
            var key =$(this).attr("value");   
            var newtrainName= $("#update-train"+key).val().trim();
            var newtrainDestination= $("#update-dest"+key).val().trim();
            var newtraintime= $("#update-time"+key).val().trim();
       
            if (newtrainName !== "") {
                var updatedTrain = {
                    name: newtrainName,
                
                }
                database.ref().child(key).update(updatedTrain);
            }

            if (newtrainDestination !== ""){
                var updatedTrain = {
                    
                    destination: newtrainDestination
                }
                database.ref().child(key).update(updatedTrain);

            }

            if (newtraintime !== ""){
                var updatedTrain = {
                    
                   updatedArrival:newtraintime
                }
                database.ref().child(key).update(updatedTrain);
            }

            $("#update-dest"+key).val("")
            $("#update-train"+key).val("")
            $("#update-time"+key).val("")
            $("#er"+key).css("display", "none")
            });
 
           
            
            
            
        
/*end update table data*/
});


/* end ready doc */    
});