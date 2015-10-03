<?php

$pjName = $_POST['projectName'];
$content = $_POST['content'];
$message = array();

if (!isset($pjName) || !isset($content)) {
    $message['success'] = false;
    $message['message'] = 'The project name AND the content must be specified';
    echo json_encode($message);
    exit();
} else {
    $myfile = fopen("./assets/saves/" . $pjName . ".html", "w");
    fwrite($myfile, $content);
    fclose($myfile);
    $message['success'] = true;
    $message['message'] = 'The project has been saved';
    echo json_encode($message);
}