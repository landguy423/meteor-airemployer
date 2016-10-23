Session.setDefault('contentwidth',null);
Session.setDefault('contentheight',null);

Template.interfacemeasure.onRendered(function () {
	calculatecontentsize();
});

$(function() {
  $(window).resize(function() { calculatecontentsize(); });
});

function calculatecontentsize(route) {
    var contentwidth = parseInt($('#interfacemeasure').css('width'));
    Session.set('contentwidth',contentwidth);

    var contentheight = parseInt($('#interfacemeasure').css('height'));
    Session.set('contentheight',contentheight);
}
////////
////////
////////
