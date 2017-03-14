var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

var posts={
	get:function(req,res,next){
		var author = req.query.author;
		PostModel.getPosts(author)
		.then(function (posts) {
			res.render('posts', {
				posts: posts
			});
		})
		.catch(next);
	},
	post:function(req,res,next){
		var author = req.session.user._id;
		var title = req.fields.title;
		var content = req.fields.content;

		  // 校验参数
		  try {
		  	if (!title.length) {
		  		throw new Error('请填写标题');
		  	}
		  	if (!content.length) {
		  		throw new Error('请填写内容');
		  	}
		  } catch (e) {
		  	req.flash('error', e.message);
		  	return res.redirect('back');
		  }

		  var post = {
		  	author: author,
		  	title: title,
		  	content: content,
		  	pv: 0
		  };

		  PostModel.create(post)
		  .then(function (result) {
	      // 此 post 是插入 mongodb 后的值，包含 _id
	      post = result.ops[0];
	      req.flash('success', '发表成功');
	      // 发表成功后跳转到该文章页
	      res.redirect(`/posts/${post._id}`);
	  })
		  .catch(next);
		},
		getInfoById:function(req,res,next){
			var postId = req.params.postId;

			Promise.all([
		    PostModel.getPostById(postId),// 获取文章信息
		    CommentModel.getComments(postId),// 获取该文章所有留言
		    PostModel.incPv(postId)// pv 加 1
		    ])
			.then(function (result) {
				var post = result[0];
				var comments = result[1];
				if (!post) {
					throw new Error('该文章不存在');
				}

				res.render('post', {
					post: post,
					comments: comments
				});
			})
			.catch(next);
		},
		getEditPosts:function(req,res,next){
			var postId = req.params.postId;
			var author = req.session.user._id;

			PostModel.getRawPostById(postId)
			.then(function (post) {
				if (!post) {
					throw new Error('该文章不存在');
				}
				if (author.toString() !== post.author._id.toString()) {
					throw new Error('权限不足');
				}
				res.render('edit', {
					post: post
				});
			})
			.catch(next);
		},
		postEditPosts:function(req,res,next){
			var postId = req.params.postId;
			var author = req.session.user._id;
			var title = req.fields.title;
			var content = req.fields.content;

			PostModel.updatePostById(postId, author, { title: title, content: content })
			.then(function () {
				req.flash('success', '编辑文章成功');
		      // 编辑成功后跳转到上一页
		      res.redirect(`/posts/${postId}`);
		  })
			.catch(next);
		},
		deletes:function(req,res,next){
			var postId = req.params.postId;
			var author = req.session.user._id;

			PostModel.delPostById(postId, author)
			.then(function () {
				req.flash('success', '删除文章成功');
		      // 删除成功后跳转到主页
		      res.redirect('/posts');
		  })
			.catch(next);
		}
	}
	module.exports =posts;
