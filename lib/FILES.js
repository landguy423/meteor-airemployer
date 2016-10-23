/*
meteor npm install dropbox@=0.10.3
meteor npm install request
meteor npm install fs
meteor npm install fs-extra

meteor add ostrio:files
meteor add ecmascript
meteor add cfs:graphicsmagick
meteor add meteorhacks:subs-manager
meteor add aldeed:simple-schema
meteor add aldeed:collection2
meteor add reactive-var
meteor add http
meteor add ostrio:files
meteor add meteorhacks:npm
*/

if (Meteor.isClient) {
  Meteor.subscribe('files.collections.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.collections.all', function () {
    return Collections.files.find().cursor;
  });
}
/* jshint ignore:start */
var Dropbox, Dropbox, _origRemove, bound, client, fs, knox, ref, ref1, ref2, ref3, useDropBox, useS3;

useDropBox = true;

useS3 = false;

if (Meteor.isServer) {
  if ((ref = process.env) != null ? ref.DROPBOX : void 0) {
    Meteor.settings.dropbox = (ref1 = JSON.parse(process.env.DROPBOX)) != null ? ref1.dropbox : void 0;
  } 

  if (Meteor.settings.dropbox && Meteor.settings.dropbox.key && Meteor.settings.dropbox.secret && Meteor.settings.dropbox.token) {
    useDropBox = true;
    Dropbox = Meteor.npmRequire('dropbox');
    Request = Meteor.npmRequire('request');
    fs = Meteor.npmRequire('fs');

    //import fs from 'fs';
    bound = Meteor.bindEnvironment(function(callback) {
      return callback();
    });
    client = new Dropbox.Client({
      key: Meteor.settings.dropbox.key,
      secret: Meteor.settings.dropbox.secret,
      token: Meteor.settings.dropbox.token
    });
  } 
}

Collections = {};

Collections.files = new FilesCollection({
  storagePath: 'assets/app/uploads/uploadedFiles',
  collectionName: 'uploadedFiles',
  allowClientCode: true,
  "protected": function(fileObj) {
    var ref4, ref5;
    if (!((ref4 = fileObj.meta) != null ? ref4.secured : void 0)) {
      return true;
    } else if (((ref5 = fileObj.meta) != null ? ref5.secured : void 0) && this.userId === fileObj.userId) {
      return true;
    }
    return false;
  },
  onBeforeRemove: function(cursor) {
    var res, self;
    self = this;
    res = cursor.map(function(file) {
      return (file != null ? file.userId : void 0) === self.userId;
    });
    return !~res.indexOf(false);
  },
  onBeforeUpload: function() {
    if (this.file.size <= 1024 * 1024 * 128) {
      return true;
    } else {
      return "Max. file size is 128MB you've tried to upload " + (filesize(this.file.size));
    }
  },
  downloadCallback: function(fileObj) {
    var ref4;
    if (((ref4 = this.params) != null ? ref4.query.download : void 0) === 'true') {
      Collections.files.collection.update(fileObj._id, {
        $inc: {
          'meta.downloads': 1
        }
      });
    }
    return true;
  },
  interceptDownload: function(http, fileRef, version) {
    var path, ref4, ref5, ref6;
    if (useDropBox || useS3) {
      path = fileRef != null ? (ref4 = fileRef.versions) != null ? (ref5 = ref4[version]) != null ? (ref6 = ref5.meta) != null ? ref6.pipeFrom : void 0 : void 0 : void 0 : void 0;
      if (path) {
        this.serve(http, fileRef, fileRef.versions[version], version, Request({
          url: path,
          headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
        }));
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});

if (Meteor.isServer) {
  
  Collections.files.denyClient();
  
  Collections.files.collection.attachSchema(Collections.files.schema);

  Collections.files.on('afterUpload', function(fileRef) {
    var makeUrl, readFile, self, sendToStorage, writeToDB;
    self = this;
    
    if (useDropBox) {
      makeUrl = function(stat, fileRef, version, triesUrl) {
        if (triesUrl == null) {
          triesUrl = 0;
        }
        client.makeUrl(stat.path, {
          long: true,
          downloadHack: true
        }, function(error, xml) {
          return bound(function() {
            var upd;
            if (error) {
              if (triesUrl < 10) {
                Meteor.setTimeout(function() {
                  makeUrl(stat, fileRef, version, ++triesUrl);
                }, 2048);
              } else {
                console.error(error, {
                  triesUrl: triesUrl
                });
              }
            } else if (xml) {
              console.log(xml);
              upd = {
                $set: {}
              };
              upd['$set']["versions." + version + ".meta.pipeFrom"] = xml.url;
              upd['$set']["versions." + version + ".meta.pipePath"] = stat.path;
              self.collection.update({
                _id: fileRef._id
              }, upd, function(error) {
                if (error) {
                  console.error(error);
                } else {
                  self.unlink(self.collection.findOne(fileRef._id), version);
                }
              });
            } else {
              if (triesUrl < 10) {
                Meteor.setTimeout(function() {
                  makeUrl(stat, fileRef, version, ++triesUrl);
                }, 2048);
              } else {
                console.error("client.makeUrl doesn't returns xml", {
                  triesUrl: triesUrl
                });
              }
            }
          });
        });
      };
      writeToDB = function(fileRef, version, data, triesSend) {
        if (triesSend == null) {
          triesSend = 0;
        }
        client.writeFile(fileRef._id + "-" + version + "." + fileRef.extension, data, function(error, stat) {
          return bound(function() {
            if (error) {
              if (triesSend < 10) {
                Meteor.setTimeout(function() {
                  writeToDB(fileRef, version, data, ++triesSend);
                }, 2048);
              } else {
                console.error(error, {
                  triesSend: triesSend
                });
              }
            } else {
              makeUrl(stat, fileRef, version);
            }
          });
        });
      };
      readFile = function(fileRef, vRef, version, triesRead) {
        if (triesRead == null) {
          triesRead = 0;
        }
        fs.readFile(vRef.path, function(error, data) {
          return bound(function() {
            if (error) {
              if (triesRead < 10) {
                readFile(fileRef, vRef, version, ++triesRead);
              } else {
                console.error(error);
              }
            } else {
              writeToDB(fileRef, version, data);
            }
          });
        });
      };
      sendToStorage = function(fileRef) {
        _.each(fileRef.versions, function(vRef, version) {
          readFile(fileRef, vRef, version);
        });
      };
    }

    if (!!~['png', 'jpg', 'jpeg'].indexOf((fileRef.extension || '').toLowerCase())) {
      Collections.createThumbnails(self, fileRef, function(fileRef) {
        if (useDropBox || useS3) {
          sendToStorage(self.collection.findOne(fileRef._id));
        }
      });
    } else {
      if (useDropBox || useS3) {
        sendToStorage(fileRef);
      }
    }
  });

  if (useDropBox || useS3) {
    _origRemove = Collections.files.remove;
    Collections.files.remove = function(search) {
      var cursor;
      cursor = this.collection.find(search);
      cursor.forEach(function(fileRef) {
        _.each(fileRef.versions, function(vRef, version) {
          var ref4;
          if (vRef != null ? (ref4 = vRef.meta) != null ? ref4.pipePath : void 0 : void 0) {
            if (useDropBox) {
              client.remove(vRef.meta.pipePath, function(error) {
                return bound(function() {
                  if (error) {
                    console.error(error);
                  }
                });
              });
            }
          }
        });
      });
      _origRemove.call(this, search);
    };
  }

  Meteor.setInterval(function() {
    Collections.files.remove({
      'meta.expireAt': {
        $lte: new Date((+(new Date)) + 120000)
      }
    }, Collections.NOOP);
  }, 120000);

  Meteor.publish('latest', function(take, userOnly) {
    var selector;
    if (take == null) {
      take = 10;
    }
    if (userOnly == null) {
      userOnly = false;
    }
    check(take, Number);
    check(userOnly, Boolean);
    if (userOnly && this.userId) {
      selector = {
        userId: this.userId
      };
    } else {
      selector = {
        $or: [
          {
            'meta.unlisted': false,
            'meta.secured': false,
            'meta.blamed': {
              $lt: 3
            }
          }, {
            userId: this.userId
          }
        ]
      };
    }
    return Collections.files.find(selector, {
      limit: take,
      sort: {
        'meta.created_at': -1
      },
      fields: {
        _id: 1,
        name: 1,
        size: 1,
        meta: 1,
        type: 1,
        isPDF: 1,
        isText: 1,
        isJSON: 1,
        isVideo: 1,
        isAudio: 1,
        isImage: 1,
        userId: 1,
        'versions.thumbnail40.type': 1,
        extension: 1,
        _collectionName: 1,
        _downloadRoute: 1
      }
    }).cursor;
  });

  Meteor.publish('file', function(_id) {
    check(_id, String);
    return Collections.files.find({
      $or: [
        {
          _id: _id,
          'meta.secured': false
        }, {
          _id: _id,
          'meta.secured': true,
          userId: this.userId
        }
      ]
    }, {
      fields: {
        _id: 1,
        name: 1,
        size: 1,
        type: 1,
        meta: 1,
        isPDF: 1,
        isText: 1,
        isJSON: 1,
        isVideo: 1,
        isAudio: 1,
        isImage: 1,
        extension: 1,
        _collectionName: 1,
        _downloadRoute: 1
      }
    }).cursor;
  });

  Meteor.methods({
    filesLenght: function(userOnly) {
      var selector;
      if (userOnly == null) {
        userOnly = false;
      }
      check(userOnly, Boolean);
      if (userOnly && this.userId) {
        selector = {
          userId: this.userId
        };
      } else {
        selector = {
          $or: [
            {
              'meta.unlisted': false,
              'meta.secured': false,
              'meta.blamed': {
                $lt: 3
              }
            }, {
              userId: this.userId
            }
          ]
        };
      }
      return Collections.files.find(selector).count();
    },
    unblame: function(_id) {
      check(_id, String);
      Collections.files.update({
        _id: _id
      }, {
        $inc: {
          'meta.blamed': -1
        }
      }, Collections.NOOP);
      return true;
    },
    blame: function(_id) {
      check(_id, String);
      Collections.files.update({
        _id: _id
      }, {
        $inc: {
          'meta.blamed': 1
        }
      }, Collections.NOOP);
      return true;
    },
    changeAccess: function(_id) {
      var file;
      check(_id, String);
      if (Meteor.userId()) {
        file = Collections.files.findOne({
          _id: _id,
          userId: Meteor.userId()
        });
        if (file) {
          Collections.files.update(_id, {
            $set: {
              'meta.unlisted': file.meta.unlisted ? false : true
            }
          }, Collections.NOOP);
          return true;
        }
      }
      throw new Meteor.Error(401, 'Access denied!');
    },
    changePrivacy: function(_id) {
      var file;
      check(_id, String);
      if (Meteor.userId()) {
        file = Collections.files.findOne({
          _id: _id,
          userId: Meteor.userId()
        });
        if (file) {
          Collections.files.update(_id, {
            $set: {
              'meta.unlisted': true,
              'meta.secured': file.meta.secured ? false : true
            }
          }, Collections.NOOP);
          return true;
        }
      }
      throw new Meteor.Error(401, 'Access denied!');
    }
  });
}

// ---
// generated by coffee-script 1.9.2
/* jshint ignore:end */