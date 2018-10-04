/*
  Script executa as seguintes operações:
  - Aguarda a chegada de um novo programa valido para Execução
  - Inicia a gravação do video
  - Envia as instruções para o braço robótico
  - Finaliza a gravação do video
  - Envia o video para o Amazon S3
  - Atualiza o status do programa para Finalizado e associa o link para o video armazendado no S3.
*/

import * as firebaseService from './modulos/firebase-service';
import * as camera from './modulos/camera';
import * as braco from './modulos/braco';

import { firebaseCert, firebasePublic, serial } from './config';

import { Status } from '../../interface/src/compartilhado/config';

firebaseService.inicializar(firebaseCert, firebasePublic);
braco.inicializar(serial);

iniciarExecutor().catch(err => console.error(err));

async function iniciarExecutor() {
  while (true) {
    // Aguarda até que sejá Adicionado e Validado um programa para iniciar a Execução
    const snapshot = await firebaseService.obterProximoPrograma(Status.Validado);

    console.log('Iniciando: ', snapshot.key);

    // Atualiza o Status do programa para Executando
    await firebaseService.atualizarPrograma(snapshot, { status: Status.Executando });

    let nmArquivo = `videos/${snapshot.key}.ogv`;

    // Inicia o seguinte comando no Terminal Linux:
    // ffmpeg -y -i /dev/video0 -s 320x240 -codec:v libtheora -qscale:v 7 -codec:a libvorbis -qscale:a 5 videos/nmArquivo.ogv
    let ffmpeg = camera.iniciarGravacao(nmArquivo);

    // Adicionando 1 segundo no inicio do video
    await camera.delay(1000);

    // Instruções do programa são enviados para o braço robótico, via comunicação Serial com o Arduino
    await braco.executarPrograma(snapshot.val().programa);
    console.log('finalizou execucao');

    // Adicionando 1 segundo no final do video
    await camera.delay(1000);

    // Comando Linux ffmpeg finalizado
    camera.finalizarGravacao(ffmpeg);
    console.log('finalizou gravacao');

    // Arquivo .ogv enviado e armazenado no Storage do Firebase
    let dsUrl = await firebaseService.enviarVideo(nmArquivo);
    console.log('enviou video');

    // Status do programa atualizado como Finalizado e Link para o video associado ao programa.
    await firebaseService.atualizarPrograma(snapshot, {
      status: Status.Finalizado,
      video: dsUrl
    });

    console.log('Finalizando: ', snapshot.key);
  }
}
