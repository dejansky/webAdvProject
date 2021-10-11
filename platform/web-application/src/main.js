const awilix = require("awilix");
const postgresDB = require("./sequelize-dal/sequelize-pgdb");

const container = awilix.createContainer();

container.register({
  //--------------------- Belongs to same resources------------------//
  //Account
  accountRouter: awilix.asFunction(require("./pl/routers/account-router")),
  accountManager: awilix.asFunction(require("./bll/account-manager")),
  accountValidator: awilix.asFunction(require("./bll/account-validator")),
  accountRepository: awilix.asFunction(require("./dal/account-repository")),
  //accountRepository: awilix.asFunction(require('./sequelize-dal/sequelize-account-repository')),

  // userRouter uses account resources
  userRouter: awilix.asFunction(require("./pl/routers/user-router")),

  //Reservations
  reservationRouter: awilix.asFunction(
    require("./pl/routers/reservation-router")
  ),
  reservationManager: awilix.asFunction(require("./bll/reservation-manager")),
  reservationValidator: awilix.asFunction(
    require("./bll/reservation-validator")
  ),
  reservationRepository: awilix.asFunction(
    require("./dal/reservation-repository")
  ),
  //reservationRepository: awilix.asFunction(require('./sequelize-dal/sequelize-reservation-repository')),

  // Tables
  tableRouter: awilix.asFunction(require("./pl/routers/tables-router")),
  tableManager: awilix.asFunction(require("./bll/table-manager")),
  //tableRepository: awilix.asFunction(require('./sequelize-dal/sequelize-table-repository')),
  tableRepository: awilix.asFunction(require("./dal/table-repository")),
  tableValidator: awilix.asFunction(require("./bll/table-validator")),

  //--------------------- Belongs to same resources------------------//
  //Admin
  adminRouter: awilix.asFunction(require("./pl/routers/admin-router")),
  adminManager: awilix.asFunction(require("./bll/admin-manager")),
  adminRepository: awilix.asFunction(require("./dal/admin-repository")),
  //adminRepository: awilix.asFunction(require('./sequelize-dal/sequelize-admin-repository')),

  adminRepository: awilix.asFunction(require("./dal/admin-repository")),
  adminValidator: awilix.asFunction(require("./bll/admin-validator")),
  //Recipe+Menu
  recipeRouter: awilix.asFunction(require("./pl/routers/recipe-router")),
  recipeManager: awilix.asFunction(require("./bll/recipe-manager")),
  recipeValidator: awilix.asFunction(require("./bll/recipe-validator")),
  recipeRepository: awilix.asFunction(require("./dal/recipe-repository")),
  //recipeRepository: awilix.asFunction(require('./sequelize-dal/sequelize-recipe-repository')),

  //Contact+feedback
  variousRouter: awilix.asFunction(require("./pl/routers/various-routers")),
  variousManager: awilix.asFunction(require("./bll/various-manager")),
  variousRepository: awilix.asFunction(require("./dal/various-repository")),
  //variousRepository: awilix.asFunction(require('./sequelize-dal/sequelize-various-repository')),

  //--------------------- Others------------------//
  globals: awilix.asFunction(require("./globals")),
  restAPI: awilix.asFunction(require("./pl/routers/rest-api")),
  app: awilix.asFunction(require("./pl/app")),
});

const app = container.resolve("app");
app.listen(8080, function () {
  console.log("Web application listening on port 8080.");
});

// Start listening for incoming HTTP requests!
