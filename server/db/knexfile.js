var options = {
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    client: "mysql",
    pool: {
        min: 1,
        max: 10,
    }
};

module.exports = options;