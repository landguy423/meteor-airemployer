Session.set('postsort','rank');

Template.postlist.helpers({
  sort: function () {
    return Session.get('postsort');
  },
  list: function () {
    if(Session.get('postsort') === 'date'){ return Post.find({published: true, archived: {$ne: true}},{sort: {datecreate:-1}, limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'rank'){ return Post.find({published: true, archived: {$ne: true}},{sort: {countvote:-1}, limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'trend'){ return Post.find({published: true, archived: {$ne: true}},{sort: {countcomment:-1}, limit: Session.get('articlelimit')}); }
  },
});

Template.postlist.events({
  'click #sort': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    if(Session.get('postsort') === 'rank'){ Session.set('postsort','date'); }
    else if(Session.get('postsort') === 'date'){ Session.set('postsort','trend'); }
    else if(Session.get('postsort') === 'trend'){ Session.set('postsort','rank'); }
  },
});

Template.postthumbnail.helpers({
  personname: function () {
    var person = Person.findOne(this.personid);
    if(!person){ return null; }
    return person.firstname + ' ' + person.lastname;
  },
  fromwhen: function () {
    return moment(this.datecreate).fromNow();
  },
  showedit: function () {
    var person = Session.get('person');
    if(!person){ return false; }
    if(person._id === this.personid){ return true; }
    else { return false; }
  },
  showadmin: function () {
    var person = Session.get('person');
    if(!person){ return false; }
    if(person.isadmin){ return true; }
    else { return false; }
  },
  picture: function () {
    var person = Person.findOne(this.toString());
    if(!person || !person.uploadimageid){ return '/resources/profilepicture.png'; }

    var uploadimageid = person.uploadimageid;
    var file = Collections.files.findOne(uploadimageid);
    if(!file || !file.versions){ return '/resources/profilepicture.png'; }
    
    var directlink = null;// file.versions.original.meta.pipeFrom;
    
    //if(file.versions.original && file.versions.original.meta){ directlink = file.versions.original.meta.pipeFrom; }
    if(file.versions.thumbnail && file.versions.thumbnail.meta){ directlink = file.versions.thumbnail.meta.pipeFrom; }
    else if(file.versions.preview && file.versions.preview.meta){ directlink = file.versions.preview.meta.pipeFrom; }

    if(directlink){ return directlink; }
    else { return '/resources/profilepicture.png'; }
  },
});

Template.postthumbnail.events({
  'click #title': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    console.log(this);
    if(this.type === 'link'){ window.open(this.link,"_blank"); }
    if(this.type === 'post'){ Router.go('postpage', {postid: this._id}); }
  },
  'click #rank': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    var person = Session.get('person');
    if(!person){ return null; }
    Meteor.call('likepost',person._id,this._id);
  },
  'click #summary #addacomment': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    Router.go('postpage', {postid: this._id});
  },
});

Template.postpage.helpers({
  personname: function () {
    var person = Person.findOne(this.personid);
    if(!person){ return null; }
    return person.firstname + ' ' + person.lastname;
  },
  fromwhen: function () {
    return moment(this.datecreate).fromNow();
  },
  showedit: function () {
    var person = Session.get('person');
    if(!person){ return null; }
    if(person._id === this.personid){ return true; }
    else { return false; }
  },
  showadmin: function () {
    var person = Session.get('person');
    if(!person){ return false; }
    if(person.isadmin){ return true; }
    else { return false; }
  },
  sort: function () {
    return Session.get('commentsort');
  },
  picture: function () {
    var person = Person.findOne(this.toString());
    if(!person || !person.uploadimageid){ return '/resources/profilepicture.png'; }

    var uploadimageid = person.uploadimageid;
    var file = Collections.files.findOne(uploadimageid);
    if(!file || !file.versions){ return '/resources/profilepicture.png'; }
    
    var directlink = null;// file.versions.original.meta.pipeFrom;
    
    //if(file.versions.original && file.versions.original.meta){ directlink = file.versions.original.meta.pipeFrom; }
    if(file.versions.thumbnail && file.versions.thumbnail.meta){ directlink = file.versions.thumbnail.meta.pipeFrom; }
    else if(file.versions.preview && file.versions.preview.meta){ directlink = file.versions.preview.meta.pipeFrom; }

    if(directlink){ return directlink; }
    else { return '/resources/profilepicture.png'; }
  },
});

Template.postpage.events({
  'click #title': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    console.log(this);
    if(this.type === 'link'){ window.open(this.link,"_blank"); }
    if(this.type === 'post'){ Router.go('postpage', {postid: this._id}); }
  },
  'click #rank': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    var person = Session.get('person');

    Meteor.call('likepost',person._id,this._id);
  },
  'click #sort': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    if(Session.get('commentsort') === 'rank'){ Session.set('commentsort','date'); }
    else if(Session.get('commentsort') === 'date'){ Session.set('commentsort','trend'); }
    else if(Session.get('commentsort') === 'trend'){ Session.set('commentsort','rank'); }
  },
});

Template.createcomment.helpers({
  picture: function () {
    var person = Session.get('person');
    if(!person || !person.uploadimageid){ return '/resources/profilepicture.png'; }

    var uploadimageid = person.uploadimageid;
    var file = Collections.files.findOne(uploadimageid);
    if(!file || !file.versions){ return '/resources/profilepicture.png'; }
    
    var directlink = null;// file.versions.original.meta.pipeFrom;
    
    //if(file.versions.original && file.versions.original.meta){ directlink = file.versions.original.meta.pipeFrom; }
    if(file.versions.thumbnail && file.versions.thumbnail.meta){ directlink = file.versions.thumbnail.meta.pipeFrom; }
    else if(file.versions.preview && file.versions.preview.meta){ directlink = file.versions.preview.meta.pipeFrom; }

    if(directlink){ return directlink; }
    else { return '/resources/profilepicture.png'; }
  },
});

Template.createcomment.onRendered(function () {
  this.$('#inputcomment').trumbowyg({ btns: [
        'btnGrp-semantic',
        ['link'],
        'btnGrp-lists',
        ['horizontalRule'],
    ], autogrow: true });
});

Template.createcomment.events({
  'click #createcomment #subscribe': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
  },
  'click #createcomment #postcomment': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person');

    var comment = t.find('#inputcomment').value; // string

    var postid = this._id; var replyid = null;
    if(this.postid){ postid = this.postid; replyid = this._id; }

    if(!comment){
      sweetAlert({ 
        title: "", 
        text: "Please enter a comment", 
        timer: 7000, 
        type: 'info'
      }); return false; 
    } else { t.$('#inputcomment').trumbowyg('empty'); }

    Session.set('replytocommentid',null);
    Meteor.call('newcomment',postid,person._id,comment,replyid);
  },
});

Session.set('commentsort','date');

Template.commentlist.helpers({
  list: function () {
    var list = null;
    if(this.postid){
      if(Session.get('commentsort') === 'date'){ list = PostComment.find({replyid: this._id, published: true, archived: {$ne: true}},{sort: {datecreate:-1},limit: Session.get('articlelimit')}); }
      else if(Session.get('commentsort') === 'rank'){ list = PostComment.find({replyid: this._id, published: true, archived: {$ne: true}},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
      else if(Session.get('commentsort') === 'trend'){ list = PostComment.find({replyid: this._id, published: true, archived: {$ne: true}},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
    } else { 
      if(Session.get('commentsort') === 'date'){ list = PostComment.find({replyid: null, postid: this._id, published: true, archived: {$ne: true}},{sort: {datecreate:-1},limit: Session.get('articlelimit')}); }
      else if(Session.get('commentsort') === 'rank'){ list = PostComment.find({replyid: null, postid: this._id, published: true, archived: {$ne: true}},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
      else if(Session.get('commentsort') === 'trend'){ list = PostComment.find({replyid: null, postid: this._id, published: true, archived: {$ne: true}},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
    }
    if(!list.count()){ return false; }
    else { return list; }
  },
  lastactive: function () {
    return moment(this.lastactive).fromNow();
  },
});

Template.commentlist.events({
  'click #favorite': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    var person = Session.get('person');
    if(!person){ return null; }
    Meteor.call('likecomment',person._id,this._id);
  },
  'click #archive': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    
    Meteor.call('archivecomment',this);
  },
  'click #reply': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    Session.set('replytocommentid',this._id);
  },
});

Template.commentthumbnail.helpers({
  name: function () {
    var person = Person.findOne(this.personid);
    if(!person){ return null; }
    return person.firstname + ' ' + person.lastname;
  },
  fromwhen: function () {
    return moment(this.datecreate).fromNow();
  },
  showedit: function () {
    var person = Session.get('person');
    if(!person){ return null; }
    if(person._id === this.personid){ return true; }
    else { return false; }
  },
  showreply: function () {
    if(this._id === Session.get('replytocommentid')){ return true; }
    else { return false; }
  },
  picture: function () {
    var person = Person.findOne(this.personid);
    if(!person || !person.uploadimageid){ return '/resources/profilepicture.png'; }

    var uploadimageid = person.uploadimageid;
    var file = Collections.files.findOne(uploadimageid);
    if(!file || !file.versions){ return '/resources/profilepicture.png'; }
    
    var directlink = null;// file.versions.original.meta.pipeFrom;
    
    //if(file.versions.original && file.versions.original.meta){ directlink = file.versions.original.meta.pipeFrom; }
    if(file.versions.thumbnail && file.versions.thumbnail.meta){ directlink = file.versions.thumbnail.meta.pipeFrom; }
    else if(file.versions.preview && file.versions.preview.meta){ directlink = file.versions.preview.meta.pipeFrom; }

    if(directlink){ return directlink; }
    else { return '/resources/profilepicture.png'; }
  },
  isadmin: function () {
    var person = Session.get('person');
    if(person.isadmin){ return true; }
    else { return false; }
  },
});