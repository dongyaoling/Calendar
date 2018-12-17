<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
require 'database.php';

if(isset($_POST['username']) && isset($_POST['password']) && !empty($_POST['username']) && !empty($_POST['password'])) {
	session_start();
	$username = "";
	$username = $_POST['username'];

	//no input
	if( !preg_match('/^[\w_\.\-]+$/', $username) ) {
		echo json_encode(array(
			"success" => false,
			"message" => "Invalid Username"
		));
		exit;        
	}
	
	$stmt = $mysqli->prepare("SELECT COUNT(*), crypted_password FROM user WHERE username=?");
	if (!$stmt) {
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit;
	}
	$stmt->bind_param('s', $username);
	$stmt->execute();
	$stmt->bind_result($cnt, $pwd_hash);
	$stmt->fetch();
	$pwd_guess = $_POST['password'];

	if ($cnt == 1 && crypt($pwd_guess, $pwd_hash) == $pwd_hash) {
		$_SESSION['username'] = $username;
		$_SESSION['token'] = substr(md5(rand()), 0, 10);
		echo json_encode(array('success' => true, "token" => $_SESSION["token"], "username" => $username));
		exit;
	} else {
		echo json_encode(array('success' => false, "message" => "Incorrect Username or Password"));
	}

	$stmt->close();
}
    
?>