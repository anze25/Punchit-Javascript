<?php
include_once ('db.php');

$punchin = $_POST['punchin'];
$punchout = $_POST['punchout'];
$description = $_POST['description'];

if(mysqli_query($conn,"INSERT INTO punches (punchin, punchout, description) VALUES ('$punchin', '$punchout', '$description')"))
  echo "Vnos je uspel";
else
  echo"Vnos ni uspel.";