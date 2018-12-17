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
	$user = $_POST["username"];

	$stmt = $mysqli->prepare("DELETE FROM event WHERE username = ?");
	if (!$stmt) {
					echo json_encode(array("success" => false, "message" => "Query Prep Failed"));
					exit;
				}

	$stmt->bind_param('s', $user);
	if(!$stmt->execute()){
		echo json_encode(array("success" => false, "message" => "Failed to delete events of this user"));
		exit;
	}
	$stmt = $mysqli->prepare("DELETE FROM user WHERE username = ?");
	if (!$stmt) {
					echo json_encode(array("success" => false, "message" => "Query Prep Failed"));
					exit;
				}

	$stmt->bind_param('s', $user);
	if($stmt->execute()){
		echo json_encode(array("success" => true));
		exit;
	}
}

?>
