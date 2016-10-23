Meta.config({ options: { title: "Air Entrepreneur", suffix: "Air Entrepreneur" } }); 

Template.client.onRendered(function () {
  Session.set('articlelimit',7);

  var infiniteScroll = new InfiniteScroll('.infscroll');

  infiniteScroll.onInfinite(function(){
    var articlelimit = Session.get('articlelimit');
    articlelimit = articlelimit+7;
    Session.set('articlelimit',articlelimit);
  });

  infiniteScroll.run();
});

Template.client.helpers({
  personid: function () {
    if(!Meteor.user()) {
      Session.set('person',null);
      return false; 
    } else {
      var person = Person.findOne({ userid: Meteor.userId() });
      if(person && (!Session.get('person') || Session.get('person') !== person)){ 
        Meteor.call('checkadmin',person);
        Session.set('person',person); 
        return person._id; 
      } else { 
        return false; 
      }
    } if(Session.get('person')){
      return Session.get('person')._id;
    } 
  },
  minheight: function () {
    var height = Session.get('contentheight');
    return height - 27;
  },
});

Template.client.events({
  'click #client': function (e,t) {
    $('#topbar #inputsearch input').val(null);
    $('#topbar #inputsearch input').change();
  },
  'click .clickcreate': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person'); if(!person){ Router.go('signup'); return false; }

    Session.set('sharetype',null); Session.set('sharetoggle',true);
  },
  'click .clickcreatelink': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person'); if(!person){ Router.go('signup'); return false; }

    Session.set('sharetype','link'); Session.set('sharetoggle',true);
  },
  'click .clickcreatepost': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person'); if(!person){ Router.go('signup'); return false; }

    Session.set('sharetype','post'); Session.set('sharetoggle',true);
  },
  'click .clickarchivepost': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    Meteor.call('archivepost',this);
  },
  'click .clickfacebooklike': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    window.open("https://www.facebook.com/Air-Entrepreneur-854351298029873/","_blank");
  },
  'click .clickinstagramlike': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    window.open("https://www.instagram.com/airentrepreneur/","_blank");
  },
  'click .clicktwitterfollow': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    window.open("https://twitter.com/airentrepreneur","_blank");
  },
  'click .clickcontactus': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person'); if(!person){ Router.go('signup'); return false; }
  },
  'click .clickeditpost': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var person = Session.get('person'); if(!person){ Router.go('signup'); return false; }

    Session.set('sharetype', this.type); 
    Session.set('sharepostid', this._id);
    Session.set('sharetoggle', true);
  },
});