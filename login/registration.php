<?php
/*
Author: Javed Ur Rehman
Website: http://www.allphptricks.com/
*/
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Registration</title>
<link rel="stylesheet" href="css/style.css" />
</head>
<body>
<?php
	require('db.php');
    // If form submitted, insert values into the database.
    if (isset($_REQUEST['username'])){
		$username = stripslashes($_REQUEST['username']); // removes backslashes
		$username = mysqli_real_escape_string($con,$username); //escapes special characters in a string
//		$email = stripslashes($_REQUEST['email']);
//		$email = mysqli_real_escape_string($con,$email);
		$password = stripslashes($_REQUEST['password']);
		$password = mysqli_real_escape_string($con,$password);


        $query = "INSERT into `users` (username, password) VALUES ('$username', '".md5($password)."')";
        $result = mysqli_query($con,$query);
        if($result){
            echo "<div class='form'><h3>Registracija je bila uspešna.</h3><br/>Za prijavo klikni tukaj <a href='login.php'>Prijava</a></div>";
        }
    }else{
?>
<div class="form">
<h1>Registration</h1>
<form name="registration" action="" method="post">
<input type="text" name="username" placeholder="Username" required />

<input type="password" name="password" placeholder="Password" required />
<input type="submit" name="submit" value="Register" />
</form>
<br /><br />

<?php } ?>
</body>
</html>
