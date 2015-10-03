<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$pjName = $_POST['projectName'];
if (is_file("./assets/saves/$pjName")) {
    echo json_encode(unlink("./assets/saves/$pjName"));
} else {
    echo json_encode(false);
}