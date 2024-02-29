<?php
session_start();
  include_once ('db.php');
  

    // Check connection
  if ($conn->connect_error) {
    die("Povezava ni uspela zaradi: " . $conn->connect_error);
  }

// 2) Query database for data
//--------------------------------------------------------------------------
//  $user_id = 1;
 $username =  $_SESSION['username'];
 $array = [];
  $result = mysqli_query($conn, "SELECT * FROM users WHERE username='".$username."'");          
//   $query = mysqli_fetch_object($result);
while($enr = mysqli_fetch_assoc($result)){
    $a = array('id'=>$enr['id'],'username'=>$enr['username'],'fullname'=>$enr['fullname']);
    array_push($array, $a);
  }
 
  


  

//--------------------------------------------------------------------------
// 3) echo result as json
//--------------------------------------------------------------------------
echo json_encode($array);
