import express from "express";
import expressHandlebars from "express-handlebars";
import path from "path";
import fs from "fs";
import { Client } from "pg";

(async () => {
  const adminClient = new Client({
    user: "root",
    password: "mysecretpassword",
    database: "compsoc",
    host: process.env.DATABASE_HOST,
  });
  await adminClient.connect();
  const initQuery = fs.readFileSync(
    path.join(__dirname, "..", "autoexec.sql"),
    { encoding: "utf-8" }
  );
  await adminClient.query(initQuery);
  await adminClient.end();

  const app = express();

  app.engine("handlebars", expressHandlebars());
  app.set("view engine", "handlebars");
  app.set("views", path.resolve(__dirname, "..", "views"));

  app
    .use((req, res, next) => {
      console.log(req.url);
      next();
    })
    .get("/", (req, res) => {
      res.render("home");
    })
    .get("/login", async (req, res, next) => {
      if (!req.query.username && !req.query.password) return res.render('login')
      if (!req.query.username) return res.render('login', { message: 'A login username was not provided.' });
      if (!req.query.password) return res.render('login', { message: 'A login password was not provided.' });

      const appClient = new Client({
        user: "frontend",
        password: "computingsociety.co.uk",
        database: "compsoc",
        host: process.env.DATABASE_HOST,
      });

      try {
        await appClient.connect();
        const users = await appClient.query(`SELECT * FROM capturetheflag.users WHERE username = '${req.query.username}' AND password = '${req.query.password}';`)

        if (users.rows && users.rows.length > 1) {
          res.render('loggedin');
        } else {
          res.render('login', { message: 'Incorrect username or password.' })
        }
      } catch(e: any) {
        res.render('login', { message: 'A fatal error has occured', stack: e.stack })
      } finally {
        appClient.end();
      }
    })
    .use((req, res) => {
      res.render("404");
    });

  app.listen(8080);
})();
