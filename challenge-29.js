(function() {
  'use strict';
  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"
  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.
  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.
  Essas informações devem ser adicionadas no HTML via Ajax.
  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.
  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */
  function app(){
    var $elementos = document.querySelectorAll('.valor');
    var $nome = capturar('[data-js="nome"]');
    var $telefone = capturar('[data-js="telefone"]');
    var $imagem = capturar('[data-js="imagem"]');
    var $cad = capturar('[data-js="cad_final"]');
    var $tabelas = capturar('[data-js="tabelas"]'); 

      function capturar(campo){
         return document.querySelector(campo);
      }

      var ajax = new XMLHttpRequest();
      ajax.open("GET", "company.json", true);
      ajax.send();

      ajax.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var dadosEmObjeto = JSON.parse(this.responseText);
            $nome.appendChild(document.createTextNode(dadosEmObjeto.name));
            $telefone.appendChild(document.createTextNode(dadosEmObjeto.phone));
          }
      };

      function addTabela(elemento, tabela){
        var celula;
        var $tr = document.createElement('tr');
        for(var i = 0; i <= elemento.length - 1; i++){
          var $td = document.createElement('td');
          celula = i === 0 ? criarImagem(elemento[i]) : criarTexto(elemento[i]); 
          $td.appendChild(celula);
          $tr.appendChild($td);
          tabela.appendChild($tr);
        }
      }

      function criarTexto(elemento){
        var newTextNode = document.createTextNode(elemento);
        return newTextNode;
      }      

      function criarImagem(elemento){
        var $img_table = document.createElement('img');
        $img_table.setAttribute('src', elemento);
        return $img_table;
      }

      function montarCarro(elementos){
        var carro = Array.prototype.map.call(elementos, function carregarElementos(item) {
          return item.value;
        });
        return carro;
      }

      $cad.addEventListener('click', function(){
        event.preventDefault();
        addTabela(montarCarro($elementos), $tabelas);
      });
  }
  app();
})();