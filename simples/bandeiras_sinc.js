#!/usr/bin/env node
'use strict';

var fs = require('fs');
var request = require('request');

var BASE_URL = ('https://www.cia.gov/library/publications/the-world-factbook'
                + '/graphics/flags/large/');

var DESTINO = './bandeiras/';

var QT_BAIXAR = 10;

var i = 0;
var nome = '';
var nomes = [];

console.time('tempo transcorrido');

nomes = fs.readFileSync('bandeiras.txt', 'utf-8').split('\n');

function salvar(error, response, body) {
  var nome_arq = '';
  if (response.error) {
    console.log('Error: '+response.error);
  }
  if (!error && response.statusCode == 200) {
    nome_arq = response.request.href.slice(BASE_URL.length);
    fs.writeFileSync(DESTINO+nome_arq, body);
    console.log('\t'+this.indice+' '+nome_arq+' salvo');
    if ((this.indice+1)<QT_BAIXAR) {
      var requisicao = {nomes: this.nomes, indice: this.indice+1};
      var nome = this.nomes[requisicao.indice];
      console.log(requisicao.indice+' '+nome);
      request({uri:BASE_URL+nome, encoding:null}, salvar.bind(requisicao));
    }
  }
}

var requisicao = {nomes: nomes, indice: 0};
nome = nomes[0];
console.log(requisicao.indice+' '+nome);
request({uri:BASE_URL+nome, encoding:null}, salvar.bind(requisicao));

process.on('exit', function () {
  console.timeEnd('tempo transcorrido');
});
