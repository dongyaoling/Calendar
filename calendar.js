var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date = new Date();
var currentMonth = new Month(date.getFullYear(), date.getMonth());
var token = "";
var user = "";
var nowEditId;

function update(){
	var weeks = currentMonth.getWeeks();
 	var i = 1;
	for(var w in weeks){
		var days = weeks[w].getDates();
		for (var d in days){
			if (days[d].getMonth() == currentMonth.month){
				$("#"+i).html(days[d].getDate());
			}else{
				$("#"+i).html("");
			}
			i = i + 1;
		}
	}
	if (i <= 36) {
        $("#lastweek").hide();
    } else {
        $("#lastweek").show();
    }
	$("#month").html(months[currentMonth.month]);
    $("#year").html(currentMonth.year);
    if(user != ""){
		$("#addevent").show();
		getevent();
	} else {
		$("#addevent").hide();
	}
}

function prev() {
    currentMonth = currentMonth.prevMonth();
    update();
}

function next() {
    currentMonth = currentMonth.nextMonth();
    update();
}

function login(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var login = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST","login.php",true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load",function (event) {
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if (jsonData.success) {  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
            token = jsonData.token;
            user = jsonData.username;
            $("#username").hide();
    		$("#password").hide();
    		$("#login").hide();
    		$("#register").hide();
    		$("#labeluser").hide();
    		$("#labelpass").hide();
    		$("#logout").show();
   			$("#welcome").show();
    		$("#logged").show();
    		$("#deleteuser").show();
    		$("#logged").html(user);
            update();
		} else {
			alert("Login failed: " + jsonData.message);
		}
	},false);
	xmlHttp.send(login);
}




function register(){
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var register = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST","register.php",true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if (jsonData.success) {  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
            user = jsonData.username;
            token = jsonData.token;
            $("#username").hide();
    		$("#password").hide();
    		$("#login").hide();
    		$("#register").hide();
    		$("#labeluser").hide();
    		$("#labelpass").hide();
    		$("#logout").show();
   			$("#welcome").show();
    		$("#logged").show();
    		$("#deleteuser").show();
    		$("#logged").html(user);
            update();
		}
	},false);
	xmlHttp.send(register);
}

function logout(){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST","logout.php",true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if (jsonData.success) {  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
			user = "";
            $("#username").show();
    		$("#password").show();
    		$("#login").show();
    		$("#register").show();
    		$("#labeluser").show();
    		$("#labelpass").show();
    		$("#logout").hide();
    		$("#welcome").hide()
    		$("#logged").hide();
    		$("#deleteuser").hide();
    		update();
		} else {
			alert("logout failed");
		}
	},false);
	xmlHttp.send(null);
}

function deleteuser(){
	var data = "username=" + user + "&token=" + token;
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST","deleteuser.php",true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if (jsonData.success) {  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
			user = "";
            $("#username").show();
    		$("#password").show();
    		$("#login").show();
    		$("#register").show();
    		$("#labeluser").show();
    		$("#labelpass").show();
    		$("#logout").hide();
    		$("#welcome").hide()
    		$("#logged").hide();
    		$("#deleteuser").hide();
    		update();
		} else {
			alert("Delete failed: " + jsonData.message);
		}
	},false);
	xmlHttp.send(data);
}

function addevent(){
	var title = document.getElementById("title").value;
	var content = document.getElementById("content").value;
	var date = document.getElementById("date").value;
	var time = document.getElementById("time").value;
	var symbol = document.getElementsByName("symbol");
	var chosen = "null";
	for(var i=0; i<symbol.length; i++){
		if(symbol[i].checked){
			chosen = symbol[i].value;  
			break;            
		}
	}
	
	var event = "title=" + title + "&content=" + content + "&token=" + token + "&date=" + date + "&time=" + time + "&username=" + user + "&flag=" + chosen;

	var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "addevent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
    xmlHttp.addEventListener("load", function (event) {
    	console.log(event.target.responseText);
        var jsonData = JSON.parse(event.target.responseText);
        console.log(event.target.responseText);
        if (jsonData.success) {   
            update();
        } else {
            alert("Add event fail: " + jsonData.message);
        }
        chosen = null;
    }, false); // Bind the callback to the load event
    xmlHttp.send(event); // Send the data
}

function getevent(){
	var symbol = document.getElementsByName("symbol1");
	var chosen = "null";
	for(var i=0; i<symbol.length; i++){
		 if(symbol[i].checked){
			 chosen = symbol[i].value;  
			 break;            
		}
	}
	var month = currentMonth.month + 1;
    var year = currentMonth.year;
    var data = "year=" + encodeURIComponent(year) + "&month=" + encodeURIComponent(month) + "&username=" + user + "&token=" + token + "&chosen=" + chosen;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "getevent.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function (event) {
        var jsonData = JSON.parse(event.target.responseText); 
        var monthday;
        for(var i=1; i<=42; i++){
			if($("#"+i).html() != ""){
				monthday = i;
				break;
			}
		}
        if (jsonData.success) {
            for (var i = 0; i < jsonData.events.length; i++) {
				var date = jsonData.events[i].day;
				var day = currentMonth.getDateObject(date).getDay();
				var time = jsonData.events[i].time;
				var title = jsonData.events[i].title;
				var id = jsonData.events[i].id;
				var content = jsonData.events[i].content;
				var flag = 	jsonData.events[i].flag;
				var loc = monthday + date - 1;
				var event_html = '<div class="' + flag + '">' + title + '</div>';
				event_html += '<div class="three">';
				event_html += '<div>' + content + ' -' + time + '</div>';
				event_html += '<div hidden>' + date + '</div>';
				event_html += '<div hidden id=eventId>' + id + '</div>';
				event_html +='<button onclick="removeEvent('+id+')">remove</button>';
				event_html +='<button onclick="editEventPrepare('+id+')">edit</button>';
				event_html += "</div>";	
				$("#" + loc).append(event_html);
    		}
        } else {
            alert("Cannot get event: " + jsonData.message);
        }
    }, false);
	xmlHttp.send(data);
}
function removeEvent(id){	
	var info = "eventid=" + id + "&token=" + token;

	var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("POST", "removeevent.php", true); 
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function (event) {
        var jsonData = JSON.parse(event.target.responseText);
        if (jsonData.success) {
			update();
        } else {
            alert("Delete event failed: " + jsonData.message);
        }
    }, false); // Bind the callback to the load event
    xmlHttp.send(info); // Send the data
}
function cancelEventedit(){
	$("#editevent").hide();
	$("#addevent").show();
}
function editEventPrepare(id){
	$("#editevent").show();
	$("#addevent").hide();
    nowEditId=id;
	}
function editEvent(){
    var title = document.getElementById("edittitle").value;
    var content = document.getElementById("editcontent").value;
    var date = document.getElementById("editdate").value;
    var time = document.getElementById("edittime").value;
    var symbol = document.getElementsByName("symbol2");
	var chosen = "null";
	for(var i=0; i<symbol.length; i++){
		if(symbol[i].checked){
			chosen = symbol[i].value;  
			break;            
		}
	}
	
    var event = "eventid=" + nowEditId + "&title=" + title + "&content=" + content + "&token=" + token + "&date=" + date + "&time=" + time  + "&flag=" + chosen;
    
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "editevent.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
    xmlHttp.addEventListener("load", function (event) {
		var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
		if (jsonData.success) {
			update();
			$("#editevent").hide();
			$("#addevent").show();
		} else {
			alert("edit event fail: " + jsonData.message);
		}
	}, false); 
    xmlHttp.send(event);

}

function gotoday() {
    currentMonth = new Month(date.getFullYear(), date.getMonth());
    update();
}


document.getElementById("prevmonth").addEventListener("click", prev, false);
document.getElementById("nextmonth").addEventListener("click", next, false);
document.getElementById("editsubmiteditevent").addEventListener("click", editEvent, false);
document.getElementById("cancelEdit").addEventListener("click", cancelEventedit, false);
document.addEventListener("DOMContentLoaded", update, false);
document.getElementById("login").addEventListener("click", login, false);
document.getElementById("register").addEventListener("click", register, false);
document.getElementById("logout").addEventListener("click", logout, false);
document.getElementById("submitevent").addEventListener("click", addevent, false);
document.getElementById("red").addEventListener("click",update,false);
document.getElementById("blue").addEventListener("click",update,false);
document.getElementById("orange").addEventListener("click",update,false);
document.getElementById("green").addEventListener("click",update,false);
document.getElementById("null").addEventListener("click",update,false);
document.getElementById("deleteuser").addEventListener("click", deleteuser, false);
document.getElementById("today").addEventListener("click",gotoday,false);
