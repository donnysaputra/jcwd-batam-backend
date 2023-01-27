const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers");
const { fileUploader, upload } = require("../middlewares/multer");

router.get("/", postsController.getPosts);
router.get("/user", postsController.getPostsByUserame);
router.patch("/like", postsController.postLike);
router.get("/render/:id", postsController.renderImage);

router.get("/:id/", postsController.getPostDetail);

router.get("/:id/comments", postsController.getComments);
router.post("/comments/", postsController.postComment);

router.post(
  "/",
  fileUploader({
    destinationFolder: "POST",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  postsController.addPost
);

router.post(
  "/testupload",
  fileUploader({
    destinationFolder: "POST",
    fileType: "image",
    prefix: "POST",
  }).array("gambar", 2),
  postsController.testPost
);

router.post("/v2/:id", upload.single("image"), postsController.addPost2);

router.post("/sendmail", postsController.sendMail);

module.exports = router;
