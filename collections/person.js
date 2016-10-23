Meteor.methods({

  spawnuser: function(userid,options){
    Meteor.call('newperson', userid, options.profile.firstname, options.profile.lastname, options.email, function(error, personid) {
      if(personid){
        var person = Person.findOne(personid);
        person.firstname = options.profile.firstname;
        person.lastname = options.profile.lastname;

        Meteor.call('updateperson',person);
      }
    });
  },

  newperson: function(userid,firstname,lastname,email) {


    var mailingLists = new MailChimpLists( 'f60256088077f93722dce65c774f4ddf-us4', { version : '2.0' } );

    mailingLists.subscribe({ 
      id: 'a6fd8a68c9',
      email: { email: email },
      double_optin: false
    });

    var person = {
      indexnumber: Person.find().count()+1,
      datecreate: moment().valueOf(),

      userid: userid,

      firstname: firstname, 
      lastname: lastname,
      
      uploadimageid: null,

      email: email, confirmEA: false
    };
    var personid = Person.insert(person);
    return personid;
  },

  newsubscriber: function(email) {
    var subscriber = Subscriber.findOne({email: email});

    var mailingLists = new MailChimpLists( 'f60256088077f93722dce65c774f4ddf-us4', { version : '2.0' } );

    mailingLists.subscribe(
        { 
          id: 'fe65f9afb8',
          email: { email: email },
          double_optin: false
        },
        // Callback beauty in action
        function ( error, result ) {
            if ( error ) {
                console.error( '[SUBSCRIBE][List] Error: %o', error );
            } else {
                // Do something with your data!
                console.info( '[SUBSCRIBE][List]: %o', result );
            }
        }
    );

    if(!subscriber){
      subscriber = {
        datecreate: moment().valueOf(),

        email: email,
      };
      return Subscriber.insert(subscriber);
    } else { return subscriber._id; }
  },

  banperson: function(person) {
    if(person.isbanned){ person.isbanned = false; }
    else { person.isbanned = true; }
    Meteor.call('updateperson',person);
  },

  updateperson: function(person) {
    var oldperson = Person.findOne(person._id);
    if(oldperson.uploadimageid !== person.uploadimageid){ Meteor.call('removefile',oldperson.uploadimageid); }
    Person.update(person._id,person);
  },
  
  renameperson: function(person) {
    if(person.userid){

      var oldperson = Person.findOne(person._id);

      if(person.email !== oldperson.email && Person.find({email: person.email}).count() === 0){
        Meteor.users.update({_id:person.userid},{$set:{"emails.0.address":person.email}}); 
        person.confirmEA = false;
      } else if(person.email !== oldperson.email){ 
        console.log(person.email + ' - from - ' + oldperson.email);
        console.log('Cannot host duplicate accounts on a single email addresses.'); 
        return false;
      }
    }
    Person.update(person._id,person);
  },
  
});

/* jshint ignore:start */
Person = new Meteor.Collection('person'), PersonIndex = new EasySearch.Index({
    collection: Person, fields: ['firstname','lastname'], defaultSearchOptions: {limit: 2}, engine: new EasySearch.Minimongo()
  });
Subscriber = new Meteor.Collection('subscriber');
/* jshint ignore:end */
///////////////////////////////////////////