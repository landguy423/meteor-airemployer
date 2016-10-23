Template.uploadprofileimage.onCreated(function () { this.currentUpload = new ReactiveVar(false); });
Template.uploadprofileimage.helpers({ currentUpload: function () { return Template.instance().currentUpload.get(); } });
Template.uploadprofileimage.events({
  'click #uploadbutton': function (e, template) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    var fileinput = template.$("#fileinput");
    fileinput.click();
  },
  'change #fileinput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {

      var currentUpload = template.currentUpload.get();
      if(!currentUpload){ template.currentUpload.set([]); }

      for (i = 0; i < e.currentTarget.files.length; i++) { 
        var upload = uploadnewfile(e,template,e.currentTarget.files[i],'profile picture',this._id);
        upload.start();
      }      
    } 
  }
});

function uploadnewfile(e,template,file,type,dataid) {
  var upload = Collections.files.insert({ file: file, streams: 'dynamic', chunkSize: 'dynamic' }, false);
  
  upload.on('start', function () { 
    var currentUpload = template.currentUpload.get();
    currentUpload.push(this);
    template.currentUpload.set(currentUpload); 
  });

  upload.on('end', function (error, fileObj) {
    if (error) { alert('Error during upload: ' + error);
    } else {
      if(type === 'profile picture'){ Meteor.call('uploadprofilepicture',dataid,fileObj._id); }
    }
    var currentUpload = template.currentUpload.get();
    currentUpload.splice(_.indexOf(currentUpload, _.findWhere(currentUpload, { file:{ name: this.file.name }})), 1);
    this.progress.complete = true;
    template.currentUpload.set(currentUpload); 
  });

  return upload;
}

Template.displayfile.helpers({
  image: function () {
    var uploadimageid = this.toString();
    var file = Collections.files.findOne(uploadimageid);
    if(!file || !file.versions || !file.versions.original || !file.versions.original.meta){ return null; }
    var directlink = file.versions.original.meta.pipeFrom;
    if(directlink){ return directlink; }
    else { return null; }
  },
});