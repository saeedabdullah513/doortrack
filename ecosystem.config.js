module.exports = {
  apps: [
    {
      name: "doortrack",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/doortrack",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logs
      out_file: "/var/log/doortrack/out.log",
      error_file: "/var/log/doortrack/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
