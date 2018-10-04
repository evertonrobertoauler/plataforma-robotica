import { Usuario } from './usuario.service';
import { Firebase } from './firebase.service';
import { Status } from '../../compartilhado/config';
import { validarPrograma } from '../../compartilhado/validador';

export class Editor {
  static $inject = ['Usuario', 'Firebase'];

  public workspace;

  constructor(private usuario: Usuario, private firebase: Firebase) {}

  public submeterPrograma() {
    const dados = {
      usuario: this.usuario.id,
      programa: this.blocklyParser(),
      status: Status.Enviado
    };

    validarPrograma(dados.programa);

    return this.firebase
      .createRef('programas')
      .push(dados)
      .then((data: any) =>
        this.firebase.createRef(`historico/${this.usuario.id}/${data.key}`).set(dados)
      ) as Promise<any>;
  }

  public obterProgramas() {
    const ref = this.firebase.createRef(`historico/${this.usuario.id}`);
    return this.firebase.loadArray(ref.orderByKey().limitToLast(10));
  }

  private blocklyParser() {
    const blocks = this.workspace.getTopBlocks(true);

    if (!blocks.length) {
      throw 'Adicione uma ou mais operações no programa!';
    } else if (blocks.length > 1) {
      throw 'Todas as operações devem estar em um bloco só!';
    } else {
      return this.blockParser(blocks[0]);
    }
  }

  private blockParser(block) {
    const child = block.childBlocks_.length && block.childBlocks_[0];
    return [numberInput(block)].concat(child ? this.blockParser(child) : []);
  }
}

function numberInput(block) {
  const valor = block.inputList[0].fieldRow[1].text_;

  if (/^\d+$/.test(valor)) {
    return [block.type, parseInt(valor)];
  } else {
    const label = block.inputList[0].fieldRow[0].text_;
    throw `Preencha o campo '${label}' com um valor numérico!`;
  }
}
