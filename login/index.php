<?php
/*
Author: Javed Ur Rehman
Website: http://www.allphptricks.com/
*/

include("auth.php"); //include auth.php file on all secure pages ?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Prijava uspešna</title>
<link rel="stylesheet" href="css/style.css" />
    <script src="js/jquery.mobile-1.4.5.js"></script>
</head>
<body>
<div class="form">
<p>Živjo <?php echo $_SESSION['username']; ?>!</p>
<p>Uspešno si prijavljen.</p>
<p><a href="../index.php">Vstop</a></p>
<a href="logout.php">Odjava</a>

</div>
</body>
</html>
