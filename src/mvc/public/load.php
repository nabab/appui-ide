<?php
/** @var $ctrl \bbn\mvc\controller */

//die(\bbn\x::dump($ctrl->data));
if ( $ctrl->obj->data = $ctrl->get_model(\bbn\x::merge_arrays($ctrl->data, $ctrl->post)) ){
  if ( !empty($ctrl->obj->data['error']) ){
    $ctrl->obj->error = $ctrl->obj->data['error'];
  }
  else{
    if ( !empty($ctrl->obj->data['def']) ){
      //$ctrl->obj->url = $ctrl->obj->data['url'].'/'.$ctrl->obj->data['def'];
    }
    else{
      //$ctrl->obj->url = $ctrl->obj->data['url'];
    }
    $list = $ctrl->inc->session->get('ide', 'list');
    if ( !in_array($ctrl->obj->data['url'], $list) ){
      array_push($list, $ctrl->obj->data['url']);
      $ctrl->inc->session->set($list, 'ide', 'list');
    }
  }
}