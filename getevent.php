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

if(!isset($_POST['token']) || $_SESSION['token'] !== $_POST['token']){
echo json_encode(array(
	"success" => false,
	"message" => "Request forgery detected."
));
exit;
}


$year = $_POST['year'];
$month = $_POST['month'];
$user = $_POST['username'];
$chosen = $_POST['chosen'];
if($chosen == "null"){
	$stmt = $mysqli->prepare("SELECT id, title, content, Day(date), Month(date), Year(date), time, date, flag FROM event WHERE (username, Year(date), Month(date)) = (?, ?, ?)");
	if (!$stmt) {
					$err = "Query Prep Failed";
					echo json_encode(array("success" => false, "message" => $err));
					exit;
				}

	$stmt->bind_param('sss', $user, $year, $month);
}else{
	$stmt = $mysqli->prepare("SELECT id, title, content, Day(date), Month(date), Year(date), time, date, flag FROM event WHERE (username, Year(date), Month(date), flag) = (?, ?, ?, ?)");
	if (!$stmt) {
					$err = "Query Prep Failed";
					echo json_encode(array("success" => false, "message" => $err));
					exit;
				}

	$stmt->bind_param('ssss', $user, $year, $month, $chosen);
}
if($stmt->execute()){
	$stmt->bind_result($id, $title, $content, $day, $getmonth, $getyear, $time, $getdate, $flag);
	$events = array();
	while($stmt->fetch()){
		$events[] = array(
			"id" => $id,
			"title" => $title,
			"content" => $content,
			"date" => $getdate,
			"day" => $day,
			"month" => $getmonth,
			"year" => $getyear,
			"time" => $time,
			"flag" => $flag
		);
	}

	echo json_encode(array("success" => true, "events" => $events));
	exit;
}
?>
