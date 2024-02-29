<?php
session_start();
  include_once ('db.php');
  

    // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

// 2) Query database for data
//--------------------------------------------------------------------------
//  $user_id = 1;
  $username = 'anze20';
  $result = mysqli_query($conn, "SELECT * FROM punches WHERE username='$username'");          //query
  $array = [];


  while($enr = mysqli_fetch_assoc($result)){
    $a = array('description'=>$enr['description'],'punchin'=>$enr['punchin'],'punchout'=>$enr['punchout'],'punch_id'=>$enr['punch_id'],'username'=>$enr['username']);
    array_push($array, $a);
  }

//--------------------------------------------------------------------------
// 3) echo result as json
//--------------------------------------------------------------------------
echo json_encode($array);



