# Установка и настройка

1. Убедитесь, что установлен Node.js
Проверьте установленную версию:
```shell
node -v
```
Если Node.js не установлен, скачайте и установите его с официального сайта.

2. Клонируйте репозиторий (если нужно)
```shell
git clone https://github.com/tochdv/autotest_pet_js.git
cd autotest_pet_js
```

3. Установите зависимости
Выполните в терминале:
```shell
npm install
```

4. Запустите тесты
```shell
npx mocha test_pet.js
```

# Описание тестов

Тесты проверяют различные сценарии работы API Petstore https://petstore.swagger.io/:

* Создание питомца (POST /pet)
* Поиск питомца по ID (GET /pet/{petId})
* Поиск питомца по статусу (GET /pet/findByStatus)
* Обновление статуса питомца (PUT /pet)
* Удаление питомца (DELETE /pet/{petId})
* Негативные тесты (SQL-инъекция, несуществующий ID и т. д.)