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
		"message" => "Request forgery detected."
	));
    exit;
}else if (empty($_POST['title']) || empty($_POST['content']) || empty($_POST['date']) || $_POST['flag'] == "null") {
	echo json_encode(array(
		"success" => false,
		"message" => "Please fill in all blanks"
	));
    exit;
}else{
	$stmt = $mysqli->prepare("UPDATE event SET title=?, content=?, date=?, time=?, flag=? WHERE id = ?");
	if (!$stmt) {
					$err = "Query Prep Failed";
					echo json_encode(array("success" => false, "message" => $err));
	                exit;
	            }

	$eventid = $_POST['eventid'];
	$title = $_POST['title'];
	$content = $_POST['content'];
	$time = $_POST['time'];
	$date = $_POST['date'];
	$flag = $_POST['flag'];

	$stmt->bind_param('ssssss', $title, $content, $date, $time, $flag, $eventid);
	if($stmt->execute()){
		echo json_encode(array(
		"success" => true
		));
		exit;
	}
	
}


?>
