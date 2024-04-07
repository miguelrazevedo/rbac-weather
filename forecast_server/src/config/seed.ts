import connectDB from './db';
import forecast_vienna from '../../../API/forecast/Austria/forecast_vienna.json';
import forecast_brussels from '../../../API/forecast/Belgium/forecast_brussels.json';
import forecast_prague from '../../../API/forecast/Czech_Republic/forecast_prague.json';
import forecast_copenhagem from '../../../API/forecast/Denmark/forecast_copenhagen.json';
import forecast_liubliana from '../../../API/forecast/Eslovenia/forecast_liubliana.json';
import forecast_paris from '../../../API/forecast/France/forecast_paris.json';
import forecast_berlin from '../../../API/forecast/Germany/forecast_berlin.json';
import forecast_rome from '../../../API/forecast/Italy/forecast_rome.json';
import forecast_luxembourg from '../../../API/forecast/Luxembourg/forecast_luxembourg.json';
import forecast_amsterdam from '../../../API/forecast/Netherlands/forecast_amsterdam.json';
import forecast_oslo from '../../../API/forecast/Norway/forecast_oslo.json';
import forecast_braga from '../../../API/forecast/Portugal/forecast_braga.json';
import forecast_coimbra from '../../../API/forecast/Portugal/forecast_coimbra.json';
import forecast_famalicao from '../../../API/forecast/Portugal/forecast_famalicao.json';
import forecast_faro from '../../../API/forecast/Portugal/forecast_faro.json';
import forecast_lisbon from '../../../API/forecast/Portugal/forecast_lisbon.json';
import forecast_oporto from '../../../API/forecast/Portugal/forecast_oporto.json';
import forecast_viana from '../../../API/forecast/Portugal/forecast_viana.json';
import forecast_madrid from '../../../API/forecast/Spain/forecast_madrid.json';
import forecast_bern from '../../../API/forecast/Switzerland/forecast_bern.json';
import forecast_london from '../../../API/forecast/United_Kingdom/forecast_london.json';
import { Forecast } from '../models/forecastRecordModel';

(async function () {
    console.log('FORECAST: Seeding database');
    connectDB();

    let array: any = [];
    array.push(forecast_vienna);
    array.push(forecast_brussels);
    array.push(forecast_prague);
    array.push(forecast_copenhagem);
    array.push(forecast_liubliana);
    array.push(forecast_paris);
    array.push(forecast_berlin);
    array.push(forecast_rome);
    array.push(forecast_luxembourg);
    array.push(forecast_amsterdam);
    array.push(forecast_oslo);
    array.push(forecast_braga);
    array.push(forecast_coimbra);
    array.push(forecast_famalicao);
    array.push(forecast_faro);
    array.push(forecast_lisbon);
    array.push(forecast_oporto);
    array.push(forecast_viana);
    array.push(forecast_madrid);
    array.push(forecast_bern);
    array.push(forecast_london);

    await Forecast.insertMany(array);
    console.log('FORECAST: DONE');
    process.exit(0);
})();