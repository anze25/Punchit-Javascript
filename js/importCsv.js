// Import CSV from WorkClock app


const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function (e) {
    // console.log(input.files);
    let readerOrig = new FileReader();
    let reader = readerOrig;
    csvObject = [];
    let userId = 1;
    let username = 'anze20';





    reader.onload = function () {
        let lines = reader.result.split('\n').map(function (line) {

            return line.split(',');
        });


        csvObject.push(lines);


        for (var i = 0; i < lines.length; i++) {

            var desc = lines[i][6];
            if (desc!=null) {
                // desc = desc.replace(/"/g, "").replace("12", '12').replace("14", '14"').replace("8", '8"');
                desc = desc.replace(/"/g, "").replace('12"', '12').replace('14"', '14').replace('8"', '8');
            }
            if (desc === '' || desc == null) {
                desc = 'Sodišče Kern';
            }

            var punchin = Date.parse(lines[i][0]);
            if (isNaN(punchin)) {
                punchin = 1;
            }
            var punchout = Date.parse(lines[i][1]);
            if (isNaN(punchout)) {
                punchout = 1;
            }
/*

            var punch = {
                description: desc,
                punchin: punchin,
                punchout: punchout,
                username: username
            };*/
            $.post( "../db/punchesInsert.php",{ query: `INSERT INTO punches (description, punchin, punchout, username ) VALUES ('${desc}', '${punchin}', '${punchout}', '${username}')` } )
                .done(function( data ) {
                })
            ;
            ;
        }

       /* localStorage.setItem('punches', JSON.stringify(punches));*/
        alert('Uvoz je uspel');
       window.location.href = "#statistics";

        location.reload();


    };
    reader.readAsText(input.files[0]);
},false);
