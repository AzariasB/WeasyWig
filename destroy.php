<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$pjName = $_POST['projectName'];
$absPath = "./assets/saves/$pjName.html";
if (is_file($absPath)) {
    echo json_encode(unlink($absPath));
} else {
    echo json_encode(false);
}