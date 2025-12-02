const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Subject",
  tableName: "subjects",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    code: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    credits: {
      type: "integer",
      nullable: false,
    },
  },
  relations: {
    students: {
      type: "many-to-many",
      target: "Student",
      joinTable: {
        name: "student_subjects",
      },
      inverseSide: "subjects",
    },
  },
});
