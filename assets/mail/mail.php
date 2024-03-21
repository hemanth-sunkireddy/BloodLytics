<?
$name = $_POST{'name'};
$subject = $_POST{'subject'};
$email = $_POST{'email'};
$message = $_POST['message'];

$email_message = "

Name: ".$name."
Subject: ".$subject."
Email: ".$email."
Message: ".$message."

";

mail ("example@gmail.com" , "New Message", $email_message);
header("location: ../../mail-success.html");
?>


