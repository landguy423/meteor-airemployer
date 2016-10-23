Meteor.methods({  
  removefile: function(id) {
    Collections.files.remove(id);

    return true;
  },
  
  uploadprofilepicture: function(personid,fileid) {
    var person = Person.findOne(personid);
    if(person.uploadimageid){ Meteor.call('removefile',person.uploadimageid); }
    person.uploadimageid = fileid;
    Meteor.call('updateperson',person);
  },
  
});