const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Student",
  tableName: "students",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    facultyNumber: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    firstName: {
      type: "varchar",
      nullable: false,
    },
    middleName: {
      type: "varchar",
      nullable: true,
    },
    lastName: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    university: {
      target: "University",
      type: "many-to-one",
      joinColumn: {
        name: "universityId",
      },
      nullable: false,
    },
    subjects: {
      type: "many-to-many",
      target: "Subject",
      inverseSide: "students",
    },
  },
});
