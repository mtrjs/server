module.exports = {
  apps: [
    {
      name: 'octopus-server',
      script: 'dist/main.js', // 指向 main.js 文件
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
