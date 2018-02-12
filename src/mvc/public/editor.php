<?php
/** @var $ctrl \bbn\mvc\controller */

$list = [];

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

//$ctrl->inc->session->set($sess, 'ide', 'list');


$ctrl->obj->url = APPUI_IDE_ROOT.'editor';
$ctrl->obj->bcolor = '#666';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "fa fa-code";
$ctrl->combo('I.D.E.', true);