'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = 'EAAEzchpLAesBACuYDdI7LGNzvyvTnG3KYu42OGTz0wl1hadcXgUX50dhd0hCRGSZBRN2vGQtK4MH3X56jgMWZBCItDkK09EBlSg9oPvc0GPMhZBGx1qG0htovUaZAjVEl6rfVBSas6x92rtJYMYQoBFi3KxE3c0GVvGlmBFtKziahbdmrQdy';
const app = express();

app.set('port', (process.env.PORT || 8989));
app.use(bodyParser.json());

app.get('/', function(req, response) {
    response.send('Hola Mundo...!!!');
})

app.get('/webhook', function(req, response) {
    if (req.query['hub.verify_token'] === 'pugpizza_token') {
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Lo sentimos esta aplicacion no te da permisos...!!!');
    }
})

app.post('/webhook', function(req, res) {
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
})

function handleEvent(senderId, event) {
    if (event.message) {
        handleMessage(senderId, event.message)
    } else if (event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event) {
    if (event.text) {
        defaultMessage(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event);
    }
}

function handleAttachments(senderId, event) {
    let attachments_type = event.attachments[0].type;

    console.log(event);
    switch (attachments_type) {
        case "image":
            console.log(attachments_type);
            break;
        case "video":
            console.log(attachments_type);
            break;
        case "audio":
            console.log(attachments_type);
            break;
        case "file":
            console.log(attachments_type);
            break;
        default:
            console.log(attachments_type);
            break;
    }
}

function handlePostback(senderId, payload) {
    console.log(payload);
    switch (payload) {
        case "GET_STARTED_PINCAY":
            const messageData = {
                "recipient": {
                    "id": senderId
                },
                "message": {
                    "text": "Hola 🙂 ¿Cómo podemos ayudarte? Por favor da clic la opción deseada. Gracias."
                }
            }
            senderActions(senderId);
            callSendApi(messageData);
            break;
        case "REPUESTO_PAYLOAD":
            showRepuesto(senderId);
            break;
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                }
            }
        }
    }
    callSendApi(messageData);
}

function showLocations(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [{
                        "title": "Sucursal Orquideas",
                        "image_url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                        "subtitle": "Av. Fco. de Orellana en el redondel de las Orquideas",
                        "buttons": [{
                            "type": "web_url",
                            "title": "Ver en el mapa",
                            "url": "https://www.google.com/maps/place/AUTOREPUESTOS+PINCAY/@-2.0912418,-79.9134012,20z/data=!4m5!3m4!1s0x902d133f651a7dad:0x671ee6065086afe7!8m2!3d-2.0910418!4d-79.9131761",
                            "webview_height_ratio": "tall"
                        }]
                    }]
                }
            }
        }
    }
    callSendApi(messageData);
}

function contactSupport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola este es el canal de soporte, quieres llamarnos?",
                    "buttons": [{
                        "type": "phone_number",
                        "title": "Llamar a un asesor",
                        "payload": "+593994390983"
                    }]
                }
            }
        }
    }
    callSendApi(messageData);
}

function defaultMessage(senderId) {
    console.log('Default Messanger');
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola 🙂 ¿Cómo podemos ayudarte? Por favor da clic la opción deseada. Gracias.",
            "quick_rplies": [{
                    "content_type": "text",
                    "title": "Quieres cotizar un repuesto...?",
                    "payload": "REPUESTO_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Quieres saber donde estamos...?",
                    "payload": "UBICACION_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Quieres aplicar a nuestra ofertas laborales...?",
                    "payload": "REPUESTO_PAYLOAD"
                }
            ]
        }
    }
    console.log(messageData);
    senderActions(senderId);
    callSendApi(messageData);
}

function callSendApi(response) {
    request({
            "uri": "https://graph.facebook.com/me/messages",
            "qs": {
                "access_token": access_token
            },
            "method": "POST",
            "json": response
        },
        function(err) {
            if (err) {
                console.log('Ha ocrurrido un error...!!!')
            } else {
                console.log('Mensaje enviado...!!!')
            }
        }
    )
}

function showRepuesto(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                            "title": "Peperoni",
                            "subtitle": "Con todo el sabor del peperoni",
                            "image_url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                            "buttons": [{
                                "type": "postback",
                                "title": "Eleguir Peperoni",
                                "payload": "PEPERINO_PAYLOAD"
                            }]
                        },
                        {
                            "title": "Pollo BBQ",
                            "subtitle": "Con todo el sabor del pollo",
                            "image_url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                            "buttons": [{
                                "type": "postback",
                                "title": "Eleguir pollo",
                                "payload": "POLLO_PAYLOAD"
                            }]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function sizePizza(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [{
                            "title": "Individual",
                            "subtitle": "Porcion para una sola persona",
                            "image_url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                            "buttons": [{
                                "type": "postback",
                                "title": "Elegir Individual",
                                "payload": "INDIVIDUAL_SIZE_PAYLOAD"
                            }]
                        },
                        {
                            "title": "Familiar",
                            "subtitle": "Porcionas para toda la familia",
                            "image_url": "https://ktar.com/wp-content/uploads/2017/09/national-pepperoni-pizza-day-phoenix-620x370.jpg",
                            "buttons": [{
                                "type": "postback",
                                "title": "Elegir familiar",
                                "payload": "FAMILIAR_SIZE_PAYLOAD"
                            }]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

app.listen(app.get('port'), function() {
    console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})