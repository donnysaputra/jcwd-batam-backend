// const db = require("../database/config");
const db = require("../models");
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const Like = db.post_like;
const Post_Comment = db.post_comment;
const { sequelize } = require("../models");
const mailer = require("../lib/mailer");
const sharp = require("sharp");
const postsController = {
  getPosts: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await Post.findAll({
        attributes: [
          "id",
          "image_url",
          "number_of_likes",
          "caption",
          "user_id",
        ],

        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: User,
            as: "Likes",
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: Comment,
            attributes: ["comment"],
            include: [
              {
                model: User,
                attributes: ["id", "username", "avatar_url"],
              },
            ],
          },
        ],
      });

      // result.map(async (val) => {
      //   const checkLiked = await Like.findOne({
      //     where: {
      //       userId: id,
      //     },
      //   });

      //   if (checkLiked) {
      //     val.liked = true;
      //   } else {
      //     val.liked = false;
      //   }
      // });

      return res.status(200).json({
        message: "fetched data posts",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },
  getPostDetail: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await Post.findOne({
        attributes: [
          "id",
          "image_url",
          "number_of_likes",
          "caption",
          "user_id",
        ],

        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: User,
            as: "Likes",
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: Comment,
            attributes: ["comment"],
            include: [
              {
                model: User,
                attributes: ["id", "username", "avatar_url"],
              },
            ],
            where: {
              id: id,
            },
          },
        ],
      });

      return res.status(200).json({
        message: "fetched data posts",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },
  getComments: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await Comment.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: Post,
            attributes: [],
            where: {
              id: id,
            },
          },
        ],
      });

      return res.status(200).json({
        message: "fetched data posts",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },
  postComment: async (req, res) => {
    // console.log(req.body);
    const { comment, user_id, post_id } = req.body;
    const t = await sequelize.transaction();

    try {
      const newCom = await Comment.create({
        comment: comment,
        user_id: user_id,
      });

      await Post_Comment.create({
        post_id: post_id,
        comment_id: newCom.id,
      });

      await t.commit;

      return res.status(200).json({
        message: "new comment added",
      });
    } catch (err) {
      await t.rollback();
      return res.status(400).json({
        message: err,
      });
    }

    // const q = `START TRANSACTION;
    //  insert into comments (comment, user_id) values ('${comment}',${user_id});
    // SELECT @comment_id:= LAST_INSERT_ID();
    // insert into posts_comments (post_id, comment_id) values (${post_id}, @comment_id);
    //  COMMIT;`;
    // db.query(q, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(400).json({
    //       message: err,
    //     });
    //   }
    //   console.log(result[0]);
    //   res.status(200).json({
    //     message: "new comment added",
    //   });
    // });
  },
  postLike: async (req, res) => {
    const { post_id, user_id, liked } = req.body;
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      if (liked) {
        await Like.create({
          postId: post_id,
          userId: user_id,
        });

        const checkPost = await Like.findOne({
          attributes: [
            [sequelize.fn("count", sequelize.col("postId")), "total"],
          ],
          where: {
            postId: post_id,
          },
        });

        console.log(checkPost.dataValues.total);

        await Post.update(
          {
            number_of_likes: checkPost.dataValues.total,
          },
          {
            where: {
              id: post_id,
            },
          }
        );
      } else {
        await Like.destroy({
          where: [
            {
              postId: post_id,
            },
            {
              userId: user_id,
            },
          ],
        });
        const checkPost = await Like.findOne({
          attributes: [
            [sequelize.fn("count", sequelize.col("postId")), "total"],
          ],
          where: {
            postId: post_id,
          },
        });

        await Post.update(
          {
            number_of_likes: checkPost.dataValues.total,
          },
          {
            where: {
              id: post_id,
            },
          }
        );
      }

      await t.commit();

      res.status(200).json({ message: "liked post" });
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(400).json({
        message: err,
      });
    }
  },
  getPostsByUserame: async (req, res) => {
    try {
      const username = req.query.username;
      const result = await Post.findAll({
        attributes: [
          "id",
          "image_url",
          "number_of_likes",
          "caption",
          "user_id",
        ],

        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "username", "avatar_url"],
            where: {
              username: username,
            },
          },
          {
            model: User,
            as: "Likes",
            attributes: ["id", "username", "avatar_url"],
          },
          {
            model: Comment,
            attributes: ["comment"],
            include: [
              {
                model: User,
                attributes: ["id", "username", "avatar_url"],
              },
            ],
          },
        ],
      });

      return res.status(200).json({
        message: "fetched data posts",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err,
      });
    }
  },
  addPost: async (req, res) => {
    // console.log("halo");
    let fileUpload = req.file;
    console.log(req.file.filename);

    res.send("test");
  },

  addPost2: async (req, res) => {
    // console.log(req.file);
    const id = req.params.id;
    console.log(req.body);

    let pic = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    await User.update(
      {
        avatar_buffer: pic,
        avatar_url: process.env.render_avatar + id,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.send("test");
  },

  testPost: async (req, res) => {
    console.log(req.files);

    // const result = await Post.create({
    //   image_url: process.env.render_image + filename,
    // });

    res.send("test");
  },
  renderImage: async (req, res) => {
    try {
      // const { _id } = req.query;
      const id = req.params.id;
      const avatar = await User.findOne({
        where: {
          id: id,
        },
      });
      console.log(avatar.id);

      res.set("Content-type", "image/png");

      res.send(avatar.avatar_buffer);
    } catch (err) {
      res.send(err);
    }
  },
  sendMail: async (req, res) => {
    console.log("asd");
    const email = "jordansumardi@gmail.com";
    await mailer({
      to: email,
      subject: "Verify your account!",
    });

    return res.status(201).json({
      message: "sent mail",
      // html:
    });
  },
};

module.exports = postsController;
