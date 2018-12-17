<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php'; 
header("Content-Type: application/json"); 

$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];
 
if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
	die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}

if(!(isset($_POST['token'])) || $_POST['token'] == "" || $_SESSION['token'] !== $_POST['token']){
	echo json_encode(array(
		"success" => false,
		"message" => "Request forgery detected.",
		"data" => $_POST['token']
	));
	exit;
}else if (empty($_POST['title']) || empty($_POST['content']) || empty($_POST['date']) || empty($_POST['time'])) {
	echo json_encode(array("success" => false, "message" => "Please make sure that all blanks have been filled in."));
	exit;
}else if(!preg_match('/^(\d{4})\-(\d{2})\-(\d{2})$/', $_POST['date'])){
	echo json_encode(array("success" => false, "message" => "Please fill in correct date format, like:yyyy-mm-dd"));
	exit;
}else if(!preg_match('/^(\d{2})\:(\d{2})$/', $_POST['time'])){
	echo json_encode(array("success" => false, "message" => "Please fill in correct time format, like:hh:mm"));
	exit;
}else if($_POST['flag'] == "null"){
	echo json_encode(array("success" => false, "message" => "Please select flag"));
	exit;
}else{
	$title = $_POST['title'];
	$content = $_POST['content'];
	$user = $_POST["username"];
	$date = $_POST['date'];
	$time = $_POST['time'];
	$flag = $_POST['flag'];
	$stmt = $mysqli->prepare("INSERT INTO event (username, title, date, time, content, flag) VALUES (?, ?, ?, ?, ?, ?)");
	if (!$stmt) {
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}
	$stmt->bind_param('ssssss', $user, $title, $date, $time, $content, $flag);
	$stmt->execute();
	$stmt->close();
	echo json_encode(array(
		"success" => true
	));
	exit;
}

?>
