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
$ctrl->obj->bcolor = '#333';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "nf nf-fa-code";


echo $ctrl
    ->set_title('I.D.E')
    ->add_js($ctrl->get_model(['routes' => $ctrl->get_routes()]))
    ->get_view();

