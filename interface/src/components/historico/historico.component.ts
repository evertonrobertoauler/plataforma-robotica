import { Editor } from '../../common/services/editor.service';
import * as angular from 'angular';
import {statusDescription, blocos} from '../../compartilhado/config';
import * as moment from 'moment';

export const historico: angular.IComponentOptions = {
  template: require('./historico.component.html'),
  controller: HistoricoController
};

HistoricoController.$inject = ['Editor'];

function HistoricoController(editor: Editor) {
  const $ctrl = this;

  $ctrl.$onInit = () => {

    const programas = editor.obterProgramas();

    programas.$watch(() => {
      $ctrl.programas = programas.map(programa => {
        return {
          dataEnvio: moment(decodeId(programa.$id)).format('DD/MM/YYYY HH:mm:ss'),
          status: statusDescription[programa.status],
          video: programa.video,
          instrucoes: programa.programa.map(i => `${blocos[i[0]][2]} - ${i[1]}º`).join(', ')
        };
      }).reverse();
    });
  };

  $ctrl.PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  function decodeId(id) {
    id = id.substring(0, 8);
    let timestamp = 0;
    for (let i = 0; i <= 7; i++) {
      timestamp = timestamp * 64 + $ctrl.PUSH_CHARS.indexOf(id.charAt(i));
    }
    return new Date(timestamp);
  }
}

