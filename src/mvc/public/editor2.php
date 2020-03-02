<?php
/** @var $ctrl \bbn\mvc\controller */
/*if ( isset($ctrl->arguments[0]) ){
  $url = 'ide/editor/'.implode('/', $ctrl->arguments);
  \bbn\x::log([$url],'vito');
  $ctrl->reroute($url, [
    'editor_component' => true
  ],  $ctrl->arguments);
}
else{
  $list = [];

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

$ctrl->obj->url = APPUI_IDE_ROOT.'editor2';
$ctrl->obj->bcolor = '#333';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "nf nf-fa-code";


$ctrl->add_data($ctrl->get_model('./editor', ['routes' => $ctrl->get_routes()]))
    ->set_title('I.D.EComponent')
    ->combo('ide/editor2', $ctrl->data);
}


*/


$list = [];

// We define ide array in session
if ( !$ctrl->inc->session->has('ide') ){
  $ctrl->inc->session->set([
    'list' => $list
  ], 'ide');
}

$ctrl->obj->url = APPUI_IDE_ROOT.'editor2';
$ctrl->obj->bcolor = '#333';
$ctrl->obj->fcolor = '#FFF';
$ctrl->obj->icon = "nf nf-fa-code";


if ( $ctrl->baseURL === '' ){
  $ctrl->add_data($ctrl->get_model('./editor', ['routes' => $ctrl->get_routes()]))
    ->set_title('I.D.EComponent')
    ->combo('ide/editor2', $ctrl->data);
}
else if ( $ctrl->baseURL === $ctrl->obj->url.'/' ){
  $url = 'ide/editor/'.implode('/', $ctrl->arguments);
  $ctrl->reroute($url, [
    'editor_component' => true
  ],  $ctrl->arguments);
}
else{
  $url = 'ide/editor/'.implode('/', $ctrl->arguments);
  $ctrl->reroute($url, [
    'editor_component' => true
  ],  $ctrl->arguments);
}


