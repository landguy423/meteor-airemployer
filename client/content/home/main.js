Template.subscribepanel.events({
  'click #subscribebutton': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});

    var subscribeemail = t.find('#inputemail').value;

    t.find('#inputemail').value = null;

    Meteor.call('newsubscriber',subscribeemail);

    sweetAlert({ 
      title: "", 
      text: "Thank you for subscribing to Air Entrepreneur", 
      timer: 7000, 
      type: 'success'
    }); 

  },
});

