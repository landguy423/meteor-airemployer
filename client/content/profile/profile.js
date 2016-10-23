Template.profilethumbnail.helpers({
  showedit: function () {
    var person = Session.get('person');
    if(person._id === this._id){ return true; }
    else { return false; }
  },
  showban: function () {
    var person = Session.get('person');
    if(!person || !person.isadmin || person._id === this._id){ return false; }
    else { return true; }
  },
  showadmin: function () {
    var person = Session.get('person');
    if(!person || !person.isadmin || person._id !== this._id){ return false; }
    else { return true; }
  },
  picture: function () {
    if(!this || !this.uploadimageid){ return '/resources/profilepicture.png'; }
    
    var uploadimageid = this.uploadimageid;
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

Template.profilethumbnail.events({
  'click #menu1 #edit': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    if(Session.get('customizetoggle')){ Session.set('customizetoggle',false); }
    else { Session.set('customizetoggle',true); }
  },
  'click #menu1 #ban': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    Meteor.call('banperson',this);
  },
});

Template.profile.onRendered(function () {
  Session.set('profilenav','default');
});

Template.profile.helpers({
  defaultactive: function () {
    if(Session.get('profilenav') === 'default'){ return 'active'; }
    else { return false; }
  },
  favoritesactive: function () {
    if(Session.get('profilenav') === 'favorites'){ return 'active'; }
    else { return false; }
  },
});

Template.profile.events({
  'click #defaultactive': function (e) {
    Session.set('profilenav','default');
  },
  'click #favoritesactive': function (e) {
    Session.set('profilenav','favorites');
  },
});

Session.set('postsort','rank');

Template.profilepost.helpers({
  sort: function () {
    return Session.get('postsort');
  },
  list: function () {
    var person = Session.get('person'); if(!person){ return null; }
    if(Session.get('postsort') === 'date'){ return Post.find({personid: person._id, published: true, archived: {$ne: true}},{sort: {datecreate:-1},limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'rank'){ return Post.find({personid: person._id, published: true, archived: {$ne: true}},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'trend'){ return Post.find({personid: person._id, published: true, archived: {$ne: true}},{sort: {countcomment:-1},limit: Session.get('articlelimit')}); }
  },
});

Template.profilefavorite.helpers({
  sort: function () {
    return Session.get('postsort');
  },
  list: function () {
    var person = Session.get('person'); if(!person){ return null; }
    if(Session.get('postsort') === 'date'){ return PostLike.find({state: true, personid: person._id},{sort: {datecreate:-1},limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'rank'){ return PostLike.find({state: true, personid: person._id},{sort: {countvote:-1},limit: Session.get('articlelimit')}); }
    else if(Session.get('postsort') === 'trend'){ return PostLike.find({state: true, personid: person._id},{sort: {countcomment:-1},limit: Session.get('articlelimit')}); }
  },
  post: function () {
    var post = Post.findOne(this.postid);
    return post;
  },
});

Template.profilepost.events({
  'click #sort': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    if(Session.get('postsort') === 'rank'){ Session.set('postsort','date'); }
    else if(Session.get('postsort') === 'date'){ Session.set('postsort','trend'); }
    else if(Session.get('postsort') === 'trend'){ Session.set('postsort','rank'); }
  },
});

Template.profilefavorite.events({
  'click #sort': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    if(Session.get('postsort') === 'rank'){ Session.set('postsort','date'); }
    else if(Session.get('postsort') === 'date'){ Session.set('postsort','trend'); }
    else if(Session.get('postsort') === 'trend'){ Session.set('postsort','rank'); }
  },
});
