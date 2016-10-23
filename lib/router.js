Router.configure({ 
  layoutTemplate: 'client',
  trackPageView: true
});
//--------------------------------------------------------------------//
registerroutes = ['register','signup','signin'];
adminroutes = ['admin'];
//--------------------------------------------------------------------//
Router.onBeforeAction(function () {
  this.next();
});
//--------------------------------------------------------------------//
Router.onAfterAction(function () {
  $("#client").scrollTo(0,0);

  var route = Router.current().route.getName(); 
  var person = Session.get('person');

  Session.set('sharetoggle',false);
  Session.set('customizetoggle',false);
  Session.set('articlelimit',7);

  if(Meteor.user()){
    if(registerroutes.indexOf(route) !== -1){ Router.go('home'); }
  } //else if(registerroutes.indexOf(route) === -1){ Router.go('signup'); }

  if(adminroutes.indexOf(route) !== -1){ 
    if(!person || !person.isadmin){ Router.go('home'); }
  }

});
//--------------------------------------------------------------------//
function pageTitle(route) {
  if(route === 'viewmap'){ return 'Map'; }
  return route[0].toUpperCase() + route.substring(1);
}
//--------------------------------------------------------------------//
Router.map(function() {  

  this.route('home', { path: '/', waitOn: function() { return Meteor.subscribe('post'); }, fastRender: true, });

  this.route('admin', { path: '/admin', fastRender: true, });

  this.route('privacypolicy', { path: '/privacypolicy', fastRender: true, });

  this.route('signup', { path: '/account/signup', fastRender: true, });
  this.route('signin', { path: '/account/signin', fastRender: true, });

  this.route('application', { path: '/application', fastRender: true, 
    waitOn: function() { return Meteor.subscribe('lot'); },
  });
  
  this.route('postpage', { 
    path: '/post/:postid', 
    waitOn: function() { return Meteor.subscribe('post'); }, fastRender: true, 
    data: function() { 
      return Post.findOne(this.params.postid);
    },
  });
  
  this.route('profile', { 
    path: '/profile/:personid', 
    waitOn: function() { return Meteor.subscribe('person'); }, fastRender: true, 
    data: function() { 
      return Person.findOne(this.params.personid);
    },
  });
});
