<?php
/**
 * These actions can only be accessed if the user is an admin
 *
 **/

/** @var $this \bbn\mvc\controller */

if ( isset($dir) ){
  unset($dir);
}
if ( $this->inc->user->is_admin() ){
  $dir = new \bbn\ide\directories($this->inc->options, $this->mvc->get_routes());
}
else{
  return false;
}