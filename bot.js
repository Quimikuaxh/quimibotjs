const { Telegraf } = require('telegraf')
const CovidAPI = require('./covid')
const DB = require('./db.js')

const bot = new Telegraf('Token')
bot.start((ctx) => ctx.replyWithMarkdown('Hola, soy Quimibot, ¡y hago un montón de cosas! Entre ellas, puedo hacer las siguientes:\n\n' +
                    '*ANIMAL CROSSING:* \n' +
                    "*/nabos [persona] [mañana/tarde] [cantidad] |* Almaceno la cantidad de bayas que ofrecen por tus nabos hoy en el momento que me digas.\n" +
                    "*/nabos [persona] |* Te digo toda la información de esta semana sobre el precio de los nabos en tu isla que me hayas indicado. \n" +
                    "*/nabos ahora |* Te digo los precios de los nabos en todas las islas para las que me hayan dado sus precios. \n" +
                    "*/prediccion [persona] |* Te digo una predicción de a cuánto pueden comprarse los nabos en tu isla durante la semana, en función de la información que me hayas dado.\n\n" +

                    "*POKÉMON:*\n" +
                    "*/pokemon [nombre] |* Te digo los tipos del Pokémon que me pidas.\n\n" +

                    "*LEAGUE OF LEGENDS:*\n" +
                    "*/maestrias [nombreInvocador] |* Te digo el top 5 de campeones por puntos de maestría del invocador.\n\n" +

                    "*Otros:*\n" +
                    '*/covid |* Te digo los diez países con más casos de COVID-19 actualmente'))

bot.command('covid', (ctx) => {
    ctx.reply('Calculando los resultados, espere...')
    console.log('Solicitando datos...')
    
    const asyncApiCall = async() => {
        const response = await CovidAPI.getCovid()
        return response 
    }

    asyncApiCall().then(response => {
        console.log('Datos obtenidos.')
            
        var count = 1
        var mensaje = 'TOP 10 PAÍSES CON COVID:\n\n'

        for(count; count<=10; count++){
            mensaje += count+' - '+response.data['data'][count]['Country']+': Casos: '+response.data['data'][count]['Total Cases']+', Casos nuevos: '+response.data['data'][count]['New Cases']+'\n'
        }

        ctx.reply(mensaje)
    })
    
})

bot.command('nabos', (ctx) => {
    var trozos = ctx.update.message.text.split(' ')
    for(texto of trozos){
        console.log(texto)
    }
    console.log("------------------------")
    console.log("Validacion 1: "+(trozos[2] == "mañana"))
    console.log("Validacion 2: "+(trozos[2] != "tarde"))
    console.log("Validacion 3: "+(isNaN(trozos[3])))
    if(trozos.length == 4){
        if((trozos[2] != "mañana" && trozos[2] != "tarde") || isNaN(trozos[3])){
            ctx.reply("Los parámetros enviados no cumplen el formato esperado. Para saber todo lo que puedo hacer, usa el comando /start")
        }else{
            var res = DB.setNabosBBDD(trozos[1], trozos[2], trozos[3])
            ctx.reply(res)
        }
    }
})
bot.command('campeon', (ctx) => {
    var trozos = ctx.update.message.text.split(' ');
    for(texto of trozos){
        console.log(texto)
    }
    const resultado = DB.getChampionById(trozos[1]).then(res => {
        console.log(res)
        ctx.reply(res['championname'])
    });
    
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))