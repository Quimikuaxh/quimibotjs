const { Client, Pool } = require('pg');

//https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/

const pool = new Pool({
    user: 'example',
    host: 'example',
    database: 'example',
    password: 'example',
    port: 5432
});
pool.on('error', (err, client) => {
    console.error('Error:', err);
});

//client.connect();

//------------------------------------------------------------------------

function setNabosBBDD(usuario, momento, precio){
    var d = new Date()
    var res = '';
    
    var dia = d.getDate()
    var mes = d.getMonth()+1
    var anyo = d.getFullYear()

    if(dia<10){
        dia = '0' + dia
    }

    if(mes<10){
        mes = '0' + mes
    }

    var fecha = dia+'/'+mes+'/'+anyo
    console.log(getDiaDeLaSemana())
    if(getDiaDeLaSemana() == "Domingo" && momento == "tarde"){
        return 'Hoy es domingo, no se pueden vender nabos \uD83D\uDE14'
    }else{
        var query = "SELECT * FROM \"NABOS\" n WHERE n.usuario = '" + usuario.toLowerCase() + "' AND FECHA = '" + fecha + "' AND MOMENTO = '" + momento + "'"
        pool.connect()
        .then(client => {
            client.query(query)
                .then(res => {
                    if(res.length == 0){
                        client.query("INSERT INTO \"NABOS\" (USUARIO, FECHA, MOMENTO, PRECIO) VALUES ($1, $2, $3, $4)", [usuario, fecha, momento, precio])
                            .then(res => {
                                res = 'Precio añadido con éxito.'
                                //Eliminar predicciones
                            })
                            .catch(err => {
                                client.release()
                                console.error(err);
                            })
                    }else{
                        client.query("UPDATE \"NABOS\" SET PRECIO = $4 WHERE USUARIO = $1 AND FECHA = $2 AND MOMENTO = $3", [usuario, fecha, momento, precio])
                            .then(res => {
                                res = 'Precio actualizado con éxito.'
                                //Eliminar predicciones
                            })
                            .catch(err => {
                                client.release()
                                console.error(err);
                            })
                    }
                })
                .catch(err => {
                    client.release()
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
            client.release()
        });
        return res
    }
    
}

function getDiaDeLaSemana(){
    var d = new Date();
    var n = d.getDay();

    var dia = ''
    if(n == 1){
        dia = "Lunes"
    }else if(n == 2){
        dia = "Martes"
    }else if(n == 3){
        dia = "Miércoles"
    }else if(n == 4){
        dia = "Jueves"
    }else if(n == 5){
        dia = "Viernes"
    }else if(n == 6){
        dia = "Sábado"
    }else if(n == 0){
        dia = "Domingo"
    }

    return dia
}

function getChampionById(id){
    const resultado = pool.connect().then(client => {
        return client.query("SELECT * FROM \"LOLCHAMPION\" n WHERE n.championId = $1", [id])
        .then(res => {
            client.release();
            return res.rows[0];
            //console.log(res.rows[0]);
        })
        .catch(e => {
            client.release();
            console.log(e.stack);
        })
    })
    return resultado;
}

module.exports = {
    setNabosBBDD: setNabosBBDD,
    getChampionById: getChampionById
};