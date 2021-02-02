<?php
/** @var $ctrl \bbn\Mvc\Controller */

$list = [];

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

//$ctrl->inc->session->set($sess, 'ide', 'list');
$ctrl->obj->url = APPUI_IDE_ROOT.'editor';

$ctrl->obj->bcolor = 'black';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "nf nf-fa-code";

$title = 'I.D.E';
if ( $ctrl->inc->ide->getOrigin() !== 'appui-ide' ){
  $title .= ' ('. $ctrl->inc->ide->getNameProject().')';
  $ctrl->obj->bcolor = '#017a8a';
}

echo $ctrl
    ->setTitle($title)
    ->addJs($ctrl->getModel(['routes' => $ctrl->getRoutes()]))
    ->getView();

