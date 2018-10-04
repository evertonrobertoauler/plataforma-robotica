/*
  Script executa as seguintes operações:
  - Aguarda a chegada de um novo programa
  - Valida as instruções do programa
  - Atualiza o status do Programa para Inválido ou Válido para execução
*/

import * as firebaseService from './modulos/firebase-service';

import { Status } from '../../interface/src/compartilhado/config';
import { validarPrograma } from '../../interface/src/compartilhado/validador';

import { firebaseCert, firebasePublic } from './config';

firebaseService.inicializar(firebaseCert, firebasePublic);

iniciarValidador().catch(err => console.error(err));

async function iniciarValidador() {
  while (true) {
    const snapshot = await firebaseService.obterProximoPrograma(Status.Enviado);

    console.log('Validando: ', snapshot.key, snapshot.val());

    try {
      validarPrograma(snapshot.val().programa);
      console.log('Válido: ', snapshot.key);
      await firebaseService.atualizarPrograma(snapshot, { status: Status.Validado });
    } catch (e) {
      console.log('Inválido: ', snapshot.key);
      await firebaseService.atualizarPrograma(snapshot, {
        status: Status.Rejeitado,
        motivo: e
      });
    }
  }
}
