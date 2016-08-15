import { Editor } from '../../common/services/editor.service';
import * as angular from 'angular';

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
      $ctrl.programas = programas.map(v => v).reverse();
    });
  };
}

