import { portoBank } from './portoBank.js';
import { portoSaude } from './portoSaude.js';
import { portoSeguroAuto } from './portoSeguroAuto.js';

const botaoIniciar = document.getElementById("botaoIniciar");
const temaSelecionado = document.getElementById("tema");
const quizContainer = document.getElementById("quizContainer");
const login = document.getElementById("login");

let temaatual = []; 
let perguntaatual = 0; 
let score = 0; 

function carregarpergunta(questions) {
    temaatual = questions;
    perguntaatual = 0;
    score = 0;
}

botaoIniciar.addEventListener("click", function () {
    const chamartema = temaSelecionado.value;
    switch (chamartema) {
        case "tema1":
            carregarpergunta(portoBank);
            break;
        case "tema2":
            carregarpergunta(portoSaude);
            break;
        case "tema3":
            carregarpergunta(portoSeguroAuto);
            break;
        default:
            break;
    }
    login.style.display = "none";
    mostrarPerguntas();
});

function mostrarPerguntas() {
    let questionsHTML = "";
    for (let i = 0; i < temaatual.length; i++) {
        const question = temaatual[i];
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
    const submitButton = `<button type="submit">Concluir</button>`;
    quizContainer.innerHTML = questionsHTML + submitButton;
    const resetButton = `<button type="reset">Reiniciar</button>`;
    quizContainer.innerHTML = questionsHTML + resetButton;
}

mostrarPerguntas();

