Template.topbar.helpers({
  personid: function () {
    var person = Session.get('person');

    if(person){ return person._id; }
    else { return null; }
  },
  showregister: function () {
    var person = Session.get('person');

    if(!person){ return true; }
    else { return false; }
  },
});

Template.searchprofile.helpers({
  searchIndex: function () {
    return PersonIndex;
  },
  searchAttributes: function () {
    var attributes = {placeholder: 'Search...'};
    return attributes;
  },
});

Template.searchpost.helpers({
  searchIndex: function () {
    return PostIndex;
  },
  searchAttributes: function () {
    var attributes = {placeholder: 'Search...'};
    return attributes;
  },
});