var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin;
var posts = require('../controllers/posts');
var comments = require('../controllers/comments');
// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', posts.get);
// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
	res.render('create');
});
// POST /posts 发表一篇文章
router.post('/', checkLogin, posts.post);
// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', posts.getInfoById);
// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, posts.getEditPosts);
// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, posts.postEditPosts);
// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin,posts.deletes);
// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, comments.post);
// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, comments.deletes);

module.exports = router;