/**
 * 文章评论控制器
 * @type {[type]}
 */
 var CommentModel = require('../models/comments');

 var comments={
 	get:function(req,res,next){

 	},
 	post:function(req,res,next){
 		var author = req.session.user._id;
 		var postId = req.params.postId;
 		var content = req.fields.content;
 		var comment = {
 			author: author,
 			postId: postId,
 			content: content
 		};

 		CommentModel.create(comment)
 		.then(function () {
 			req.flash('success', '留言成功');
	      // 留言成功后跳转到上一页
	      res.redirect('back');
	  })
 		.catch(next);
 	},
 	deletes:function(req,res,next){
 		var commentId = req.params.commentId;
 		var author = req.session.user._id;

 		CommentModel.delCommentById(commentId, author)
 		.then(function () {
 			req.flash('success', '删除留言成功');
	      // 删除成功后跳转到上一页
	      res.redirect('back');
	  })
 		.catch(next);
 	}	
 }
 module.exports =comments;