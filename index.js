const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://chat-client-drab.vercel.app",
    // origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Hey this is my API running");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/user", async (req, res) => {
  const username = req.body.username;
  let user = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: username,
      },
    });
  }

  res.json(user);
});

app.get("/messages/:userId", async (req, res) => {
  const userId = Number(req.params["userId"]);
  const messages = await prisma.message.findMany({
    where: { recipientId: userId },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(messages);
});

app.post("/messages", async (req, res) => {
  const { recipientId, theme, content, authorId } = req.body;
  const message = await prisma.message.create({
    data: {
      theme,
      content,
      authorId,
      recipientId,
    },
  });
  res.json(message);
});

app.listen(3000, () => console.log(`🚀 Server ready at: 3000`));

module.exports = app;
