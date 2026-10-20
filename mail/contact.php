<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok'=>false]);
    exit;
}
$name=trim($_POST['name']??'');
$email=trim($_POST['email']??'');
$phone=trim($_POST['phone']??'');
$message=trim($_POST['message']??'');
if(!$name || !$message || !filter_var($email,FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok'=>false,'message'=>'Please complete all required fields.']);
    exit;
}
$to='admin@lyttonconstruction.co.zw';
$subject='Website enquiry from '.preg_replace('/[\r\n]+/',' ',$name);
$body="Name: $name\nEmail: $email\nPhone: $phone\n\n$message";
$headers='From: website@lyttonconstruction.co.zw' . "\r\n" . 'Reply-To: '.$email;
$sent=@mail($to,$subject,$body,$headers);
if(!$sent) {
    http_response_code(500);
    echo json_encode(['ok'=>false]);
    exit;
}
echo json_encode(['ok'=>true]);

