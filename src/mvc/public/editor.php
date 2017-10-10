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
$ctrl->combo("IDE", true);