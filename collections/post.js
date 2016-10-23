Meteor.methods({

  newpost: function(personid,type) {

    var post = Post.findOne({archived: {$ne: true}, personid: personid, type: type, published: {$ne: true}});

    if(post){ return post._id; }

    post = {
      published: false, archived: false,
      datecreate: moment().valueOf(),
      personid: personid, type: type,

      title: null,
      link: null,
      body: null,

      images: [],
      persons: [personid],
      posttopic: [],

      countvote: 0,
      countcomment: 0,
    };

    return Post.insert(post);
  },

  archivepost: function(post) {
    if(post.archived){ post.archived = false; }
    else { post.archived = true; }
    
    Meteor.call('updatepost',post);
    return true;
  },

  newcomment: function(postid,personid,comment,replyid) {

    comment = { 
      published: true, archived: false,
      datecreate: moment().valueOf(),
      postid: postid, 
      personid: personid,
      replyid: replyid,

      comment: comment,

      countvote: 0,
      countcomment: 0,
    };

    var commentid = PostComment.insert(comment);

    var post = Post.findOne(postid);

    if(!post.persons){ post.persons = []; }
    if(post.persons.indexOf(personid) === -1){ post.persons.push(personid); }

    post.countcomment = PostComment.find({published: true, archived: false, postid: postid}).count();
    Meteor.call('updatepost',post);
  },

  archivecomment: function(comment) {
    if(!comment){ return false; }

    var replylist = PostComment.find({replyid: comment._id}).fetch();
    replylist.forEach(function(reply){
      Meteor.call('archivecomment',reply);
    });

    comment.archived = true;
    
    Meteor.call('updatecomment',comment);
    return true;
  },

  updatecomment: function(comment) {
    if(!comment){ return false; }

    var oldcomment = PostComment.findOne(comment._id);
    if(!oldcomment.published){ comment.datecreate = moment().valueOf(); }
    PostComment.update(comment._id,comment);

    var post = Post.findOne(comment.postid);
    post.countcomment = PostComment.find({published: true, archived: false, postid: comment.postid}).count();
    Meteor.call('updatepost',post);
    return true;
  },

  updatepost: function(post) {
    if(!post){ return false; }

    if(post.images){
      post.images.forEach(function(imageid){
        var image = Collections.files.findOne(imageid);
        if(!image){ post.images = _.without(post.images,imageid); }
      });
    }

    var oldpost = Post.findOne(post._id);
    if(!oldpost.published){ post.datecreate = moment().valueOf(); }
    Post.update(post._id,post);

    return true;
  },

  likepost: function(personid,postid) {
    var post = Post.findOne(postid);
    if(!post){ return false; }

    var postlikeid = null;
    var postlike = PostLike.findOne({postid: postid, personid: personid});
    if(!postlike) { 
      postlike = {
        datecreate: moment().valueOf(),
        personid: personid,
        postid: postid,
        state: true,
      }; 
      postlikeid = PostLike.insert(postlike);
    } else { 
      postlikeid = postlike._id; 
      if(postlike.state){ postlike.state = false; }
      else { postlike.state = true; }
      PostLike.update(postlikeid,postlike);
    }
    console.log(postlike);
    
    post.countvote = PostLike.find({postid: postid, state: true}).count();
    Meteor.call('updatepost',post);

    return postlikeid;
  },

  likecomment: function(personid,commentid) {
    var comment = PostComment.findOne(commentid);
    if(!comment){ return false; }

    var postcommentlikeid = null;
    var postcommentlike = PostCommentLike.findOne({commentid: commentid, personid: personid});
    if(!postcommentlike) { 
      postcommentlike = {
        datecreate: moment().valueOf(),
        personid: personid,
        commentid: commentid,
        state: true,
      }; 
      postlikeid = PostCommentLike.insert(postcommentlike);
    } else { 
      postlikeid = postcommentlike._id; 
      if(postcommentlike.state){ postcommentlike.state = false; }
      else { postcommentlike.state = true; }
      PostCommentLike.update(postlikeid,postcommentlike);
    }
    console.log(postcommentlike);
    
    comment.countvote = PostCommentLike.find({commentid: commentid, state: true}).count();
    Meteor.call('updatecomment',comment);

    return postcommentlikeid;
  },

});

/* jshint ignore:start */
Post = new Meteor.Collection('post'), PostIndex = new EasySearch.Index({
    collection: Post, fields: ['title'], defaultSearchOptions: {limit: 2}, engine: new EasySearch.Minimongo()
  });
PostLike = new Meteor.Collection('postlike');
PostComment = new Meteor.Collection('postcomment');
PostCommentLike = new Meteor.Collection('postcommentlike');
PostSubscribe = new Meteor.Collection('postsubscribe');
/* jshint ignore:end */
///////////////////////////////////////////