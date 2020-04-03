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

$ctrl->obj->bcolor = 'black';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "nf nf-fa-code";

$title = 'I.D.E';
if ( $ctrl->inc->ide->get_origin() !== 'appui-ide' ){
  $title .= ' ('. $ctrl->inc->ide->get_name_project().')';
  $ctrl->obj->bcolor = '#017a8a';
}

echo $ctrl
    ->set_title($title)
    ->add_js($ctrl->get_model(['routes' => $ctrl->get_routes()]))
    ->get_view();

