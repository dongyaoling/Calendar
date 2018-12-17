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
}else{
	$eventid = (int)($_POST['eventid']);
	
	$user = $_SESSION["username"];

	$stmt = $mysqli->prepare("DELETE FROM event WHERE id = ?");
	if (!$stmt) {
					echo json_encode(array("success" => false, "message" => "Query Prep Failed"));
					exit;
				}

	$stmt->bind_param('i', $eventid);
	if($stmt->execute()){
		echo json_encode(array("success" => true, "eventid" => $eventid));
		exit;
	}
}

?>
