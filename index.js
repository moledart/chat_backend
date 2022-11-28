const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://chat-backend-kappa.vercel.app/",
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

// app.get("/feed", async (req, res) => {
//   const posts = await prisma.post.findMany({
//     where: { published: true },
//     include: { author: true },
//   });
//   res.json(posts);
// });

// app.post("/post", async (req, res) => {
//   const { title, content, authorEmail } = req.body;
//   const post = await prisma.post.create({
//     data: {
//       title,
//       content,
//       published: false,
//       author: { connect: { email: authorEmail } },
//     },
//   });
//   res.json(post);
// });

// app.put("/publish/:id", async (req, res) => {
//   const { id } = req.params;
//   const post = await prisma.post.update({
//     where: { id },
//     data: { published: true },
//   });
//   res.json(post);
// });

// app.delete("/user/:id", async (req, res) => {
//   const { id } = req.params;
//   const user = await prisma.user.delete({
//     where: {
//       id,
//     },
//   });
//   res.json(user);
// });

app.listen(3000, () => console.log(`🚀 Server ready at: 3000`));

module.exports = app;
