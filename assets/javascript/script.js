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

setInterval(refresh, 60 * 1000)  

function refresh( ){
    database.ref().on("value", function(childSnapshot) {
        console.log(childSnapshot.val());  

        childSnapshot.forEach(function(childNodes) {
        var trainFreq = childNodes.val().frequency;
var trainFirst = childNodes.val().first;
var trainID=childNodes.key;

console.log ("TF is " + trainFreq + "Tfir is " + trainFirst + trainID)

var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");

console.log('First train time converted is '+ trainFirstConverted);

var currentTime = moment();

console.log("Current time is " + currentTime);
console.log("current time formatted is " + moment(currentTime).format("HH:mm"));

var diffTime = moment().diff(moment(trainFirstConverted), "minutes");

console.log("Time difference betwen first train and now is " + diffTime);

var timeRemainder = diffTime % trainFreq;

console.log("Time remainder is " + timeRemainder)

var minutesToNextTrain = trainFreq - timeRemainder;

var nextTrain = moment().add(minutesToNextTrain, "minutes")

console.log("Minutes to next train is " + minutesToNextTrain + " and next arrival time is " + moment(nextTrain).format("HH:mm"));

$("#next"+ trainID).text(moment(nextTrain).format("HH:mm"))
$("#m"+ trainID).text(minutesToNextTrain)

/*end loop*/
        });

    });


  };


  $(document).on("click", "#refresh", function(event) {
    event.preventDefault(); 

    refresh();
/* end refresh click*/
});


  $(document).on("click", "#submit", function(event) {
    event.preventDefault();
       
             console.log ("Submit clicked")
       
             // Capture user inputs and store them into variables
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


            console.log(newTrain);     
       
         database.ref().push(newTrain);
             
          
       
/*end on click*/       
});

/* check for new data in database and update table*/
database.ref().on("child_added", function(childSnapshot) {
console.log(childSnapshot.val());  

var trainName = childSnapshot.val().name;
var trainDest = childSnapshot.val().destination;
var trainFreq = childSnapshot.val().frequency;
var trainFirst = childSnapshot.val().first;
var trainID=childSnapshot.key;

console.log("Train ID is " + trainID);

console.log(" Train Name " + trainName + "Train Dest " + trainDest + "Train Freq " + trainFreq + "First train " + trainFirst)


var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");

console.log('First train time converted is '+ trainFirstConverted);

var currentTime = moment();

console.log("Current time is " + currentTime);
console.log("current time formatted is " + moment(currentTime).format("HH:mm"));

var diffTime = moment().diff(moment(trainFirstConverted), "minutes");

console.log("Time difference betwen first train and now is " + diffTime);

var timeRemainder = diffTime % trainFreq;

console.log("Time remainder is " + timeRemainder)

var minutesToNextTrain = trainFreq - timeRemainder;

var nextTrain = moment().add(minutesToNextTrain, "minutes")

console.log("Minutes to next train is " + minutesToNextTrain + " and next arrival time is " + moment(nextTrain).format("HH:mm"));






var newRow = $("<tr>");
newRow.attr("id", "row"+trainID);
/*newRow.css("display", "inline-block");*/

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
editTime.html('<input type="text" class="form-control" id="update-time" placeholder=""></input>');

$("#train-sked").append(editRow);
$("#er"+trainID).append(editName,editDest,blank1,editTime,submitCell);

database.ref().on("child_removed", function(childSnapshot) {
$("#row"+ childSnapshot.key).remove();
$("#er"+ childSnapshot.key).remove();

      });

      database.ref().on("child_changed", function(childSnapshot) {
    $("#n"+ childSnapshot.key).text(childSnapshot.val().name);
    $("#d" + childSnapshot.key).text(childSnapshot.val().destination)
        
              });



      $(".delete").on("click", function(){
        console.log ("Delete clicked");
        var key =$(this).attr("value"); 
      
        database.ref().child(key).remove();
       
       

        console.log("#row" + childSnapshot.key);
       
        
        
        
        });

        $(".update").on("click", function(){
            console.log ("Update clicked");
            var key =$(this).attr("value"); 
            $("#er"+key).css("display", "table-row")
            var newtrainName= $("#update-train"+key).val().trim();
            var newtrainDestination= $("#update-dest"+key).val().trim();
            /*var newtraintime= $("#update-time"+key).val().trim();*/


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

            if (newtrainDestination !== ""){
                var updatedTrain = {
                    
                    destination: newtrainDestination
                }
                database.ref().child(key).update(updatedTrain);

            }



            $(".submit").on("click", function(){
                var key =$(this).attr("value"); 
                
            
                var newtrainName= $("#update-train"+key).val().trim();
            var newtrainDestination= $("#update-dest"+key).val().trim();
            /*var newtraintime= $("#update-time"+key).val().trim();*/
            console.log("New train name is "+ newtrainName);

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

            if (newtrainDestination !== ""){
                var updatedTrain = {
                    
                    destination: newtrainDestination
                }
                database.ref().child(key).update(updatedTrain);
            }

            $("#update-dest"+key).val("")
            $("#update-train"+key).val("")

            $("#er"+key).css("display", "none")
            });
    console.log("New train name is "+ newtrainName);
          
       
           
           
    
            console.log("#rowid"+ childSnapshot.key);
           
            
            
            
            });
/*end update table data*/
});


/* end ready doc */    
});