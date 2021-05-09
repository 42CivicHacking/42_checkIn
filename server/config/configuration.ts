export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    callback: process.env.CLIENT_CALLBACK,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  log: {
    debug: process.env.LOG_DEBUG == 'true' ? true : false,
  },
  discord: {
    gaepo: {
      id: process.env.DISCORD_GAEPO_ID,
      pw: process.env.DISCORD_GAEPO_PW,
    },
    seocho: {
      id: process.env.DISCORD_SEOCHO_ID,
      pw: process.env.DISCORD_SEOCHO_PW,
    },
  },
});
