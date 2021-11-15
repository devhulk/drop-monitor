module.exports = {
  "apps": [
    {
      "name": "drop-monitor",
      "script": "./dist/drop-monitor.js",
      "error_file": "../log/drop-error.log",
      "out_file": "../log/drop-access.log",
      "merge_logs": true,
      "cwd": "./",
      "instances": 1,
      "exec_mode"  : "cluster_mode",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
