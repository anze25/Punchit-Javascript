<?php
include_once ('db.php');

$query = $_POST['query'];

if(mysqli_query($conn,$query))
  echo "Vnos je urejen.";
else
  echo"Posodobitev ni uspela!!!";