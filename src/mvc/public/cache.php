<?php
/*
 * Manages the cache entries
 *
 **/

/** @var $this \bbn\mvc\controller */

$cache = \bbn\cache::get_engine();
if ( isset($this->post['item'], $this->arguments[0]) ){
  switch ( $this->arguments[0] ){
    case 'info':
      $this->set_title('Content of '.$this->post['item']);
      if ( $cache->has($this->post['item']) ){
	      \bbn\x::hdump($cache->get($this->post['item']));
      }
      else{
        echo '<h3 style="color: red">The item '.$this->post['item'].' doesn\'t exist</h3>';
      }
      break;
    case 'delete':
      $this->obj->success = $cache->delete($this->post['item']);
      break;
  }
}
else{
  $this->combo('Cache content ('.\bbn\cache::get_type().')', [
    'root' => $this->say_dir().'/',
    'items' => array_map(function($a){
      return ['name' => $a];
    }, $cache->items())
  ]);
}