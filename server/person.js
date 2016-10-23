Accounts.onCreateUser(function(options, user) {
  Meteor.call('spawnuser', user._id, options);
  return user;
}); 

adminemaillist = ['christopher.john.gayle@gmail.com','joe@primeeight.co.uk'];

Meteor.methods({ 
  checkadmin: function(personid) {
    var person = Person.findOne(personid);
    if(adminemaillist.indexOf(person.email) !== -1){ 
      person.isadmin = true; 
    } Meteor.call('updateperson',person);
  },
});
