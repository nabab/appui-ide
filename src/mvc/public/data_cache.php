<?php
$ctrl->action();








/*
if ( isset($ctrl->post['item'], $ctrl->arguments[0]) ){
  switch ( $ctrl->arguments[0] ){
    case 'info':
      $ctrl->setTitle('Content of '.$ctrl->post['item']);
      if ( $cache->has($ctrl->post['item']) ){
	      \bbn\X::hdump($cache->get($ctrl->post['item']));
      }
      else{
        echo '<h3 style="color: red">The item '.$ctrl->post['item'].' doesn\'t exist</h3>';
      }
      break;
    case 'delete':
      $ctrl->obj->success = $cache->delete($ctrl->post['item']);
      break;
  }
}
else{
  $ctrl->combo('Cache content ('.\bbn\Cache::getType().')', [
    'root' => $ctrl->getDir().'/',
    'items' => array_map(function($a){
      return ['name' => $a];
    }, $cache->items())
  ]);
}
*/