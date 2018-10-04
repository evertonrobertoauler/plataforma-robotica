import * as angular from 'angular';
import { blocos } from '../compartilhado/config';

declare const Blockly: any;

export function blocklyConfig() {
  angular.forEach(blocos, (config, key) => {
    const [valorDefault, cor, label] = config;

    Blockly.Blocks[key] = {
      init() {
        let vm: any = this;
        vm.appendDummyInput()
          .appendField(label)
          .appendField(new Blockly.FieldAngle(valorDefault), 'graus')
          .appendField('graus');
        vm.setPreviousStatement(true);
        vm.setNextStatement(true);
        vm.setColour(cor);
        vm.setTooltip('');
      }
    };
  });
}
