<?php
/* @var $this \bbn\mvc */
if ( !empty($this->data['act']) ){
  $actions = new \bbn\ide\actions($this->db);
  $act = $this->data['act'];
  if ( method_exists($actions, $act) ){
    /** @todo This dynamic method doesn't fit - dangerous  and not nice */
    return ['res' => $actions->$act($this->data)];
  }
}
return false;