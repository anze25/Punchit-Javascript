<?php
session_start();
$username = trim(json_encode($_SESSION['username']), '"'); // dobimo username iz sessiona in odstranimo ""
print $username;