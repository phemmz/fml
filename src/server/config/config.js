require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres'
  },
  test: {
    url: process.env.TEST_DB_URL,
    use_env_variable: "TEST_DB_URL",
    dialect: 'postgres'
  },
  production: {
    url: process.env.PRODUCTION_URL,
    use_env_variable: "PRODUCTION_URL",
    dialect: 'postgres'
  },
};
