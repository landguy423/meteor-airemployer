Template.privacypolicy.helpers({
  width: function () {
  	var value = Session.get('contentwidth');
  	if(value > 1200){ return 1200; }
  	return value;
  },
  height: function () {
  	var value = Session.get('contentheight');
  	return value - 150;
  },
});