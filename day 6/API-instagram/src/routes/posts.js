const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers");

//localhost:2000/posts/
router.get("/", postsController.getPosts);
router.patch("/like", postsController.postLike);

router.get("/user", postsController.getPostsByUserame);

router.get("/:id/comments", postsController.getComments);
router.post("/comments/", postsController.postComment);
router.get("/:id/", postsController.getPostDetail);

module.exports = router;
