const db = require("../database/config");

const postsController = {
  getPosts: (req, res) => {
    // console.log(req.body);
    const q = `
    select p.id,image_url,number_of_likes, caption, username,avatar_url, count(pc.post_id) as comments ,
    (select count(*) from posts_likes where user_id = ${req.query.user_id} and post_id = p.id ) as liked 
     from posts p 
    join users u on u.id = p.user_id
    left join posts_comments pc on pc.post_id = p.id
    group by p.id`;
    db.query(q, (error, result) => {
      try {
        if (!error) {
          if (!result.length) {
            result.map(async (val) => {});
          }

          return res.status(200).json({
            message: "fetched data posts",
            result: result,
          });
        }
        return res.status(400).json({
          message: error,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          message: error,
        });
      }
    });
  },
  getPostDetail: (req, res) => {
    const id = req.params.id;
    // console.log(req.body);
    const q = `
    select p.id,image_url,number_of_likes, caption, username,avatar_url, count(pc.post_id) as comments,
    (select count(*) from posts_likes where user_id = ${req.query.user_id} and post_id = p.id ) as liked 
    from posts p 
    join users u on u.id = p.user_id
    left join posts_comments pc on pc.post_id = p.id
    where p.id = ${id}
    group by p.id`;
    db.query(q, (error, result) => {
      try {
        if (!error) {
          if (!result.length) {
            result.map(async (val) => {});
          }

          return res.status(200).json({
            message: "user successfully logged in",
            result: result[0],
          });
        }
        return res.status(400).json({
          message: "user failed logged in",
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          message: error,
        });
      }
    });
  },
  getComments: (req, res) => {
    const id = req.params.id;
    const q = `select  u.username, u.avatar_url, c.comment  from posts_comments pc
    join comments c on c.id = pc.comment_id
    join users u on u.id = c.user_id
    where pc.post_id = ${id}`;
    db.query(q, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }
      res.status(200).json({
        message: "comments fetched",
        result: result,
      });
    });
  },
  postComment: (req, res) => {
    // console.log(req.body);
    const { comment, user_id, post_id } = req.body;

    const q = `START TRANSACTION;
     insert into comments (comment, user_id) values ('${comment}',${user_id});
    SELECT @comment_id:= LAST_INSERT_ID();
    insert into posts_comments (post_id, comment_id) values (${post_id}, @comment_id);
     COMMIT;`;
    db.query(q, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message: err,
        });
      }
      console.log(result[0]);
      res.status(200).json({
        message: "new comment added",
      });
    });
  },
  postLike: (req, res) => {
    const { post_id, user_id, liked } = req.body;
    console.log(req.body);
    let q = "";
    liked
      ? (q = `insert into posts_likes (post_id,user_id) values (${post_id}, ${user_id});
    update posts set number_of_likes = (select count(*) from posts_likes where post_id = ${post_id}) where id = ${post_id};`)
      : (q = `delete from posts_likes where post_id = ${post_id} and user_id = ${user_id};
      update posts set number_of_likes = (select count(*) from posts_likes where post_id = ${post_id}) where id = ${post_id};
      `);
    db.query(q, (err, result) => {
      if (err) {
        return res.status(400).json({
          message: err,
        });
      }
      res.status(200).json({ message: "liked post" });
    });
  },
  getPostsByUserame: (req, res) => {
    // console.log(req.body);
    const username = req.query.username;
    const q = `
    select p.id,image_url,number_of_likes, caption, username,avatar_url, count(pc.post_id) as comments 
         from posts p 
    join users u on u.id = p.user_id
    left join posts_comments pc on pc.post_id = p.id
    where u.username = '${username}'
    group by p.id`;
    db.query(q, (error, result) => {
      try {
        if (!error) {
          if (!result.length) {
            result.map(async (val) => {});
          }

          return res.status(200).json({
            message: "posts data fetched",
            result: result,
          });
        }
        return res.status(400).json({
          message: error,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({
          message: error,
        });
      }
    });
  },
};

module.exports = postsController;
