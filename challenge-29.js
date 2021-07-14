(function() {
  'use strict';
  function app(){
    var $elementos = document.querySelectorAll('.valor');
    var $imagem = capturar('[data-js="imagem"]');
    var $cad = capturar('[data-js="cad_final"]');
    var $tabelas = capturar('[data-js="tabelas"]'); 
    var $tb_principal = capturar('[data-js="tb"]');
    var $btn_excluir; 

    carregar_dados_empresa();
    carregar_dados_tabela();
    

      function capturar(campo){
         return document.querySelector(campo);
      }

      function carregar_dados_tabela(){
        var ajax;
        document.getElementById('tbody').innerHTML = '';
        ajax = manipular_dados('GET', 'http://localhost:3000/car');
        ajax.addEventListener('readystatechange', function(){
          if (ajax.readyState === 4 && ajax.status === 200) {
            var dadosEmObjeto = JSON.parse(this.responseText);
            for(var i in dadosEmObjeto){
              esperarBTN();
              addTabela(converterOBJEmArray(dadosEmObjeto)[i], $tabelas);
            }
            esperarBTN();
          }
        }, false);
      }

      function converterOBJEmArray(original){
        var convertido = original.map(function(obj) {
          return Object.keys(obj).map(function(chave) {
            return obj[chave];
          });
        });
        return convertido;
      }

      function carregar_dados_empresa(){
        var $nome = capturar('[data-js="nome"]');
        var $telefone = capturar('[data-js="telefone"]');
        var ajax;
        ajax = manipular_dados('GET', 'company.json');
        ajax.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var dadosEmObjeto = JSON.parse(this.responseText);
            $nome.appendChild(document.createTextNode(dadosEmObjeto.name));
            $telefone.appendChild(document.createTextNode(dadosEmObjeto.phone));
          }
        };
      }

      function cad_carro(elementos){
        var ajax;
        var enviar = 'image=' + elementos[0] + '&brand=' + elementos[1] + '&model=' + elementos[2] + '&year=' + elementos[3] + '&plate=' + elementos[4] + '&color=' + elementos[5];
        ajax = manipular_dados('POST', 'http://localhost:3000/car', enviar);
      }

      function excluir_carro(elementos){
        var ajax;
        var enviar = elementos.plate;
        ajax = manipular_dados('DELETE', 'http://localhost:3000/car', '&plate=' + enviar );
      }

      function manipular_dados(verbo, url, body){
        var ajax = new XMLHttpRequest();
        ajax.open(verbo, url);
        if( verbo === 'POST' || verbo === 'DELETE' )
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(body);
        return ajax;
      }

      function receber_dados(linha){
        console.log(linha);
        var ajax;
        ajax = manipular_dados('GET', 'http://localhost:3000/car');
        ajax.addEventListener('readystatechange', function(){
          if (ajax.readyState === 4 && ajax.status === 200) {
            excluir_carro( JSON.parse(ajax.responseText)[ linha - 1 ] );
          }
        }, false);
      }

      function addTabela(elemento, tabela, ){
        var celula;
        var $tr = document.createElement('tr');
        criarBotao($tr);
        for(var i = 0; i <= elemento.length - 1; i++){
          celula = i === 0 ? criarImagem(elemento[i]) : criarTexto(elemento[i]); 
          criarLinha($tr, celula);
        }
      }

      function criarLinha(tr, celula){
        var $td = document.createElement('td');
        $td.appendChild(celula);
        tr.appendChild($td);
        $tabelas.appendChild(tr);
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

       function criarBotao(tr){
        var $btn = document.createElement('button');
        $btn.setAttribute('class', 'btn_excluir');
        $btn.appendChild(criarTexto('Excluir'));
        criarLinha(tr, $btn);
      }

      function montarCarro(elementos){
        var carro = Array.prototype.map.call(elementos, function carregarElementos(item) {
          return item.value;
        });
        return carro;
      }

      $cad.addEventListener('click', function(){
        event.preventDefault();
        cad_carro(montarCarro($elementos));
        addTabela(montarCarro($elementos), $tabelas);
        esperarBTN();
      });
       

      function esperarBTN(){
        $btn_excluir = document.querySelectorAll('[class="btn_excluir"]');
        Array.prototype.forEach.call($btn_excluir, function(linha) {
          linha.addEventListener('click', deletarLinha, false);
        });
      }

      function deletarLinha(){
        receber_dados(this.parentNode.parentNode.rowIndex);
        $tb_principal.deleteRow(this.parentNode.parentNode.rowIndex);
      }
    }
  app();
})();