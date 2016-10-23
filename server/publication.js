Meteor.publish("post", function () { return Post.find(); });
Meteor.publish("postlike", function () { return PostLike.find(); });
Meteor.publish("postcomment", function () { return PostComment.find(); });
Meteor.publish("postcommentlike", function () { return PostCommentLike.find(); });
Meteor.publish("postsubscribe", function () { return PostSubscribe.find(); });
Meteor.publish("person", function () { return Person.find(); });