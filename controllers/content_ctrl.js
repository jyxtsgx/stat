'use strict';

var async = require( 'async' );
var groupDB = require( '../db/groupDB' );
var contentDB = require( '../db/contentDB' );
var ObjectID = require( '../db/mongo' ).ObjectID;

exports.createContent = function (req, res) {
    var groupID = req.body.groupID;
    var sourceID = req.body.sourceID;
    var data = req.body.data || {};
    data.value = data.value || '';


    if( !groupID || !sourceID ) res.status(403).send('no groupID or sourceID');

    var time = new Date().getTime();
    var obj = {
        _id : ObjectID().toString(),
        sourceID : sourceID,
        groupID : groupID,
        data: data,
        time : time
    };

    contentDB.insert(obj, function (err, result) {
        err ? res.status(500).send(err) : res.send(result[0]);
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;

    contentDB.remove(id, function (err, result) {
        err ? res.status(500).send(err) : res.send();
    });
};

exports.query = function (req, res) {
    var sourceID = req.params.sourceID;
    var groupID = req.params.groupID;
    var dates = req.query.dates;

    var key = req.query.key;
    var search = req.query.search || '{}';
    search = JSON.parse(search);

    var filter = {
        sourceID: sourceID,
        groupID: groupID
    }

    filter[search.key] = search.val;

    async.waterfall([groupInfo, searchKeys, searchValue], result);

    function groupInfo (done) {
        groupDB.getGroupById(groupID, done);
    }

    function searchKeys (group, done) {
        console.log(filter)
        contentDB.getKeyList(filter, '$data.'+key, function (err, list) {
            done(err, group, list);
        });
    }

    function searchValue (group, list, done) {
        var arr = [];

        async.each(list, iterator, callback);

        function iterator (item, _done) {
            filter['data.'+key] = item._id;

            contentDB.getValueList(filter, function (err, _list) {
                var obj = {
                    key: item._id,
                    count: item.count,
                    values: {}
                };

                group.values.forEach(function (_item) {
                    obj.values[_item.key] = 0; // 补全字段，把group.value里有，但_list里没有的字段设为0
                });

                _list.forEach(function (_item) {
                    var hasKey = group.values.some(function (__item) {
                        return _item._id === __item.key;
                    });

                    if (hasKey) obj.values[_item._id] = _item.count;
                });

                arr.push( obj );
                _done();
            });
        }

        function callback (err) {
            done(err, arr);
        }   
    }

    function result (err, result) {
        err ? res.status(500).send(err) : res.send(result);
    }
};








