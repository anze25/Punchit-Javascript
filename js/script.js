/**
 * Created by anze2 on 16. 02. 2019.
 *
 */


$(document).one('pageinit', function (e) { // zato damo one, da se naloži samo enkrat

    

    e.preventDefault();
    let elapsedTime =  $('#timeElapsed'); // polje v katerem se prikazuje pretečen čas na delovnem mestu, default je 00:00
    let alreadyIn = localStorage.getItem('currentIn'); // določitev spremenljivke, če v localstorage obstaja kljuc 'currentIn'
    let localStor = localStorage.getItem('punches');
    let backup = localStorage.getItem('backup');



    getUsername();
    getUserFullName();
    let username = localStorage.getItem('username');
    let userFullName = localStorage.getItem('fullname');

    
    // Prikaz gumba za vpis oz.izpis
    if (alreadyIn) {
        $('#prihod').hide();
        $('#odhod').show();
    } else {
        $('#prihod').show();
        $('#odhod').hide();
    }

    // Spremenjljivke za kreiranje backup.json datoteke
    let punchesTxt = localStorage.getItem('punches');
    let jsonPunches = JSON.stringify(punchesTxt, null, 2);





    let desc = 'Računi'; // default opis opravljenega dela

    let punchesForExport = [];
    let total = [];
    
    $('#refresh').on('tap', function () {
        location.reload();
    });

    // Prikaz vseh vnosov določenega userja pod Statistiko
    showPunchesDB();
    
    function getUsername() {
        
        $.ajaxSetup({cache: false})
        $.get('../db/getsession.php', function (data) {
         let username = data;
        localStorage.setItem('username', username);
            
        });
    }


    function getUserFullName() { // Fullname od uporabnika dobimo iz tabele users in sicer glede na username uporabnika.
        $.ajax({
           
            url : '../db/userFullName.php', // my php file
            type : 'GET', // type of the HTTP request
            dataType: 'json',

            success : function(data){
           
                
                for (var i = 0; i < data.length; i++) {


                // Podatki iz array-a
                let fullname = data[i]["fullname"];
                localStorage.setItem('fullname', fullname);
                }
                

            }
        });

    }


    // Backup import vnosev iz backup.json datoteke
    $('#backupJson').on('click', function (e) {
        e.preventDefault();
        clearPunches();

        readJson();

    } );
    






    /*
     * Ustvari trenutne vrednosti vnosa za potrebe urejanja
     */
    function setCurrent () {
        // Set localstorage items
        localStorage.setItem('currentPunchId', $(this).data('punch_id'));
        localStorage.setItem('currentDescription', $(this).data('description'));
        localStorage.setItem('currentPunchIn', $(this).data('punchin'));
        localStorage.setItem('currentPunchOut', $(this).data('punchout'));


        // Insert form fields
        var localDesc = localStorage.getItem('currentDescription');
        var localPunchInMs = new Date(parseInt(localStorage.getItem('currentPunchIn')));
        var localPunchOutMs = new Date(parseInt(localStorage.getItem('currentPunchOut')));



        $('#editDesc').val(localDesc);
        $('#editPunchIn').val(localPunchInMs);
        $('#editPunchOut').val(localPunchOutMs);

    }

    // Določitev ali je ob zagonu programa, uporabnik prijavljen ali ne
    if (alreadyIn) {


        let punchIn = localStorage.getItem('currentIn');
        let now = Date.now();
        let diff = now - punchIn;

        function timeIt() {
            let punchIn = localStorage.getItem('currentIn');
            let now = Date.now();
            let diff = now - punchIn;

            elapsedTime.html(msToTime(diff));
            console.log(diff);

        }
        setInterval(timeIt, 2000);


        var punchInTimeString = new Date(parseInt(alreadyIn));
        var punchInTime = niceTime(punchInTimeString.getHours()) + ':' + niceTime(punchInTimeString.getMinutes());
        var prisoten =  $('#prisoten');
        prisoten.html(`<strong>Prisoten od: </strong>${punchInTime}`);
        $('#flip-6').val('on');

        elapsedTime.html(msToTime(diff));
    }


    // $('#home').on('tap', test);

    // Ročno dodajanje vnosa na gumb VPIS
    $('#submitAdd').on('tap', addPunch);



    // Vpis in izpis s pritiskom na gumb
    $('#punchForm').on('click', function (e) {
        e.preventDefault();

        punch();

    } );

    // Print reporta
    $('.print').on('click', function() {
        $.print(".printReport");

    });

    // Urejanje vnosa
    $('#submitEdit').on('tap', editPunch);


    // Izbris vnosa
    $('#stats').on('tap','#deleteLink', deletePunch);

    // Spremenljivke za urejanje vnosa
    $('#stats').on('tap','#editLink', setCurrent);


    // Izbris vseh vnosov v bazi za trenutnega uporabnika
    $('#clearPunches').on('tap', clearPunches);

    //Izvoz tabele za tisk reporta
    $('#exportTable').on('tap', function (e) {
        e.preventDefault();
        total = [];

        $('tbody').html(''); // počistimo vsebino tabele
        $('.potdilo').html(''); // počistimo vsebino tabele
        $('tfoot').html('');// počistimo vsebino tabele*/
        $('.podpis').html('');// počistimo vsebino tabele*/

        let userFullName = localStorage.getItem('fullname');

        //user = prompt("Prosim vnesi uporabnika za report", user);
        localStorage.setItem('currentUser', userFullName);

        exportTable();

    } );




    /*
     Pregled vseh vnosov v localstorage
     */
    function showPunches() {
        // get punches object


        var punches = getPunchesObject();

        // Check if empty
        if (punches != '' && punches != null) {


            for (var i = 0; i < punches.length; i++) {


                // Podatki iz array-a
                var punchIn = parseInt(punches[i]["punchin"]);
                var punchOut = parseInt(punches[i]["punchout"]);
                var description = punches[i]["description"];
                var punch_id = parseInt(punches[i]["punch_id"]);
                var username = punches[i]["username"];


                var defaultDuration = 28800000;
                var overtime;



                var punchInMS = new Date(punchIn);
                var dayOfWeek = punchInMS.getDay();
                var punchInDate = punchInMS.getUTCDate()  + '.' + (punchInMS.getMonth()+1) + '.' + punchInMS.getFullYear();
                var punchInTime = niceTime(punchInMS.getHours()) + ':' + niceTime(punchInMS.getMinutes());
                var punchOutMS = new Date(punchOut);
                var punchOutTime = niceTime(punchOutMS.getHours()) + ':' + niceTime(punchOutMS.getMinutes());
                var durationMS = new Date(punchOut - punchIn);
                var duration = msToTime(durationMS);
                var overtimeMS = new Date(durationMS - defaultDuration);


                // če je sobota ali nedelja, so vse ure nadure
                if ( dayOfWeek !== 0 && dayOfWeek !== 6) {

                    if (durationMS > defaultDuration) {
                        overtime = msToTime(durationMS - defaultDuration);
                    } else {
                        overtime = msToTime(0);
                    }
                }
                else {
                    overtime = msToTime(durationMS);
                }

             $('#stats').append(
                `<li class="ui-body-inherit ui-li-static">

                    <strong>Datum: </strong>${punchInDate}
                    <br>
                    <strong>Prihod: </strong>${punchInTime} <strong>Odhod: </strong>${punchOutTime}
                    <br>
                    <strong>Opis: </strong>${description}
                    <br>
                    <strong>Trajanje: </strong>${duration} <strong>Nadure: </strong>${overtime}
                    <br>
                    <div class="controls"> 
                        <a href="#edit" id="editLink" data-punch_id=${punch_id} data-description='${description}' data-punchin=${punchIn} data-punchout=${punchOut} >Uredi</a>
                        <a href="#" id="deleteLink" data-punch_id=${punch_id} data-description='${description}' data-punchin=${punchIn} data-punchout=${punchOut}  >Odstrani</a>
                     </div>      
                    
                
                    </li>`);
                }



             $('#home').bind('pageinit', function () {
             $('#stats').listview('refresh');
                 /*location.reload();*/

             });

                } else {
            $('#stats').html('<p>Trenutno ni vpisov.</p>');
        }


    }
    // Pridobivanje vnosov iz mysql tabele
    function showPunchesDB() {
        $.ajax({
           
            url : '../db/punchesView.php', // my php file
            type : 'GET', // type of the HTTP request
            dataType: 'json',

            success : function(data){
                localStorage.setItem('punches', JSON.stringify(data));
                showPunches(); /// prikaz vseh vpisov v podstrani #statistics

            }
        });

    }

    function exportTable() {



        const allPunches = getPunchesObjectAZ();

        var dateStart = Date.parse($('#filterStart').val());
        var dateEnd = Date.parse($('#filterEnd').val()) + (86400000-1);
        let user = localStorage.getItem('fullname').toUpperCase();


        if (allPunches != '' && allPunches != null ) {

            for (var i = 0; i < allPunches.length; i++) {
                // Podatki iz array-a

                var prihod = parseInt(allPunches[i]["punchin"]);
                var odhod = parseInt(allPunches[i]["punchout"]);
                var opis = allPunches[i]["description"];
                var username = allPunches[i]["username"];

                var defaultDuration = 28800000;
                var overtime;
                var opomba;
                var punchInMS = new Date(prihod);
                var punchInDate = punchInMS.getUTCDate()  + '.' + (punchInMS.getMonth()+1) + '.' + punchInMS.getFullYear();
                var dayOfWeek = punchInMS.getDay();
                const monthNames = ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"
                ];


                var punchInTime = niceTime(punchInMS.getHours() +8 ) + ':' + niceTime(punchInMS.getMinutes());

                var punchInOver = niceTime(punchInMS.getHours() ) + ':' + niceTime(punchInMS.getMinutes());
                var punchInovertime = punchInOver;
                var punchOutMS = new Date(odhod);
                var punchOutTime = niceTime(punchOutMS.getHours()) + ':' + niceTime(punchOutMS.getMinutes());
                var durationMS = new Date(odhod - prihod);
                var duration = msToTime(durationMS);
                var overtimeTotal = 0;
                var overtimeMS = new Date(durationMS - defaultDuration);
                var totalOvertime;
                if ( dayOfWeek !== 0 ) {
                    opomba = '';
                }
                else {
                    opomba = 'NEDELJA';
                }


                // če je sobota ali nedelja, so vse ure nadure
                if ( dayOfWeek !== 0 && dayOfWeek !== 6 ) {

                    if (durationMS > defaultDuration) {
                        overtime = msToTime(durationMS - defaultDuration);

                    } else {
                        overtime = msToTime(0);

                    }
                }
                    else {
                        overtime = msToTime(durationMS);

                    }


// Za izpis mora biti postavka znotraj obdobja in pa nadure višje od 30 minut, razen če je sobota ali nedelja.


                if ( dayOfWeek !== 0 && dayOfWeek !== 6 ) {


                    if (dateStart < prihod && dateEnd > odhod && overtimeMS > 1800000 &&  username === username) {
                        totalOvertime = odhod - prihod - defaultDuration;
                        var month = punchInMS.getMonth();
                        var monthName = monthNames[month];

                        var punch = {
                            punchInDate: punchInDate,
                            punchInTime: punchInTime,
                            punchOutTime: punchOutTime,
                            opis: opis,
                            overtime: overtime,
                            opomba: opomba,

                        };

                        punchesForExport.push(punch);
                        total.push(totalOvertime);
                    }
                }
                    else { //sobota in nedelja
                        if (dateStart < prihod && dateEnd > odhod) {
                            totalOvertime = odhod - prihod;
                            var month = punchInMS.getMonth();
                            var monthName = monthNames[month];
                            var punch = {
                                punchInDate: punchInDate,
                                punchInTime: punchInovertime,
                                punchOutTime: punchOutTime,
                                opis: opis,
                                overtime: overtime,
                                opomba: opomba,

                            };
                         /*   var over = {
                                overtimeTotal:totalOvertime
                            }*/
                            punchesForExport.push(punch);
                            total.push(totalOvertime);

                        }
                    }

                }



            $('.potdilo').append(`
                                <h2 STYLE="text-align: left">POTRDILO O OPRAVLJENH URAH</h2>
                                <p><span  style="width: 100%; text-align: left; padding-left: 1em;">delavec (-ka) </span><span id="user">
                                ${user}</span><span style="padding-left: 3em;">mesec: <span style="text-transform: uppercase; text-decoration: underline">${monthName}</span></span></p>`);
                getPunchesForExport();

            $('tfoot').append(
                ` <tr>
                <td colspan="5" style="text-align: right">skupaj ur</td>
                <td colspan="2" style="text-align: left; padding-left: 3em; font-weight: bold" >${getTotal()}</td>

            </tr> `);

            $('.podpis').append(`<span id="signiture" >
                                    <br>
                                
                                    <p><span id="podpis">podpis: </span></p>
                                     
                                    <span id="signitureLine" ></span>
                                </span>`);
            }
        }


    // Spremeni millisecons v hh:mm ( ure so lahko več kot 24)
    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes;
    }
    // Zaokrožanje za potrebe izpisa skupnega števila nadur
    function roundHours(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours ;
    }

    // Funkcija za format 0:00 namesto 0:0
    function niceTime(num) {
        if (num < 10){
            return num = '0'+ num;
        } else {
            return num;
        }
    }



    // Pritisk na gumb vpiši se
    function punch() {
        let alreadyIn = localStorage.getItem('currentIn'); // Ustvarimo spremenljivko za localstorage (currentIn)
        let username = localStorage.getItem('username');

        elapsedTime.html(msToTime(0));

        let desc = 'Računi';

        function convertSeconds(s) {
            var min = Math.floor(s / 60);
            var sec = s % 60;
            return min + ':' + sec;
        }

        if (!alreadyIn ) { // Če uporabnik ni prijavljen


            var timein = localStorage.setItem('currentIn', Date.now());
            var punchInT = localStorage.getItem('currentIn');
            var punchInTimeString = new Date(parseInt(punchInT));
            var punchInTime = niceTime(punchInTimeString.getHours()) + ':' + niceTime(punchInTimeString.getMinutes());
            var prisoten =  $('#prisoten');
            prisoten.html(`<strong>Prisoten od: </strong>${punchInTime}`);

            $('#prihod').hide();
            $('#odhod').show();

        } else {

            var timein = localStorage.getItem('currentIn');

            var timeout = Date.now();


            var punch = {
                description: desc,
                punchin: parseInt(timein),
                punchout: timeout,
                username: username

            };

            var punches = getPunchesObject();
            punches.push(punch);


            $.post( "../db/punchesInsert.php",{ query: `INSERT INTO punches (description, punchin, punchout, username ) VALUES ('${desc}', '${timein}', '${timeout}', '${username}' )` } )
                .done(function( data ) {
                    alert( "Data Loaded: " + data );
                });




            alert('Vnos je potrjen');

            // Set stringified object to local storage
            localStorage.setItem('punches', JSON.stringify(punches));

            localStorage.removeItem('currentIn');

            // Redirect
            window.location.href = "index.php";
            $('#prihod').show();
            $('#odhod').hide();

        }
        return false;
    }



    /*
     * Ustvari punch object
     */
    function addPunch () {

        let alreadyIn = localStorage.getItem('currentIn');
        let punchin = Date.parse($('#addPunchIn').val());
        let punchout = Date.parse($('#addPunchOut').val());
        let desc = $('#addDesc').val();
        
        let username = localStorage.getItem('username');

        let opomba = '';

        if (!punchin && !punchout ) { // Če sta polji za prihod in odhod prazni, ne naredi ničesar
            return false;
        }
        if (!punchin && !alreadyIn) { // Če uporabnik ni prisoten in je polje prihod prazno, ne naredi ničesar
            return false;
        }

        // Get form values

        if (!punchout) { // če imamo samo prihod brez izhoda
            alreadyIn = localStorage.setItem('currentIn', punchin);
            window.location.href = "#home";
            $('#prihod').hide();
            $('#odhod').show();
            location.reload();

        } else if (!punchin && alreadyIn) { // Če nimamo polja prihod, vendar uporabnik je prijavljen, uporabimo alreadyIn

            // ustvari 'punch' object
            var punch = {
                desc: desc,
                punchin: parseInt(alreadyIn),
                punchout: punchout,
                username: username,

            };

            $('#prihod').show();
            $('#odhod').hide();

            var punches = getPunchesObject();



            // Dodaj punch object v punches array
            punches.push(punch);

            alert('Vnos je potrjen');


            // Set stringified object to local storage
            localStorage.setItem('punches', JSON.stringify(punches));
            localStorage.removeItem('currentIn');


            // Redirect
            window.location.href = "index.php";



        } else {

            // ustvari 'punch' object
            var punch = {
                description: desc,
                punchin: punchin,
                punchout: punchout,
                username: username,

            };
            $.post( "..//db/punchesInsert.php",{ query: `INSERT INTO punches (description, punchin, punchout, username ) VALUES ('${desc}', '${punchin}', '${punchout}', '${username}')` } )
                .done(function( data ) {
                    alert( "Data Loaded: " + data );
                });

            $('#prihod').hide();
            $('#odhod').show();
            var punches = getPunchesObject();
            // var attendance = 'off';


            // Dodaj punch object v punches array
            punches.push(punch);

            alert('Vnos je potrjen');


            // Set stringified object to local storage
            localStorage.setItem('punches', JSON.stringify(punches));

            // Redirect
            window.location.href = "index.php";

        }
    }


    /*
     * Edit punch
     */
    function editPunch () {

        // Get current data

        var currentDesc = localStorage.getItem('currentDesc');
        var currentPunchIn = localStorage.getItem('currentPunchIn');
        var currentPunchOut = localStorage.getItem('currentPunchOut');
        var currentPunchId = parseInt(localStorage.getItem('currentPunchId'));




        var punches = getPunchesObject();

        // Loop through punches
        for (var i = 0; i < punches.length; i++) {
            if (punches[i].desc == currentDesc && punches[i].punchin == currentPunchIn && punches[i].punchout == currentPunchOut) {
                punches.splice(i, 1);
            }
            localStorage.setItem('punches', JSON.stringify(punches));
        }


        // Get form values
        var desc = $('#editDesc').val();
        var punchin = Date.parse($('#editPunchIn').val());
        var punchout = Date.parse($('#editPunchOut').val());


       /* // Create 'punch' object // To je samo za localstorage primer
        var update_punch = {
            description: desc,
            punchin: punchin,
            punchout: punchout
        };

        // Add punch to punches array
        punches.push(update_punch);*/



        $.post( "../db/punchesEdit.php",
            { query: `UPDATE punches SET description = '${desc}', punchin = '${punchin}', punchout = '${punchout}' WHERE punch_id=${currentPunchId}` } )
            .done(function( data ) {
                alert(data);
                location.reload();
            })
        ;


        // Set stringified object to local storage
        localStorage.setItem('punches', JSON.stringify(punches));

        // Redirect
        window.location.href = "#statistics";

        return false;

    }
    /*Delete punch
     *
     */

    // Brisanje posameznega vnosa
    function deletePunch () {

        var confirm =window.confirm('Ali res želite zbrisati vnos');

        if (confirm == true) {
            // Set localstorage items

            localStorage.setItem('currentDesc', $(this).data('description'));
            localStorage.setItem('currentPunchIn', $(this).data('punchin'));
            localStorage.setItem('currentPunchOut', $(this).data('punchout'));
            localStorage.setItem('currentPunchId', $(this).data('punch_id'));


            // Get current data

            var currentDesc = localStorage.getItem('currentDesc');
            var currentPunchIn = localStorage.getItem('currentPunchIn');
            var currentPunchOut = localStorage.getItem('currentPunchOut');
            var currentPunchId = parseInt(localStorage.getItem('currentPunchId'));


            var punches = getPunchesObject();

            // Loop through punches
            for (var i = 0; i < punches.length; i++) {
                if (punches[i].description == currentDesc && punches[i].punchin == currentPunchIn && punches[i].punchout == currentPunchOut) {
                    punches.splice(i,1);
                }
                localStorage.setItem('punches', JSON.stringify(punches));
            }

            $.post( "../db/punchesDelete.php",{ query: "DELETE FROM punches WHERE punch_id=" + currentPunchId } )
                .done(function( data ) {
                    alert( data );
                });





            alert('Vnos je bil odstranjen');


            // Redirect

            location.reload();

            return false;


            } else {
            window.location.href = "#statistic";
        }


    }


    // Brisanje vseh vnosov v localstorage
    function clearPunches() {
         let username = localStorage.getItem('username');
        var result =window.confirm('Ali ste prepričani?');
        if (result == true) {
            var confirm =window.confirm('To dejanje bo zbrisalo vse vnose v bazi!');

            if (confirm == true) {
               
                localStorage.removeItem('punches');

                $.post( "../db/punchesDeleteAll.php",{ query: "DELETE FROM punches  WHERE username='" + username + "'"  } )
                    .done(function( data ) {
                        alert( data );
                    });
                $('#stats').html('<p>Trenutno nimate vnosov</p>');
            } else {
                window.location.href = "#statistic";
            }
        } else {
            window.location.href = "#statistic";
        }
    }

    // Seznam punch sortirano po datumu padajoče
    function getPunchesObject() {

        // Set punches array
        //noinspection JSDuplicatedDeclaration
        var punches = [];


        // Get current punches from localStorage
        var currentPunches = localStorage.getItem('punches');

        // Check localStorage
        if (currentPunches != null) {
            // Set to punches
            var punches = JSON.parse(currentPunches);
        }

        // Return punches object
        return punches.sort(function (a, b) {return new Date(parseInt(b.punchin)) - new Date(parseInt(a.punchin))});
        // return punches;
    }

    // Seznam punch sortirano po datumu naraščajoče
    function getPunchesObjectAZ() {
        // Set punches array
        //noinspection JSDuplicatedDeclaration
        var punches = [];

        // Get current punches from localStorage
        var currentPunches = localStorage.getItem('punches');

        // Check localStorage
        if (currentPunches != null) {
            // Set to punches
            var punches = JSON.parse(currentPunches);
        }

        // Return punches object
        return punches.sort(function (a, b) {return new Date(parseInt(a.punchin)) - new Date(parseInt(b.punchin))});
        // return punches;
    }
    function getTotal() {

        var totalOvertime = 0;

        for (var i = 0; i < total.length; i++) {
            totalOvertime = totalOvertime + total[i];

        }
        totalOvertime = totalOvertime - 3600000; // odštejemo 1 uro od skupnih nadur.
        return roundHours(totalOvertime);
    }

    function getPunchesForExport() {


        for (var i = 0; i < 19; i++) {
            if (!punchesForExport[i]) {
                punchesForExport[i] = '';
            }
            var num = i +1;
            var date = punchesForExport[i]["punchInDate"];
            var prihod = punchesForExport[i]["punchInTime"];
            var odhod = punchesForExport[i]["punchOutTime"];
            var opis = punchesForExport[i]["opis"];
            var overtime = punchesForExport[i]["overtime"];
            var opomba = punchesForExport[i]["opomba"];
            var overtimeTotal = parseInt(punchesForExport[i]["overtimeTotal"]);




            if (!date) {
                date = '';
            }
            if (!prihod) {
                prihod = '';
            }
            if (!odhod) {
                odhod = '';
            }
            if (!opis) {
                opis = '';
            }
            if (!overtime) {
                overtime = '';
            }
            if (!opomba) {
                opomba = '';
            }

            if (punchesForExport[i]) {
                num;
            } else {
                num = '';
            }

            $('tbody').append(
                `<tr>
                                     <td>${num}</td>
                                     <td>${date}</td>
                                     <td>${prihod}</td>
                                     <td>${odhod}</td>
                                     <td>${opis}</td>
                                     <td>${overtime}</td>
                                     <td>${opomba}</td>
                            </tr>`);

        }
    }
    // Izvoz vseh vpisov v backup.json datoteko
    $("#save-btn").click(function() {

        let  date = Date.now();
        let datetime = new Date(date);
        datetime = datetime.getUTCDate() + '_' + (datetime.getMonth()+1) + '_' + datetime.getFullYear();

        var blob = new Blob([punchesTxt], {type: "text/plain;charset=utf-8"});
       try { saveAs(blob, "backup.json");}
       catch (err) {
           alert(err.message);
       }
    });

    // Funkcija, ki prebere backup JSON datoteko, če je localstorage prazen
    function readJson() {
        localStorage.removeItem('backup');

        $.ajax({
            url:'../backup.json',
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function (data) {
               localStorage.setItem('backup', JSON.stringify(data));
               insertBackup();


            }
        });


    }

    function insertBackup() {


        var backupPunches = getBackupPunches();
        console.log(backupPunches.length);

        for (var i = 0; i < backupPunches.length; i++) {


            // Podatki iz array-a
            var timein = parseInt(backupPunches[i]["punchin"]);
            var timeout = parseInt(backupPunches[i]["punchout"]);
            var desc = backupPunches[i]["description"];
            var punch_id = parseInt(backupPunches[i]["punch_id"]);


            $.post("../db/punchesInsert.php",
                {query: `INSERT IF NOT EXISTS INTO punches ( punchin, punchout, description, username ) 
                VALUES ('${timein}', '${timeout}','${desc}', '${username}' )`})
                .done(function (data) {

            });

        }


    }
    function getBackupPunches() {
        var backup = [];


        // Get current punches from localStorage
        var backupPunches = localStorage.getItem('backup');

        // Check localStorage
        if (backupPunches != null) {
            // Set to punches
            var backup = JSON.parse(backupPunches);
        }

        // Return punches object
        return backup.sort(function (a, b) {return new Date(parseInt(b.punchin)) - new Date(parseInt(a.punchin))});


    }


});


