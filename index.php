<?php
session_start();

if(!isset($_SESSION["username"])){
  header("location: login/login.php");
  exit;
}
$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />
  <title>PunchIt</title>
  <link rel="stylesheet" href="css/jquery.mobile-1.4.5.css">
  <link rel="stylesheet" href="css/jquery.datetimepicker.min.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/tableexport.min.css">
  <script src="js/jquery.js"></script>
    <script src="js/jquery.mobile-1.4.5.js"></script>
  <!--<script src="js/script.js"></script>-->
  <script type="text/javascript" src="js/script.js"></script>

  <script src="js/tableexport.js"></script>
  <script src="js/FileSaver.js"></script>
  <script src="js/jquery.table2excel.js"></script>
<!--  <script src="js/printThis.js"></script>-->

  <script>
      $("#tabela").table2excel({
          exclude: ".excludeThisClass",
          name: "Worksheet Name",
          filename: "SomeFile" //do not include extension
      });
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.print/1.6.0/jQuery.print.js"></script>

</head>

<body>


<!-- Prva stran -->
<div data-role="page" id="home">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>
  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#statistics" data-transition="none"   data-icon="edit" >Pregled</a></li>
      <li><a href="#export" data-transition="none" data-icon="edit" >Izvoz</a></li>
      <?php  if (isset($_SESSION['username'])) : ?>
    
   <li><a href="login/logout.php" data-transition="none" data-icon="home"><?php echo $username ?></a></li>
  <?php endif ?>
    </ul>
  </div>
  <div role="main" class="ui-content">


    <form id="punchForm" action="db/punchesInsert.php" method="post">
      <h2 id="timeElapsed"> </h2>
      <h3 id="prisoten"></h3>
      <button id="prihod" class="ui-btn ui-btn-inline">Vpiši se</button>
      <button id="odhod" class="ui-btn ui-btn-inline">Izpiši se</button>
    </form>

  </div><!-- /content -->

  <footer data-role="footer" data-theme="b">
    <h4>Punch It &copy; 2019</h4>
  </footer>
</div><!-- /page -->


<!-- Podstran za pregled vnosov -->
<div data-role="page" id="statistics">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>
  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#"  data-icon="edit" >Osveži</a></li>
      <li><a href="#export" data-transition="none" data-icon="edit" >Izvoz</a></li>
    </ul>
  </div>

  <div role="main" class="ui-content">
    <h3>Dobrodošli na prvi strani Punch It aplikacije</h3>
    <p>S pomočjo Punch It aplikacije lahko spremljate prihode in odhode z dela.</p>

    <h3>Pregled vpisov in izpisov</h3>


    <ul id="stats" data-role="listview"  data-filter="true" data-filter-placeholder="Filtriraj po datumu ali opisu dela." data-inset="true" ></ul>
    <br>
    <button id="clearPunches"  data-theme="b">Zbriši vse vpise</button>
    <button id="save-btn">Save Text file</button>


  </div><!-- /content -->

  <footer data-role="footer" data-theme="b">
    <h4>Punch It &copy; 2019</h4>


  </footer>
</div><!-- /page -->

<!-- Start of second page -->
<div data-role="page" id="add">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>
  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#statistics" data-transition="none" data-icon="edit" >Pregled</a></li>
      <li><a href="#export" data-transition="none" data-icon="edit" >Izvoz</a></li>
    </ul>
  </div>


  <div role="main" class="ui-content">
    <h3>Dodaj vnos</h3>

    <form id="addForm">

      <label for="addPunchIn">Prihod: </label>
      <input type="text" data-role="datetime" class="datetime" id="addPunchIn" data-inline="true">

      <label for="addPunchOut">Odhod: </label>
      <input type="text" data-role="datetime" class="datetime" id="addPunchOut" data-inline="true">

      <label for="addDesc">Opis dela: </label>
      <input type="text" id="addDesc">


      <button id="submitAdd" class="ui-btn ui-btn-b ui-corner-all" >Potrdi</button>
    </form>
  </div><!-- /content -->

  <footer data-role="footer" data-theme="b">
    <h4>Punch It &copy; 2019</h4>
  </footer>
</div><!-- /page -->


<div data-role="page" id="edit">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>

  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#statistics" data-transition="none" data-icon="edit" >Pregled</a></li>
      <li><a href="#export" data-transition="none" data-icon="edit" >Izvoz</a></li>
    </ul>
  </div>

  <div data-role="ui-content">
    <h3>Popravi vnos</h3>
    <form id="editForm">
      <label for="editDesc">Opis dela </label>
      <input type="text" id="editDesc">

      <label for="editPunchIn">Prihod: </label>
      <input type="text" data-role="datetime" class="datetime" id="editPunchIn" data-inline="true">

      <label for="editPunchOut">Odhod: </label>
      <input type="text" data-role="datetime" class="datetime" id="editPunchOut" data-inline="true">


      <button id="submitEdit" class="ui-btn ui-btn-b ui-corner-all" >Popravi</button>
    </form>
  </div>


  <footer data-role="footer" data-theme="b">
    <h4>Punch It &copy; 2019</h4>
  </footer>
</div>

<!-- Podstran za export vnosov -->
<div data-role="page" id="export">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>
  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#statistics" data-transition="none" data-icon="edit" >Pregled</a></li>
      <li><a href="#import" data-transition="none" data-icon="edit" >Uvoz</a></li>
    </ul>
  </div>

  <div role="main" class="ui-content">

    <p>Izberi časovno obdobje za izpis potrdila.</p>

    <form id="filterPunches">

      <label for="filterStart">Od: </label>
      <input type="text" data-role="date" class="date" id="filterStart" data-inline="true">

      <label for="filterEnd">Do: </label>
      <input type="text" data-role="datetime" class="date" id="filterEnd" data-inline="true">

      <button id="exportTable">Ustvari potrdilo o opravljenih urah</button>
    </form>
    <div class="printReport">
      <div class="potdilo">
        <!--<h2 STYLE="text-align: left">POTRDILO O OPRAVLJENH URAH</h2>-->
      </div>

      <table id="tabel" class="ui-table table-bordered ">
        <thead>
        <tr >
          <th style="width: 6% ">št.</th>
          <th style="width: 11% ">datum</th>
          <th style="width: 9% ">od</th>
          <th style="width: 9% ">do</th>
          <th style="width: 28% ">opis dela</th>
          <th style="width: 16% ">skupaj št.ur</th>
          <th style="width: 21% ">opombe</th>
        </tr>

        </thead>

        <tbody>
        <tr style="height: 8.6mm"></tr>
        </tbody>
        <tfoot>

        </tfoot>
      </table>
      <div class="podpis">
        <!--<h2 STYLE="text-align: left">Podpis</h2>-->
      </div>
    </div>
    <button type="button" class="print">Print!</button>

    <!--<ul id="stats" data-role="listview" data-filter="true" data-filter-placeholder="Filtriraj po datumu ali opisu dela." data-inset="true"></ul>-->
    <button id="btn" class="ui-btn">Export to xls</button>

  </div><!-- /content -->

  <footer data-role="footer" data-theme="b">

    <h4>Punch It &copy; 2019</h4>


  </footer>
</div><!-- /page -->

<!-- Podstran za import CSV-ja -->
<div data-role="page" id="import">

  <header data-role="header" data-theme="b">
    <h1>Punch It</h1>
  </header>
  <div data-role="navbar">
    <ul>
      <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
      <li><a href="#add" data-transition="none" data-icon="plus" >Vpis</a></li>
      <li><a href="#statistics" data-transition="none" data-icon="edit" >Pregled</a></li>
      <li><a href="#export" data-transition="none" data-icon="edit" >Izvoz</a></li>
    </ul>
  </div>

  <div role="main" class="ui-content">

    <p>Uvoz csv datoteke.</p>

    <input type="file">

    <p>Uvoz json datoteke</p>
    <button id="backupJson">Backup</button>



  </div><!-- /content -->

  <footer data-role="footer" data-theme="b">

    <h4>Punch It &copy; 2019</h4>


  </footer>
</div><!-- /page -->

</body>
<script src="js/jquery.datetimepicker.full.js"></script>
<script src="js/importCsv.js"></script>
<script>
    $('#btn').click(function () {
        $('.printReport').table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "Potrdilo o opravljenih urah " + new Date().getFullYear() + '_' + new Date().getMonth(),
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    });
</script>
<script>

    //samo za uro
    $('.date').datetimepicker({
        timepicker:false,
        format: 'Y/m/d'


    });


    $('.datetime').datetimepicker({
        locale: 'ru',
        maxTime:0,
        maxDate:0

    });
</script>


</html>