/*
Для API - https://petstore.swagger.io/ нужно написать авто-тест:

Позитивный сценарий:
  1. Создать pet с рандомным ID и оригинальным именем и значениями по умолчанию
  2. Найти его по ID и убедиться что данные указаны верно
  3. Найти его по статусу с помощью /pet/findByStatus и проверить корректность данных
  4. Поменять его статус
  5. Найти его по новому статусу с помощью /pet/findByStatus 
  6. Удалить тестового pet

Добавить необходимые проверки ответов на каждом шаге, после каждого запроса.
Все запросы/ответы выводить в лог.

Негативные сценарии:
1. Запрос с ID, который был удалён
2. Запрос с некорректным ID (не числом)
3. Запрос с пустым ID (/pet/)
4. Запрос с SQL-инъекцией 

*/
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const API_URL = "https://petstore.swagger.io/v2";
const petId  = Math.floor(Math.random() * 1000000); // Генерация случайного ID
const petName = "petName_" + petId;

describe("Petstore API - Создание питомца", function () {
  it("Создан питомец с рандомным ID и оригинальным именем и значениями по умолчанию", function (done) {
    console.log("Шаг 1: Создание питомца с рандомным ID и оригинальным именем");
    chai.request(API_URL)
      .post("/pet")
      .send({
        id: petId,
        name: petName,
        status: "available",
      })
      .on("request", (req) => {
        console.log("Исходящий запрос:", {
          url: req.url,
          method: req.method,
          body: {
            id: petId,
            name: petName,
            status: 'available'
          }
        });
      })
      .end((err, res) => {
        if(err) console.error("Ошибка запроса:", err);
        console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object").that.is.not.empty;
        chai.expect(res.body.id).to.equal(petId);
        chai.expect(res.body.name).to.equal(petName);
        chai.expect(res.body.status).to.equal("available");
        chai.expect(res.body).to.have.property("photoUrls").that.is.an("array");
        chai.expect(res.body).to.have.property("tags").that.is.an("array");
        done();
      });
  });


it("Найден созданный питомец по ID и данные совпадают", function (done) {
  console.log("Шаг 2: Ищем созданного питомца по ID и проверяем данные");
    chai.request(API_URL)
      .get(`/pet/${petId}`)
      .on("request", (req) => {
        console.log("Исходящий запрос:", {
          url: req.url,
          method: req.method,
        });
      })
      .end((err, res) => {
        if(err) console.error("Ошибка запроса:", err);
        console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object").that.is.not.empty;
        chai.expect(res.body).to.have.property("id", petId);
        chai.expect(res.body).to.have.property("name", petName);
        chai.expect(res.body).to.have.property("status", "available"); // Проверяем статус
        done();
      });
  });


it("Найден созданный питомец по статусу с помощью /pet/findByStatus и данные корректны", function (done){
  console.log("Шаг 3: Ищем созданного питомца по статусу и проверяем данные");
    chai.request(API_URL)
    .get(`/pet/findByStatus`)
    .query({status:"available"})
    .on("request", (req) => {
      console.log("Исходящий запрос:", {
        url: req.url,
        method: req.method,
      });
    })
    .end((err, res) => {
      if(err) console.error("Ошибка запроса:", err);
      console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(200);
        const pet = res.body.find((p) => p.id === petId);
        chai.expect(pet).to.exist;
        console.log("Нашли нашего питомца:", pet);
        chai.expect(pet).to.have.property("id", petId);
        chai.expect(pet).to.have.property("name", petName);
        chai.expect(pet).to.have.property("status", "available");
        done();
    });
});

it("Статус питомца изменен", function (done){
  console.log("Шаг 4: Меняем статус питомца на sold");
    chai.request(API_URL)
    .put(`/pet`)
    .send({
        id: petId,
        name: petName,
        status: "sold",
    })
    .on("request", (req) => {
      console.log("Исходящий запрос:", {
        url: req.url,
        method: req.method,
        body: {
          id: petId,
          name: petName,
          status: 'sold'
        }
      });
    })
    .end((err, res) => {
      if(err) console.error("Ошибка запроса:", err);
      console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.an("object").that.is.not.empty;
        chai.expect(res.body).to.have.property("id", petId);
        chai.expect(res.body).to.have.property("name", petName);
        chai.expect(res.body).to.have.property("status", "sold");
        done();
    });
});

it("Найден созданный питомец по новому статусу с помощью /pet/findByStatus", function (done){
  console.log("Шаг 5: Находим созданного питомца по новому статусу");
    chai.request(API_URL)
    .get(`/pet/findByStatus`)
    .query({status:"sold"})
    .on("request", (req) => {
      console.log("Исходящий запрос:", {
        url: req.url,
        method: req.method,
      });
    })
    .end((err, res) => {
      if(err) console.error("Ошибка запроса:", err);
      console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res, "Статус ответа не 200").to.have.status(200);
        const pet = res.body.find((p) => p.id === petId);
        chai.expect(pet).to.exist;
        console.log("Нашли нашего питомца:", pet);
        chai.expect(pet).to.have.property("id", petId);
        chai.expect(pet).to.have.property("name", petName);
        chai.expect(pet).to.have.property("status", "sold");
        chai.expect(pet).to.have.property("photoUrls").that.is.an("array");
        chai.expect(pet).to.have.property("tags").that.is.an("array");
        done();
    });
});

it("Тестовый питомец удален", function (done){
  console.log("Шаг 6: Удаляем тестового питомца");
    chai.request(API_URL)
    .delete(`/pet/${petId}`)
    .on("request", (req) => {
      console.log("Исходящий запрос:", {
        url: req.url,
        method: req.method,
      });
    })
    .end((err, res) => {
      if(err) console.error("Ошибка запроса:", err);
      console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(200);
        done();
    });
});

it("Питомец удален. Запрос с несуществующим ID возвращает 404", function (done){  // также негативная проверка вызова функции с несуществующим (но валидным) ID
  console.log("Шаг 7: Проверяем что питомец удален, проверяем что статус ответа 404, тк передается несуществующий ID");
    chai.request(API_URL)
    .get(`/pet/${petId}`)
    .on("request", (req) => {
      console.log("Исходящий запрос:", {
        url: req.url,
        method: req.method,
      });
    })
    .end((err, res) => {
      if(err) console.error("Ошибка запроса:", err);
      console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(404);
        done();
    });
});

});

describe("Проверка негативных сценариев", function() {
  it("Запрос с некорректным ID возвращает 404", function (done) {   //ожидаем код ошибки 404
    console.log("Шаг 1: Запрос с некорректным ID - строкой");
    chai.request(API_URL)
      .get(`/pet/abc123`) 
      .on("request", (req) => {
        console.log("Исходящий запрос:", {
          url: req.url,
          method: req.method,
        });
      })
      .end((err, res) => {
        if(err) console.error("Ошибка запроса", err);
        console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(404);
        done();
      });
  });
  
  it("Запрос с пустым ID возвращает 405", function (done) {   //код ошибки не указан в описании метода, взят из фактического ответа
    console.log("Шаг 2: Запрос  с пустым ID");
    chai.request(API_URL)
      .get(`/pet/`) 
      .on("request", (req) => {
        console.log("Исходящий запрос:", {
          url: req.url,
          method: req.method,
        });
      })
      .end((err, res) => {
        if(err) console.error("Ошибка запроса", err);
        console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(405);
        done();
      });
  });
  
  it("Запрос с SQL-инъекцией возвращает 404", function (done) {  //ожидаем код ошибки 404
    console.log("Шаг 3: Запрос с SQL-инъекцией");
    chai.request(API_URL)
      .get(`/pet/'DROP TABLE users --'`) 
      .on("request", (req) => {
        console.log("Исходящий запрос:", {
          url: req.url,
          method: req.method,
        });
      })
      .end((err, res) => {
        if(err) console.error("", err);
        console.log(`Ответ API:\n Status: ${res.status}\n Body:`, res.body);
        chai.expect(res).to.have.status(404);
        done();
      });
  });
  
});