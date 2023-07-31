import { portoBank } from "./portoBank.js";
import { portoSaude } from "./portoSaude.js";
import { portoSeguroAuto } from "./portoSeguroAuto.js";



const botaoIniciar = document.getElementById("botaoIniciar");
const temaSelecionado = document.getElementById("tema");
const quizContainer = document.getElementById("quizContainer");
const login = document.getElementById("login");

const mySection = document.getElementById("quizContainer");
mySection.style.display = "none";


let temaAtual = [];
let score = 0;

function carregarPergunta(questions) {
    temaAtual = questions;
    score = 0;
}



function myTimer() { 
    const d = new Date(); 
    const tempoAtual = Math.floor((d.getTime() - cron.tempoInicial) / 1000);
    const minutos = Math.floor(tempoAtual / 60);
    const segundos = tempoAtual % 60;
    document.getElementById("cronometro").innerHTML = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")
        }`;
}

botaoIniciar.addEventListener("click", function () {
    cron.iniciarQuiz();
    const chamarTema = temaSelecionado.value;

    switch (chamarTema) {
        case "tema1":
            carregarPergunta(portoBank);
            break;
        case "tema2":
            carregarPergunta(portoSaude);
            break;
        case "tema3":
            carregarPergunta(portoSeguroAuto);
            break;
        default:
            break;
    }

    login.style.display = "none"; //página de login
    mySection.style.display = "block"; //botões

    

    mostrarPerguntas();
});

//Verificar se todas as perguntas foram respondidas
function perguntasRespondidas() {
    const respostaContainers = quizContainer.querySelectorAll("ul");
    for (let i = 0; i < temaAtual.length; i++) {
        const respostaContainer = respostaContainers[i];
        const botaoSelecionado = respostaContainer.querySelector(`input[name=answer${i}]:checked`);
        if (!botaoSelecionado) {
            return false; // Pelo menos uma pergunta não foi respondida
        }
    }
    return true; // Todas as perguntas foram respondidas
}


function mostrarPerguntas() {
    let questionsHTML = "";
    for (let i = 0; i < temaAtual.length; i++) {
        const question = temaAtual[i];
        questionsHTML += `
            <div>
                <p>${question.pergunta}</p>
                <ul>
                    <li><label><input type="radio" name="answer${i}" value="A">${question.respostaA}</label></li>
                    <li><label><input type="radio" name="answer${i}" value="B">${question.respostaB}</label></li>
                    <li><label><input type="radio" name="answer${i}" value="C">${question.respostaC}</label></li>
                    <li><label><input type="radio" name="answer${i}" value="D">${question.respostaD}</label></li>
                </ul>
            </div>
        `;
    }

    const resetButton = `<button type="reset" id="resetButton">Reiniciar</button>`;
    const submitButton = `<button type="button" id="concluir">Concluir</button>`;

    const concluirPergunta = `<button type="button" id="concluirPerguntas">Continuar</button>`;
    questionsHTML += submitButton + resetButton + concluirPergunta;
    quizContainer.innerHTML = questionsHTML;

    const concluirButton = document.getElementById("concluir"); // selecionar o botão
    concluirButton.addEventListener("click", function () {
        if (perguntasRespondidas()) {
            verificarRespostas();
        } else {
            alert("Responda todas as perguntas antes de concluir.");
        }
    });

    //logica do botão reinicar

    const botaoConcluir = document.getElementById("concluirPerguntas"); //apaga o botao concluirPergunta
    botaoConcluir.style.display = "none";
}


function verificarRespostas() {

 
    cron.pararQuiz();

    const resetButton = document.getElementById("resetButton"); // apaga o botao reiniciar
    resetButton.style.display = "none";

    const submitButton = document.getElementById("concluir"); // apaga o botao concluir
    submitButton.style.display = "none";

    const botaoConcluir = document.getElementById("concluirPerguntas"); //faz aparecer o botao continuar
    botaoConcluir.style.display = "block";
    botaoConcluir.addEventListener("click", exibirTabelaResultados); // chama a funcao verificar resposta

    const respostaContainers = quizContainer.querySelectorAll("ul");
    for (let i = 0; i < temaAtual.length; i++) {

        const respostaContainer = respostaContainers[i];
        if (respostaContainer) {
            const questao = temaAtual[i];
            const botaoSelecionado = document.querySelector(
                `input[name=answer${i}]:checked`
            )

            if (botaoSelecionado) {
                const valorSelecionado = botaoSelecionado.value.toLowerCase();
                if (valorSelecionado === questao.respostaCorreta.toLowerCase()) {
                    respostaContainer.style.backgroundColor = "green";
                    score++;
                } else {
                    respostaContainer.style.backgroundColor = "red";
                }
            }
        }
    }
}


function totalPerguntas() {
    return temaAtual.length;
}


function exibirTabelaResultados() {
    quizContainer.style.display = "none";
    const tabelaResultados = document.getElementById("tabelaResultados");
    tabelaResultados.style.display = "block"; // Exibe a tabela de resultados

    const nomeParticipante = document.getElementById("name").value;
    const temaSelecionadoValue = temaSelecionado.options[temaSelecionado.selectedIndex].text; // Obtém o texto do tema selecionado
    const d = new Date();
    const dataQuiz = d.toLocaleDateString(); 
    const tempoTotal = cron.tempoTotal;

    const numeroAcertos = score;   //Recebe o numero de acertos
    const numerototalPerguntas = totalPerguntas(); //Recebe a quantidade de perguntas
    const scoreFormatado = `${numeroAcertos}/${numerototalPerguntas}`; //Formata o score

    // Cria uma nova linha na tabela de resultados com os dados do participante
    const resultadoTable = document.getElementById("resultadoTable").getElementsByTagName("tbody")[0];
    const newRow = resultadoTable.insertRow();


    participantes.adicionaPessoa(
        {
            nome: nomeParticipante,
            tema: temaSelecionadoValue,
            tempo: tempoTotal,
            data: dataQuiz,
            score: scoreFormatado,
            acertos: parseInt(numeroAcertos),
            totalPerguntas: parseInt(numerototalPerguntas)
        }
    )

    ranking.carregarRankingBanking();
    ranking.carregarRankingAuto();
    ranking.carregarRankingSaude();

    document.getElementById("media-acertos").innerHTML = `Média de acertos ${estatisticas.mediaAcertos()}`
    document.getElementById("media-erros").innerHTML = `Média de erros ${estatisticas.mediaErros()}`

    newRow.innerHTML = `
        <td>${nomeParticipante}</td>
        <td>${temaSelecionadoValue}</td>
        <td>${tempoTotal}</td>
        <td>${dataQuiz}</td>
        <td>${scoreFormatado}</td>
    `;
}

const continuarButton = document.getElementById("continuar");
continuarButton.addEventListener("click", function () {
    // Esconde as perguntas e mostra a tabela de resultados
    mySection.style.display = "none";
    const tabelaResultados = document.getElementById("tabelaResultados");
    tabelaResultados.style.display = "block";
});




btnReiniciaQuiz.addEventListener("click", () => {  
    tabelaResultados.style.display = "none";
    login.style.display = "block";
    const nomeParticipante = document.getElementById("name");
    nomeParticipante.value = '';
    ranking.removerPessoaRanking();//incluido chamada a funcao de remover elementos do DOM
});

/** RANKING **/
const ranking = {
    bank: () => ranking.ordenaRankingPorTema(participantes.pessoas, 'Porto Bank'),
    saude: () => ranking.ordenaRankingPorTema(participantes.pessoas, 'Porto Saúde'),
    auto: () => ranking.ordenaRankingPorTema(participantes.pessoas, 'Porto Auto'),

    ordenaRankingPorTema: (pessoas, tema) => {
        return pessoas
            .filter(p => p.tema === tema)//filtra por tema
            .sort((p1, p2) => p2.acertos - p1.acertos)//ordena em ordem decrescente
    },
    gerarId: (pessoa) => `${pessoa.nome}-${pessoa.score}`,
    carregarRankingBanking: () => {
        const ol = document.getElementById('ranking-banking');
        const rankOrdenado = ranking.bank();
        for (const pessoa of rankOrdenado) {
            let li = document.createElement('li');//cria li no DOM
            li.setAttribute('id', ranking.gerarId(pessoa))//define id da li
            li.appendChild(document.createTextNode(pessoa.nome));//coloca o nome da pessoa na li
            ol.appendChild(li);//insere a li dentro da ol
        };
    },
    carregarRankingAuto: () => {
        const ol = document.getElementById('ranking-seg-auto');
        const rankOrdenado = ranking.auto();
        for (const pessoa of rankOrdenado) {
            let li = document.createElement('li');//cria li no DOM
            li.setAttribute('id', ranking.gerarId(pessoa))//define id da li
            li.appendChild(document.createTextNode(pessoa.nome));//coloca o nome da pessoa na li
            ol.appendChild(li);//insere a li dentro da ol
        };
    },
    carregarRankingSaude: () => {
        const ol = document.getElementById('ranking-saude');
        const rankOrdenado = ranking.saude();
        for (const pessoa of rankOrdenado) {
            let li = document.createElement('li');//cria li no DOM
            li.setAttribute('id', ranking.gerarId(pessoa))//define id da li
            li.appendChild(document.createTextNode(pessoa.nome));//coloca o nome da pessoa na li
            ol.appendChild(li);//insere a li dentro da ol
        };
    },

    removerPessoaRanking: () => {
        for (const pessoa of participantes.pessoas) {
            const el = document.getElementById(ranking.gerarId(pessoa))//pega o elemento pelo "gerarId"
            el.remove();//remove elemento
        };
    }
}

/** PARTICIPANTES **/
const participantes = {
    pessoas: [],
    adicionaPessoa: (p) => participantes.pessoas.push(p)
}

/** ESTATÍSTICAS **/
const estatisticas = {
    mediaAcertos: () => (participantes.pessoas
        .map(p => p.acertos)//faz p mapeamento dos acertos
        .reduce((a, b) => a + b) / participantes.pessoas.length).toFixed(1), // soma o total de acertos e divide pelos participantes
    mediaErros: () => (participantes.pessoas
        .map(p => p.totalPerguntas - p.acertos) //faz p mapeamento dos acertos
        .reduce((a, b) => a + b) / participantes.pessoas.length).toFixed(1)
} // soma o total de acertos e divide pelos participantes


const cron = {
    tempoInicial: 0, // Tempo inicial do Cronômetro
    tempoTotal: '',
    iniciarQuiz: () => {
        clearInterval(cron.tempoInicial);
        setInterval(myTimer, 1000);
        const cronometro = document.getElementById("cronometro");
        cronometro.style.display = "block"; // Exibe o cronometro
        cron.tempoInicial = new Date().getTime();
    },
    pararQuiz: () => {
        const cronometro = document.getElementById("cronometro");
        cronometro.style.display = "none"; // Oculta o cronometro
        cron.tempoTotal = document.getElementById("cronometro").innerText;
    }
}







// ----- Áudio da página
// const audio = document.getElementById("audio");
// audio.addEventListener("ended", function () {
//   this.currentTime = 0;
//   this.play();
// });
// audio.play();

// const volumeDesejado = 0.15;
// audio.volume = volumeDesejado