require('dotenv').config();

const Command = require('./command');
const request = require('request');


module.exports = class Departs extends Command {

    static match (message) {
        return message.content.startsWith('!departs');
    }

    static action(message) {
        let args = message.content.split(' ');
        args.splice(0,1);
        let param = args.join('%20');
        let paramString = param.replaceAll('%20', ' ');

        request('https://' + process.env.NAVITIA_TOKEN + '@api.sncf.com/v1/coverage/sncf/pt_objects?q=' + param + '&type=stop_area',
            {'json': true},
            (err, res, body) => {
                if (err) {
                    return console.error(err);
                }

                if (typeof body.pt_objects === 'undefined') {
                    message.channel.send({embed: {
                            color: 0xFFA142,
                            title: 'Départs de ' + paramString,
                            description: 'Cette gare est introuvable - Vérifiez son orthographe'
                        }});
                } else {
                    let stopId = body.pt_objects[0].id;

                    request('https://' + process.env.NAVITIA_TOKEN + '@api.sncf.com/v1/coverage/sncf/stop_areas/' + stopId + '/departures?datetime=20210117T080000',
                        {'json': true},
                        (err, res, body) => {
                            if (err) {
                                return console.error(err);
                            }

                            let responseMessage = '';

                            body.departures.forEach((item, index) => {
                                if (item.code !== '' && index < 6) {

                                    let departureTimeString = item.stop_date_time.departure_date_time;
                                    let convertedTime = departureTimeString.slice(9, 11) + ':' + departureTimeString.slice(11,13);
                                    let direction = item.display_informations.direction;

                                    direction = direction.slice(0, direction.indexOf('('));

                                    responseMessage = responseMessage + ':train2: ' + item.display_informations.commercial_mode
                                        + ' ' + item.display_informations.code + ' (' +  item.display_informations.trip_short_name + ') - Direction ' + direction + ' :clock1: '
                                        + convertedTime + '\n'
                                }
                            })

                            message.channel.send({embed: {
                                    color: 0x34B7EB,
                                    title: 'Départs de ' + paramString,
                                    description: responseMessage
                                }});
                        });
                }


        });
    }

};