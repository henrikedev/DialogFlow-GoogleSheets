const express = require("express");
const app = express();
const { WebhookClient } = require("dialogflow-fulfillment");
const bodyParser = require("body-parser");
const axios = require("axios");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//FUNÇÃO PARA INSERIR PROTOCOLO
function uniqueID() {
  function run() {
    var data = new Date();
    return (
      ("0" + data.getDate()).substr(-2) +
      ("0" + (data.getMonth() + 1)).substr(-2) +
      data.getFullYear() +
      Math.floor(1000 + Math.random() * 9000)
    );
  }
  return run();
}

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.send("ChatBot");
});

app.post("/webhook", function (request, response) {
  const agent = new WebhookClient({ request: request, response: response });

  //FUNÇÃO PARA PUXAR HORÁRIO
  let date = new Date();
  let data = date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    hour12: false,
  });

  //FUNÇÃO DE SALDAÇÃO AVANÇADA
  function welcome(agent) {
    if (data >= 5 && data <= 11)
      agent.add(
        "👨‍✈️ Olá, bom dia! Eu sou o *Capitão Thomaz*, sou seu atendente virtual. Selecione qual dos serviços deseja solicitar: " +
          "\n" +
          "\n" +
          "*Digite apenas o número correspondente ao que precisa.*" +
          "\n" +
          "\n" +
          "3 - Manutenção ⚠" +
          "\n" +
          "4 - Empréstimos 🤲" +
          "\n" +
          "5 - Serviços de quarto 🛠"
      );
    else if (data >= 12 && data <= 17)
      agent.add(
        "👨‍✈️ Olá, boa tarde! Eu sou o *Capitão Thomaz*, sou seu atendente virtual. Selecione qual dos serviços deseja solicitar:" +
          "\n" +
          "\n" +
          "*Digite apenas o número correspondente ao que precisa.*" +
          "\n" +
          "\n" +
          "3 - Manutenção ⚠" +
          "\n" +
          "4 - Empréstimos 🤲" +
          "\n" +
          "5 - Serviços de quarto 🛠"
      );
    else
      agent.add(
        "👨‍✈️ Olá, boa noite! Eu sou o *Capitão Thomaz*, sou seu atendente virtual. Selecione qual dos serviços deseja solicitar: " +
          "\n" +
          "\n" +
          "*Digite apenas o número correspondente ao que precisa.*" +
          "\n" +
          "\n" +
          "3 - Manutenção ⚠" +
          "\n" +
          "4 - Empréstimos 🤲" +
          "\n" +
          "5 - Serviços de quarto 🛠"
      );
  }

  //CADASTRO DE CLIENTE
  function cadastro(agent) {
    const { nome, quarto, whatsapp, escolha } = agent.parameters;
    const data = [
      {
        Nome: nome,
        Quarto: quarto,
        Whatsapp: whatsapp,
        Escolha: escolha,
        Protocolo: uniqueID(),
      },
    ];
    axios.post(
      "https://sheet.best/api/sheets/ecada93b-1b1f-4be4-a7e4-e57a21b4ea7e",
      data
    );
    agent.add(``);
    agent.add("" + "\n" + "" + "\n" + "");
  }

  //MAPEAMENTO DAS INTENTS DO DIALOGFLOW
  let intentMap = new Map();
  intentMap.set("Welcome", welcome);
  intentMap.set("Default Welcome Intent - yes-3", cadastro); //OBS, DENTROS DAS ASPAS VAI O NOME DA INTENT E DEPOIS DA VÍRGULA, A FUNÇÃO
  intentMap.set("Default Welcome Intent - yes-4", cadastro); //OBS, DENTROS DAS ASPAS VAI O NOME DA INTENT E DEPOIS DA VÍRGULA, A FUNÇÃO
  intentMap.set("Default Welcome Intent - yes-5", cadastro); //OBS, DENTROS DAS ASPAS VAI O NOME DA INTENT E DEPOIS DA VÍRGULA, A FUNÇÃO
  agent.handleRequest(intentMap);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
