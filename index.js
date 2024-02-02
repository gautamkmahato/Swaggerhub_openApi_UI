const express = require('express');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const mySchema = require('./mydata.json');

const app = express();

let myJSON = {};
const uri = [];
const httpMethods = [];
const outputResponses = [];
const finalOutput = [];

app.get('/', async(req, res) => {
    try{
        let schema = await $RefParser.dereference(mySchema);

        const len = Object.keys(mySchema.paths).length;
        for(let i=0; i<len; i++){
            const path = Object.keys(mySchema.paths)[i];
            uri.push(path);
            httpMethods.push(Object.keys(mySchema.paths[path]))
        }

        for(let i=0; i<uri.length; i++){
            myJSON[uri[i]] = httpMethods[i];
        }
        console.log(myJSON);

        for(let x in myJSON){
            const arr = myJSON[x];
            for(let i=0; i<arr.length; i++){
                const outArr = [];
                outArr.push(x);
                outArr.push(arr[i]);
                if(schema.paths[x][arr[i]]["responses"]["200"]){
                    outputResponses.push(schema.paths[x][arr[i]]["responses"]["200"]["content"]);
                    outArr.push(schema.paths[x][arr[i]]["responses"]["200"]["content"]);
                }
                finalOutput.push(outArr);
            }
        }

    } catch(err){
        console.log(err);
    }

    res.send(finalOutput);
});

app.listen(3000, () =>{
    console.log("Server is running on PORT 3000...")
});
