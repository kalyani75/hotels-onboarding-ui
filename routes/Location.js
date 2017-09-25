var request = require("request");
require('dotenv').config()
var config = require('config');
var uuid = require('uuid');

function create( req, resp){
    resp.render ( 'location/create', {});

}

function save(req, resp){
    console.log ( req.body.location );
    var requestBody = { Name: "LocationCreated",  Payload:{} , EventId: uuid.v1() };
    var location = req.body.location ;
    var nameArray = location.placeName.split(",")
    
    
    switch (nameArray.length){

        case 1 : 
        case 2 :  requestBody.Payload.name= 'UNDEFINED' ; break; 
        case 3 : requestBody.Payload.name = nameArray[0] ;
                 requestBody.Payload.fullname = location.placeName;
                 requestBody.Payload.city = requestBody.Payload.name; requestBody.Payload.state = nameArray[1] ; requestBody.Payload.country = nameArray[2];
                 break ;
        case 4 : requestBody.Payload.name = nameArray[0] ;
                requestBody.Payload.fullname = location.placeName;
                 requestBody.Payload.city = nameArray[1] ; requestBody.Payload.state = nameArray[2] ; requestBody.Payload.country = nameArray[3];
                 break ;
        case 5 : requestBody.Payload.name = nameArray[0] ;
                requestBody.Payload.fullname = location.placeName;
                 requestBody.Payload.city = nameArray[2] ; requestBody.Payload.state = nameArray[3] ; requestBody.Payload.country = nameArray[4];
                  break ;
        case 6 : requestBody.Payload.name = nameArray[0] ;
                requestBody.Payload.fullname = location.placeName;
                 requestBody.Payload.city = nameArray[3] ; requestBody.Payload.state = nameArray[4] ; requestBody.Payload.country = nameArray[5];
                   
        
    }

    if ( requestBody.Payload.name == 'UNDEFINED'){
        resp.end (" Please select a city or place" );
    }else {
        var coordinatesArray = location.coordinates.slice(1, location.coordinates.length -1).split(",")
        requestBody.Payload.coordinates = { lat: Number(coordinatesArray[0]) , lng: Number(coordinatesArray[1]) }
        requestBody.Payload.placeId = location.placeId ;
        requestBody.Payload.locationId = coordinatesArray[0] + "," + coordinatesArray[1] ;
        
    }

    callAPIEndpoint( requestBody, resp)
    //updateDataFile( requestBody.Payload , resp)
    
}

function callAPIEndpoint( requestBody , resp){

     var options = { method: 'POST',
    url:  process.env.API_HOST +  '/api/Events',
    headers: 
    { accept: 'application/json',
        'content-type': 'application/json',
        'x-ibm-client-secret': process.env.API_SECRET,
        'x-ibm-client-id': process.env.API_KEY },
    body:  requestBody,
    json: true };

    request(options, function (error, response, body) {
        if (error) {
            console.error('Failed: %s', error.message);
            resp.end ("Unable to add location due to error in back end") ;
        }else { 
            if ( body.error){
                console.log ( body )
                resp.end ("Unable to add location due to error in back end") ;
            }else {
                console.log('Success: ', body);
                resp.end ("Successfully added location: " + requestBody.Payload.name) ;
            }
        }
    
    });

}

function updateDataFile( Payload, resp){

    var fs = require('fs');
    let separator = ';' ;
    let imageURL = 'images/hotels/H-101.jpg' ;
    var stream = fs.createWriteStream("./locations.csv", { encoding: 'utf8', flags:'a'});
    //stream.once('open', function(fd) {
        // name, acname, area, city, state, country 
        stream.write("\n" +  Payload.placeId + separator +  Payload.fullname + separator + 
        Payload.name + separator + Payload.name.toLowerCase() + separator +  
         Payload.city + separator + Payload.state + separator +
        Payload.country + separator + imageURL + separator + Payload.coordinates.lat + separator + 
        Payload.coordinates.lng  );
        
        stream.end();
        console.log('Success: ');
        resp.end ("Successfully added property: " + Payload.name) ;
    //});
}


module.exports= {
    create:create ,
    save:save 
}