
Meteor.methods({
  updatealluploads: function() {
    return updatealluploads(); 
  },//UPDATE AUDIO COUNTERS
});

function updatealluploads() {
  console.log(moment().format('h:mm:s a') + ') Start) Update Uploads');
    var uploadlist = Upload.find().fetch();
    uploadlist.every(function(fileupload){
      Meteor.call('checkfileupload',fileupload);
      return true;
    });  
    console.log(moment().format('h:mm:s a') + ') End) Update Uploads: '+Upload.find().count());
}


Meteor.startup(function () {
  var cloudStorage = process.env.CLOUD_DIR;
  if(!cloudStorage) { cloudStorage = process.env.PWD; console.log('---> Cloud Storage: Unavailable.'); }
  else { console.log('---> Cloud Storage: Available.'); }

  UploadServer.init({
    tmpDir: cloudStorage + '/.uploads/tmp',
    uploadDir: cloudStorage + '/.uploads/',
    uploadUrl: '/upload/',
    
    checkCreateDirectories: true,

    getDirectory: function(fileInfo, formData) {
      
      var directory = '';
      
      if(fileInfo) {
        
        if(fileInfo.type === 'application/octet-stream'){ directory = 'audio'; }
        if(fileInfo.type === 'audio/mp3'){ directory = 'audio'; }
        if(fileInfo.type === 'audio/x-m4a'){ directory = 'audio'; }
        if(fileInfo.type === 'audio/wav'){ directory = 'audio'; }

        if(fileInfo.type === 'image/png'){ directory = 'image'; }
        if(fileInfo.type === 'image/jpeg'){ directory = 'image'; }
        
      }
      
      fileInfo.originalname = fileInfo.name;
      return directory;
      
    },

    getFileName: function(fileInfo, formData) {

      if (formData && formData.prefix !== null) {

        return formData.prefix + '_' + fileInfo.name;

      }

      var code = Random.hexString(17);
      var isimage = false;

      if(fileInfo) {
        
        if(fileInfo.type === 'application/octet-stream'){ code = code + '.mp3'; } // AUD-
        if(fileInfo.type === 'audio/mp3'){ code = code + '.mp3'; }
        if(fileInfo.type === 'audio/x-m4a'){ code = code + '.mp3'; }
        if(fileInfo.type === 'audioe05dd5/wav'){ code = code + '.wav'; }

        if(fileInfo.type === 'image/png'){ code = code + '.png'; isimage = true; }
        if(fileInfo.type === 'image/jpeg'){ code = code + '.jpg'; isimage = true; }
        
      } 

      fileInfo.isimage = isimage;

      if(fileInfo.isimage){

        fileInfo.thumbnail = 'image/thumbnail/' + code;
        fileInfo.metathumbnail = 'image/metathumbnail/' + code;
        fileInfo.smallthumbnail = 'image/smallthumbnail/' + code;
        console.log(fileInfo.smallthumbnail);

      }
      return code;

    },
    
    imageVersions: { 

      thumbnail: {width: 1024, height: 1024}, 
      metathumbnail: {width: 600, height: 315},
      smallthumbnail: {width: 640, height: 640} 

    },

    finished: function(fileInfo) {

    }

  });
});