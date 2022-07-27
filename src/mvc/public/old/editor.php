<?php
/** @var $ctrl \bbn\Mvc\Controller */

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => []
  ], 'ide');
}

//$ctrl->inc->session->set($sess, 'ide', 'list');

$isProject = $ctrl->inc->ide->getOrigin() !== 'appui-ide';
$title = 'I.D.E';
if ($isProject) {
  $title .= ' ('. $ctrl->inc->ide->getNameProject().')';
}

$ctrl
  ->setObj([
    'url' => APPUI_IDE_ROOT.'editor',
    'bcolor' => $isProject ? '#017a8a' : 'black',
    'fcolor' => 'white',
    'icon' => 'nf nf-fa-code'
  ])
  ->addData([
    'routes' => $ctrl->getRoutes()
  ])
  ->combo($title, true);

