const { DataSource } = require("typeorm");
const University = require("../entities/University");
const Student = require("../entities/Student");
const Subject = require("../entities/Subject");


const AppDataSource = new DataSource({
  type: "sqlite",
  database: "2database.sqlite",
  synchronize: true,
  logging: false,
  entities: [University, Student, Subject],
});

module.exports = AppDataSource;
