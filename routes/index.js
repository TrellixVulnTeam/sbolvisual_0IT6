const express = require('express'),
    JsonLdParser = require('jsonld-streaming-parser').JsonLdParser,
    jsonParser = new JsonLdParser(),
    // jsonld = require('jsonld'),
    ParserJsonld = require('@rdfjs/parser-jsonld'),
    parserJsonld = new ParserJsonld(),
    Readable = require('stream').Readable,
    //fs = require('fs'),
    java = require('java'),
    router = express.Router();


router.use(express.urlencoded({extended: true}));
router.use(express.json());


router.all('/', (req, res) => {
    const sboldata = req.body.sboldata;
    if (typeof sboldata !== 'undefined') parser(sboldata);


    // list(detailed);

    res.setHeader('Cache-Control', 'no-cache');

    res.render('index', {
        description: 'SBOL Visual Homepage',
        language: 'en-GB',
        data: {author: 'Jake Sumner', university: 'Keele University'},
        title: 'SBOL Visual',
        tagline: 'SBOL Visual is a web-based visualisation tool',
        keywords: ['SBOL', 'Visualisation', 'Synthetic Biology', 'SBOL v3', 'Glyph Creator'],
        copyright: 'Jake Sumner &copy; 2020',
        sboldata: sboldata,
        textarea: res.sendFile(__dirname + '/public/java/libSBOLj3/output/entity/collection/collection.jsonld') //fix
        //send array list with list data that then uses the built in loop system of ECTjs to parse the data into their own cards
    });


});


function parser(data) {
    // jsonParser.on('context', console.log);
    // jsonParser.on('data', console.log);
    // jsonParser.write(data);
    // jsonParser.end();

        formatter(data);


    let testparse = JSON.parse(data);

    for (let b in testparse) {
        // console.log(b,"\n");
        if (b === "@graph") {
            for (let c in testparse[b]) {
                //formatter(testparse[b][c]); //TODO: need to parse context in as well
                //TODO: add to array and call array whilst adding to context, reform json data and then send through formatter
            }

        }
        // else if (b === "@context"){
        //     console.log(testparse[b]);
        // }


        //if typeof context set context to this value
        //if typeof graph, for each send through parser with given context
        //console log to check
    }
    for (let b in testparse) {
        if (b === "@context") {
        //    console.log(testparse[b]);
        }
    }


    // console.log(dataArray);
}

function formatter(data) {
    let dataArray = {};

    const input = new Readable({
        read: () => {
            input.push(data);
            input.push(null);
        }
    });
    const output = parserJsonld.import(input);



    output.on('data', sbol => {
        console.log(sbol);

        // setValue(sbol.predicate," : ",sbol.object);
        //  console.log(sbol.predicate," : ",sbol.object);


        dataArray[sbol.predicate.value] = sbol.object.value; //find correct grouping

       // list(false, dataArray);

    });
}

function list(detailed, data) {
    console.log(data, "\n\n");

    if (!detailed) {
        // for (let attribute in data) {
        //     if (typeof attribute === "http://sbols.org/v3#displayId") {
        //         let displayID = data[attribute];
        //         setValue(displayID,"typeof");
        //     }
        //     if (attribute === "http://sbols.org/v3#role") {
        //         let role = data[attribute];
        //         getGlyph(role);
        //         setValue(role);
        //     }
        //     if (attribute === "http://sbols.org/v3#type") {
        //         let type = data[attribute];
        //         getGlyph(type);
        //         setValue(type);
        //     }
        //     if (attribute === "http://sbols.org/v3#description") {
        //         let description = data[attribute];
        //         setValue(description);
        //     }
        //     if (attribute === "http://sbols.org/v3#elements") {
        //         let elements = data[attribute];
        //         setValue(elements);
        //     }
        // }

    } else if (detailed) {
        for (let attribute in data) {
            if (attribute === "http://sbols.org/v3#elements") {
                console.log(attribute, ":", data[attribute]);
            }
        }
        // Array.forEach((item) => {
        //     let list = item.whole.value;
        //
        // })
    }
}

function getGlyph(glyph) {
    console.log("glyph: ", glyph);
}

function setValue(value) {
    console.log("Object", value);

}


module.exports = router;

/*
POST recieved, data parsed to json-ld format
data then sent through API to get correct glyph type
and other details relating to the glyph for the list view
data sent back to parser where it will rendered in router request
and displayed in the correct locations, using the view engine.
Make repeatable


 */
