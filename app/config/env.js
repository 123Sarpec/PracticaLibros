

const env = {
  database: 'salama_api',
  username: 'salama_api_user',
  password: 'WyTOuGpJ6YlRwXeay9HTg3CsicOOVmfP',
  host: 'dpg-cr2jg7g8fa8c73dk3bag-a.oregon-postgres.render.com',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = env;
  