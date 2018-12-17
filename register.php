<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';

 if(empty($_POST['username']) || empty($_POST['password'])) {
    echo json_encode(array("success" => false, "message" => "Username or password cannot be null"));
    exit;
} else if(!preg_match('/^[\w_\.\-]+$/', $_POST['username'])) {
	echo json_encode(array("success" => false, "message" => "Invalid username"));
    exit;
}
if(isset($_POST['username']) && isset($_POST['password'])) {
    $username = "";
    $username = $_POST['username'];
    $password = crypt($_POST['password']);

    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM user WHERE username=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($cnt);
    $stmt->fetch();
    $stmt->close();

    if($cnt == 1){
        echo json_encode(array("success" => false, "message" => "Username already exists, please change one"));
    	exit;
    }else{
    	$_SESSION['token'] = substr(md5(rand()), 0, 10);
        $stmt = $mysqli->prepare("insert into user (username, crypted_password) values (?, ?)");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            }

        $stmt->bind_param('ss', $username, $password);

        $stmt->execute();

        $stmt->close();
        echo json_encode(array("success" => true,"token" => $_SESSION["token"], "username" => $username));
        exit;
    }
            
}
?> 