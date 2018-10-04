import * as admin from 'firebase-admin';
import { join } from 'path';
import { unlink } from 'mz/fs';

interface IDados {
  status?: number;
  motivo?: string;
  video?: string;
}

function programas(key?: string) {
  return admin.database().ref(join('programas', key || ''));
}

function historico(key?: string) {
  return admin.database().ref(join('historico', key || ''));
}

export function inicializar(cert: any, config: any) {
  admin.initializeApp({
    credential: admin.credential.cert(cert),
    projectId: config.projectId,
    databaseURL: config.databaseURL,
    storageBucket: config.storageBucket
  });
}

export async function obterProximoPrograma(status: number) {
  return programas()
    .orderByChild('status')
    .equalTo(status)
    .once('child_added');
}

export async function atualizarPrograma(snapshot, dados: IDados) {
  const [key, programa] = [snapshot.key, snapshot.val()];
  const update = Object.assign(programa, dados);

  return Promise.all([
    programas(key).update(update),
    historico(join(programa.usuario, key)).update(update)
  ]);
}

export async function enviarVideo(nmArquivo) {
  const bucket = admin.storage().bucket();
  const opcoes = { destination: nmArquivo };
  const arquivo = (await bucket.upload(nmArquivo, opcoes))[0];
  await unlink(nmArquivo);
  return (await arquivo.getSignedUrl({ action: 'read', expires: '01-01-2300' }))[0];
}
