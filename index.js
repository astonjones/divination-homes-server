require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { Client, APIErrorCode } = require("@notionhq/client")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/health', (req, res) => {
  res.send({level: "info", message: "healthy"})
})

/*
This endpoint is to put a lead from website into notion and notify a persons 
Properties we are looking for in the html form
    property_address: string,
    name: string,
    phone_number: number/string,
    appSecret: string */
app.post('/contact', async (req, res) => {
    const databaseId = process.env.NOTION_WEBSITE_LEAD_DB_ID;
    if(req.body.appSecret == process.env.SERVER_SECRET){
        try {
            // get phone from user data
            let parsedPhone
            if(req.body.phone_number != null){
                parsedPhone = Number(req.body.phone_number)
            } else {
                parsedPhone = 0
            }
            const notion = new Client({ auth: process.env.NOTION_SECRET })
    
            const response = await notion.pages.create({
                parent: {
                    database_id: databaseId,
                },
                properties: {
                    "Phone": {
                        "type": "number",
                        "number": parsedPhone
                    },
                    "Address": {
                        "type": "rich_text",
                        "rich_text": [
                            {
                                "type": "text",
                                "text": {
                                    "content": req.body.property_address,
                                    "link": null
                                }
                            }
                        ]
                    },
                    "Name": {
                        "id": "title",
                        "type": "title",
                        "title": [
                            {
                                "type": "text",
                                "text": {
                                    "content": req.body.name,
                                },
                            }
                        ]
                    },
                }
            });
            console.log({level:'info', message:'An entry has been added to the database.'});
            res.sendStatus(200);
    
        } catch (error) {
            if (error.code === APIErrorCode.ObjectNotFound) {
                console.log({level: 'error', message: 'Error retrieving API key. Check the API key for notion and try again.'});
            } else {
                console.error({level: 'error', message:'500 error. Error coming from /contact endpoint', error});
            }
        }
    } else {
        console.log({level: 'info', message: 'app conflict - not the correct secrete was used to try to access the server.'})
        res.send(200);
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})