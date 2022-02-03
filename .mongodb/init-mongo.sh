set -e

echo "🔥  Creating database..."
mongo <<EOF
use $MONGO_INITDB_DATABASE
db.createUser({
  user: '$MONGO_INITDB_ROOT_USERNAME',
  pwd: '$MONGO_INITDB_ROOT_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_INITDB_DATABASE',
    },
  ],
})
EOF

echo "🔥  Seeding listings..."
mongorestore --password=$MONGO_INITDB_ROOT_PASSWORD --username=$MONGO_INITDB_ROOT_USERNAME --archive="listings"

echo "✅  All done!"