var request = require("request");
require('dotenv').config()
var config = require('config');
var uuid = require('uuid');

function create( req, resp){
   resp.render ( 'property/create', {});

}

function save(req, resp){
    console.log ( req.body.location );
    var requestBody = { Name: "PropertyCreated",  Payload:{} , EventId: uuid.v1() };
    var location = req.body.location ;
    var promoter = req.body.promoter ;
    var rooms = req.body.rooms ;
    var nameArray = location.placeName.split(",")
    
    

    switch (nameArray.length){

        case 1 : 
        case 2 :  
        case 3 : requestBody.Payload.name= 'UNDEFINED' ; break; 
        case 4 : requestBody.Payload.fullname = location.placeName ;
                 requestBody.Payload.name = nameArray[0]
                 
        
    }

    if ( requestBody.Payload.name == 'UNDEFINED'){
        resp.end (" Please select a valid property" );
    }else {
        var coordinatesArray = location.coordinates.slice(1, location.coordinates.length -1).split(",")
        requestBody.Payload.coordinates = { lat: Number(coordinatesArray[0]) , lng: Number(coordinatesArray[1]) }
        requestBody.Payload.placeid = location.placeId ;
        requestBody.Payload.propertyId  = coordinatesArray[0] + "," + coordinatesArray[1] ;
        requestBody.Payload.promoter = promoter ;
        requestBody.Payload.rooms = Number(rooms) ;
        
    }


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
            resp.end ("Unable to add property due to error in back end") ;
        }else {
            if ( body.error){
                console.log ( body )
                resp.end ("Unable to add property due to error in back end") ;
            }else {
                console.log('Success: ', body);
                resp.end ("Successfully added property: " + requestBody.Payload.name) ;
            }
            
        }
    
    });

    
}

module.exports= {
    create:create ,
    save:save 
}