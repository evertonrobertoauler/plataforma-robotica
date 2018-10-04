import { instrucoes } from '../../../interface/src/compartilhado/config';

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

let port;
let readline;

export function inicializar(serial) {
  port = new SerialPort(serial, { baudRate: 9600 });
  readline = port.pipe(new Readline({ delimiter: '\r\n' }));
}

export async function executarPrograma(programa) {
  for (const [instrucao, valor] of programa) {
    console.log(instrucao, valor);
    const instrucoesArduino = [...instrucoes[instrucao], valor];
    console.log(instrucoesArduino);
    await escreverNaSerial(instrucoesArduino);
    await lerRetornoSerial();
  }

  await escreverNaSerial(instrucoes.fim);
  await lerRetornoSerial();
}

function escreverNaSerial(instrucoes) {
  return Promise.all(
    instrucoes.map(instrucao => {
      return new Promise((resolve, reject) => {
        port.write(instrucao + '', e => (e ? reject(e) : resolve(e)));
      });
    })
  );
}

function lerRetornoSerial() {
  return new Promise((resolve, reject) => {
    const fn = data => {
      if ((data || '').trim() === 'p') {
        resolve(data);
      } else {
        reject('sem retorno');
      }
    };

    readline.once('data', fn);
  });
}
