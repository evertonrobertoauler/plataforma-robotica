import { spawn } from 'child_process';

// ffmpeg -y -i /dev/video0 -s 320x240 -codec:v libtheora -qscale:v 7 -codec:a libvorbis -qscale:a 5 video.ogv

const FFMPEG_PARAMS = [
  '-y',
  '-i',
  '/dev/video0',
  '-s',
  '320x240',
  '-codec:v',
  'libtheora',
  '-qscale:v',
  '7',
  '-codec:a',
  'libvorbis',
  '-qscale:a',
  '5'
];

export async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function iniciarGravacao(arquivo) {
  return spawn('ffmpeg', [...FFMPEG_PARAMS, arquivo]);
}

export function finalizarGravacao(ffmpeg) {
  ffmpeg.stdin.write('q');
}
