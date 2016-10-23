Session.set('sharetoggle',false);
Session.set('sharetype',null);

Template.wysiwyg.onRendered(function () {
  $('.wysiwyg').trumbowyg({ btns: [
        ['viewHTML'],
        ['formatting'],
        'btnGrp-semantic',
        ['superscript', 'subscript'],
        ['link'],
        //['insertImage'],
        'btnGrp-justify',
        'btnGrp-lists',
        ['horizontalRule'],
        ['removeformat'],
        //['fullscreen']
    ], autogrow: true });
});

Template.share.helpers({
  top: function () {

    if(Session.get('sharetoggle')){ return '97px'; }
    else { return '-100%'; }
  },
  opacity: function () {

    if(Session.get('sharetoggle')){ return 1; }
    else { return 0; }
  },
  pointer: function () {

    if(Session.get('sharetoggle')){ return 'auto'; }
    else { return 'none'; }
  },
  sharepost: function () {
    if(Session.get('sharetype') === 'post'){ 
      var person = Session.get('person');
      var sharepostid = Session.get('sharepostid');
      if(!sharepostid){
        Meteor.call('newpost' , person._id , 'post', function(error,result){ 
          if(result){ Session.set('sharepostid', result); }
        });
      } else { return Post.findOne(sharepostid); }
      return true; }
    else { return false; }
  },
  sharelink: function () {
    if(Session.get('sharetype') === 'link'){ 
      var person = Session.get('person');
      var sharepostid = Session.get('sharepostid');
      if(!sharepostid){
        Meteor.call('newpost' , person._id , 'link', function(error,result){ 
          if(result){ Session.set('sharepostid', result); }
        });
      } else { return Post.findOne(sharepostid); }
      return true; }
    else { return false; }
  },
});

Template.share.events({
  'click #sharebg': function (e,t) {
    Session.set('sharetoggle',false);
  },
  'click #sharepost #createbutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person');
    if(person.isbanned){
      sweetAlert({ 
        title: "", 
        text: "You have been banned.", 
        timer: 7000, 
        type: 'error'
      }); return false; 
    }

    var title = t.find('#inputtitle').value; // string
    var body = t.find('#inputbody').value; // string

    if(!title || !body){
      sweetAlert({ 
        title: "", 
        text: "Please fill all fields", 
        timer: 7000, 
        type: 'error'
      }); return false; 
    }

    t.find('#inputtitle').value = null;
    t.find('#inputbody').value = null;

    this.published = true; this.archived = false;

    this.type = 'post';

    this.title = title;
    this.body = body;

    Meteor.call('updatepost',this); Session.set('sharepostid', null);

    Session.set('sharetoggle',false);
      sweetAlert({ 
        title: "", 
        text: "Your post has been published.", 
        timer: 7000, 
        type: 'success'
      });
  },
  'click #sharelink #createbutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person');
    if(person.isbanned){
      sweetAlert({ 
        title: "", 
        text: "You have been banned.", 
        timer: 7000, 
        type: 'error'
      }); return false; 
    }

    var title = t.find('#inputtitle').value; // string
    var link = t.find('#inputlink').value; // string
    
    if(!title || !link){
      sweetAlert({ 
        title: "", 
        text: "Please fill out all fields.", 
        timer: 7000, 
        type: 'error'
      }); return false;
    }

    t.find('#inputtitle').value = null;
    t.find('#inputlink').value = null;

    this.published = true; this.archived = false;

    this.type = 'link';

    this.title = title;
    this.link = link;
    this.domain = extractDomain(link);

    Meteor.call('updatepost',this); Session.set('sharepostid', null);

    Session.set('sharetoggle',false);
      sweetAlert({ 
        title: "", 
        text: "Your post has been published.", 
        timer: 7000, 
        type: 'success'
      });
  },
  'click #sharepost #archivebutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    
    this.published = true; this.archived = true;

    Meteor.call('updatepost',this); Session.set('sharepostid', null);

    Session.set('sharetoggle',false);
      sweetAlert({ 
        title: "", 
        text: "Your post has been deleted.", 
        timer: 7000, 
        type: 'info'
      });
  },
  'click #sharelink #archivebutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    
    this.published = true; this.archived = true;

    Meteor.call('updatepost',this); Session.set('sharepostid', null);

    Session.set('sharetoggle',false);
      sweetAlert({ 
        title: "", 
        text: "Your post has been deleted.", 
        timer: 7000, 
        type: 'info'
      });
  },
});

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}