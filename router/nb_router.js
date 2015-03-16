/**
 * 
 * 这个路由用来写一些所有非SDK的接口，所以称为 nb_router
 * 
 */

'use strict';

var express = require( 'express' );
var router = express.Router();
var controller = require( '../controllers/controller' );
var user = require( '../controllers/user' );

router.get( '/stat/:projectID/js', controller.getStatJS );
router.get( '/stat/:projectID/stat', controller.stat );

router.post( '/login', user.login );
router.get( '/logout', user.logout );
router.post( '/signup', user.signup );

router.post( '/client/project', controller.isLogin, controller.createProject );
router.delete( '/client/project', controller.isLogin,  controller.deleteProject );
router.put( '/client/project', controller.isLogin,  controller.updateProject );
router.get( '/client/project', controller.isLogin,  controller.getProjectsByUserId );

module.exports = router;