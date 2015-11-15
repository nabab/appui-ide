<?php
/* @var $this \bbn\mvc */
if ( isset($this->data['act']) && !empty($this->data['act']) ) {
  $actions = new \bbn\ide\actions($this->db);
  $act = $this->data['act'];
  /** @todo This dynamic method doesn't fit - dangerous  and not nice */
  return ['res' => $actions->$act($this->data)];
}
return false;