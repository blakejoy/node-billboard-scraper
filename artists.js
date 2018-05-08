const cheerio = require('cheerio');
const request = require('request');
const nodemailer = require('nodemailer');

cmd_artists = [];
bb_artists = [];

const url = "https://www.billboard.com/charts/rap-song";
let transporter = nodemailer.createTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
        user: 'test@bjoynes.com',
        pass: ''
    }
});





//command line args to artists array
for (var i = 2; i < process.argv.length ; i++) {
    cmd_artists[i-2] = process.argv[i];
}

request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        $('div.chart-row__title').each(function(i,element){

            var artist = $(this).children("a.chart-row__artist").text().trim();

            if (artist == ""){
                artist = $(this).children("span.chart-row__artist").text().trim();
            }


            var song = $(this).children("h2.chart-row__song").text().trim();

            bb_artists.push({"artist": artist,"song": song});

        });

sendEmail(checkArtists());
    }

});





function sendEmail(array){
if(array == ""){
 console.log("No artists found or specified")
}else{
    //Enter nodemailer stuff

    var subject = "Your artist(s) are: " + cmd_artists.join(', ');
    var text = "";


    array.forEach(function(element) {
        text += '<strong>' + element["artist"] + '</strong>:' + '<i>' + element["song"] + '</i><br>';
    });


    let mailOptions = {
        from: '"Tester" <@bjoynes.com>',
        to: '@gmail.com',
        subject: subject,
        text: text,
        html: text,
    }


transporter.sendMail(mailOptions, (error,info) => {
    if (error){
        return console.log(error);
    }


    console.log('Message sent');

    });
}


}


function checkArtists(){
    results_match = [];
    for(var j = 0; j < cmd_artists.length;j++){
        for(var i = 0;i < bb_artists.length;i++ ){

            if (bb_artists[i]["artist"].match(cmd_artists[j])){
                results_match.push(bb_artists[i]);
            }

        }
    }
    return results_match;
}