import * as angular from 'angular';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

(<any>window).firebase = firebase;

import 'angular-material';
import 'angularfire';
import 'angular-ui-router';

import './index.scss';

const ngModule = angular.module('app', ['ngMaterial', 'firebase', 'ui.router']);

import { routesConfig } from './config/routes.config';
import { themingConfig } from './config/theme.config';
import { blocklyConfig } from './config/editor.config';

import { Firebase } from './common/services/firebase.service';
import { Usuario, runOnRouteError } from './common/services/usuario.service';
import { Editor } from './common/services/editor.service';

import { app } from './components/app/app.component';
import { login } from './components/login/login.component';
import { historico } from './components/historico/historico.component';

import { editor } from './components/editor/editor.component';
import { sidenav } from './components/editor/sidenav/sidenav.component';
import { blockly } from './components/editor/blockly/blockly.component';

ngModule
  .value('FIREBASE_CONFIG', {
    apiKey: 'AIzaSyAsFOHIPblybbLyawjyqDMwzo1CTAn0Aw0',
    authDomain: 'plataforma-robotica-eee33.firebaseapp.com',
    databaseURL: 'https://plataforma-robotica-eee33.firebaseio.com',
    projectId: 'plataforma-robotica-eee33',
    storageBucket: 'plataforma-robotica-eee33.appspot.com',
    messagingSenderId: '37524032926'
  })
  .service('Firebase', Firebase)
  .service('Usuario', Usuario)
  .service('Editor', Editor)
  .config(routesConfig)
  .config(themingConfig)
  .config(blocklyConfig)
  .run(runOnRouteError)
  .component('app', app)
  .component('login', login)
  .component('historico', historico)
  .component('editor', editor)
  .component('sidenav', sidenav)
  .component('blockly', blockly);

angular.element(document).ready(() => {
  angular.bootstrap(document, [ngModule.name]);
});
