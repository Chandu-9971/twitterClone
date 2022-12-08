const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "twitterClone.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const validatePassword = (password) => {
  return password.length > 5;
};

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, user_id } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined) {
    const createUserQuery = `
     INSERT INTO
      user (user_id,username, name, password, gender)
     VALUES
      (
       '${username}',
       '${name}',
       '${hashedPassword}',
       '${gender}',
       '${userId}'  
      );`;
    if (validatePassword(password)) {
      await database.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      databaseUser.password
    );
    if (isPasswordMatched === true) {
      return jwtToken;
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

function authenticateToken(request, response, next) {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
}

app.get("/user/tweets/feed/", async (request, response) => {
  const { username, tweet } = request.params;

  const getUserQuery = `
    SELECT
      *
    FROM
      user AND tweet
    WHERE
      username = '${username}'
      tweet = '${tweet}'
      dateTime = '${dns - fn}';`;
  const user = await database.all(getUserQuery);
  response.send(user);
});

app.get("/user/following/", async (request, response) => {
  const { name } = request.params;

  const getNameQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      name = '${name}';`;
  const user = await database.all(getNameQuery);
  response.send(user);
});

app.get("/user/followers/", async (request, response) => {
  const { name } = request.params;

  const getNameQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      name = '${name}';`;
  const user = await database.all(getNameQuery);
  response.send(user);
});

app.get("/tweets/:tweetId/", async (request, response) => {
  const { tweet, likesCount, repliesCount, dateTime } = request.params;
  const selectTweetQuery = `SELECT * FROM tweet WHERE tweet = '${tweet}';`;
  const tweetUser = await database.get(selectTweetQuery);
  if (tweetUser === undefined) {
    response.status(401);
    response.send("Invalid Request");
  } else {
    const getTweetQuery = `
    SELECT
      *
    FROM
      tweet
    WHERE
      tweet = '${tweet}'
      likesCount = '${likes}'
      repliesCount = '${repliesCount}'
      dateTime = '${date - time}';`;
    const tweet = await database.all(getTweetQuery);
    response.send(tweet);
  }
});

app.get("/tweets/:tweetId/likes/", async (request, response) => {
  const { likes } = request.params;
  const selectTweetQuery = `SELECT * FROM tweet WHERE likes = '${likes}';`;
  const tweetUser = await database.get(selectTweetQuery);
  if (tweetUser === undefined) {
    response.status(401);
    response.send("Invalid Request");
  } else {
    const getTweetQuery = `
    SELECT
      *
    FROM
      tweet
    WHERE
      likes = '${likes}';`;
    const tweet = await database.all(getTweetQuery);
    response.send(tweet);
  }
});

app.get("/tweets/:tweetId/replies/", async (request, response) => {
  const { reply } = request.params;
  const selectReplyQuery = `SELECT * FROM Reply WHERE replies = '${reply}';`;
  const replyUser = await database.get(selectReplyQuery);
  if (replyUser === undefined) {
    response.status(401);
    response.send("Invalid Request");
  } else {
    const selectReplyQuery = `
    SELECT
      *
    FROM
      Reply
    WHERE
      replies = '${reply}';`;
    const reply = await database.all(selectReplyQuery);
    response.send(reply);
  }
});

app.get("/user/tweets/", async (request, response) => {
  const { tweet, likes, replies, dateTime } = request.params;

  const getTweetQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      tweet = '${tweet}'
      likes = '${likes}'
      replies = '${repliesCount}'
      dateTime = '${date - time}';`;
  const user = await database.all(getTweetQuery);
  response.send(user);
});

app.post("/user/tweets/", async (request, response) => {
  const { tweet } = request.params;

  const getTweetQuery = `
    INSERT INTO
      tweet (tweet)
     VALUES
      (
       '${tweet}'  
      );`;
  await database.run(getTweetQuery);
  response.send("Created a Tweet");
});


app.delete("/tweets/:tweetId/", async (request, response) => {
  const { tweetId } = request.params;
  const deleteUser = await database.get(selectDeleteQuery);
  if (deleteUser === undefined) {
    response.status(401);
    response.send("Invalid Request");
  } else {
  const selectDeleteQuery = `
  DELETE FROM
    tweet
  WHERE
    tweetId = ${tweet};`;

  await database.run(selectDeleteQuery);
  response.send("Tweet Removed");
});

module.exports = app;
