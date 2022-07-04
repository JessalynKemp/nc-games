# Northcoders House of Games API

## Environment Variables

To successfully connect to the development and test databases, you will need to create two .env files which contain the correct database name for each environment. Navigate to the repository in your terminal and write the following commands:

```
touch .env.test
touch .env.development
```

Into each file, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).

Add .env.\* to the gitignore to ensure that these files are not uploaded to GitHub.
