set -e
# shell script to create a database non-root user on first startup
mongo <<EOF
use $MONGO_INITDB_DATABASE

db.createUser({
  user: '$APP_MONGODB_USER',
  pwd: '$APP_MONGODB_PASS',
  roles: [{
    role: 'readWrite',
    db: '$MONGO_INITDB_DATABASE'
  }]
})
EOF
