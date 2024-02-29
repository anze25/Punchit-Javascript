<?php
$conn = mysqli_connect('localhost', 'root', '', 'punchit');

$db = mysqli_select_db($conn, 'punches');
