module.exports = {
  apps: [
    {
      // Unique name for Click2Leads backend
      name: 'click2leads-backend',
      script: './backend/server.js',
      instances: 2, // Run 2 instances for load balancing
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5003, // Unique port for this project
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5003,
      },
      // Unique log files for this project
      error_file: './logs/click2leads-backend-error.log',
      out_file: './logs/click2leads-backend-out.log',
      log_file: './logs/click2leads-backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart settings
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      watch: false, // Don't watch in production
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      // Unique name for Click2Leads frontend (if serving via Node)
      name: 'click2leads-frontend',
      script: 'npx',
      args: 'serve -s build -l 3003',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3003, // Unique port for frontend
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      // Unique log files
      error_file: './logs/click2leads-frontend-error.log',
      out_file: './logs/click2leads-frontend-out.log',
      log_file: './logs/click2leads-frontend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart settings
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      
      // Don't start frontend if using NGINX to serve static files
      // Comment out this app config if serving via NGINX
    }
  ],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/click2leads.git',
      path: '/var/www/click2leads',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': '',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};