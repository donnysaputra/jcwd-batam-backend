const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers");

router.get("/", postsController.getPosts);
router.get("/user", postsController.getPostsByUserame);
router.patch("/like", postsController.postLike);

router.get("/:id/", postsController.getPostDetail);

router.get("/:id/comments", postsController.getComments);
router.post("/comments/", postsController.postComment);

module.exports = router;
