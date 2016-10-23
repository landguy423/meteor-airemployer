Template.customize.onRendered(function () {
  //Session.set('customizetoggle',false);
});

Template.customize.helpers({
  person: function () {
    console.log(Session.get('person'));
    return Session.get('person');
  },
  top: function () {
    if(Session.get('customizetoggle')){ return '17px'; }
    else { return 'calc(-100% - 130px)'; }
  },
  opacity: function () {

    if(Session.get('customizetoggle')){ return 1; }
    else { return 0; }
  },
  pointer: function () {

    if(Session.get('customizetoggle')){ return 'auto'; }
    else { return 'none'; }
  },
});

Template.customize.events({
  'click #customizebg': function (e,t) {
    Session.set('customizetoggle',false);
  },
  'click #savebutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var firstname = t.find('#inputfirstname').value; // string
    var lastname = t.find('#inputlastname').value; // string
    
    if(!firstname || !lastname){
      sweetAlert({ 
        title: "", 
        text: "Please fill out all fields.", 
        timer: 7000, 
        type: 'error'
      }); return false;
    }

    Session.set('customizetoggle',false);

    this.firstname = firstname;
    this.lastname = lastname;

    Meteor.call('updateperson',this);

    sweetAlert({ 
      title: "", 
      text: "Your profile has been saved.", 
      timer: 7000, 
      type: 'success'
    });

  },
});
