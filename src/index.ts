import { bool, Canister, int, float64, query, text, update, Void, Principal, ic, Some, None, StableBTreeMap, Vec, nat8, Record } from 'azle';
import { HttpResponse, HttpTransformArgs, managementCanister } from 'azle/canisters/management';

//arreglo de int de 21 elementos que representa las respuestas de la evaluacion


const Registro = Record({
    aplicante: Principal,
    //tutor: Principal,
    respuestas: Vec(nat8),
    puntaje: float64,
    fecha: text,
    aprobado: bool,
});

let registros = StableBTreeMap(Principal, Registro, 0);

///canister parea manejar los registros, modificaciones y consultas de los registros de las evaluaciones a tutor
export default Canister({
    registrar: update([Vec(nat8), text], bool, (respuestas, fecha) => {
        // const aplicante = ic.caller();
        //const tutor = ic.selfAuthenticating(registro.tutor);

        //se calcula el puntaje
        let puntaje = 0;
        for (let i = 0; i < respuestas.length; i++) {
            puntaje += respuestas[i];
        }
        puntaje = puntaje / respuestas.length;

        //se crea el registro
        const registro: typeof Registro = {
            aplicante: ic.caller(),
            //tutor: tutor,
            respuestas: respuestas,
            puntaje: puntaje,
            fecha: fecha,
            aprobado: puntaje >= 4,
        };

        //se agrega el registro
        registros.insert(ic.caller(), registro);

        //se imprime en consola el registro
        console.log('Se creó registro de aplicación de eval a tutor: ', registro);

        return puntaje >= 4;


    }),
    //se obtienen los registros de un aplicante
    obtenerRegistros: query([], Vec(Registro), () => {
        return registros.values();
    }),
});

