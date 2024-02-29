<?php
include_once ('db.php');




$query = $_POST['query'];

if(mysqli_query($conn,$query))
  echo "Vnosi so zbrisani.";
else
  echo"Vnosi niso izbrisani!!!";