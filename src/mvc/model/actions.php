<?php
/** @var $model \bbn\mvc\model */
if ( !empty($model->data['act']) ){
  $actions = new \bbn\ide\actions($model->db);
  $act = $model->data['act'];
  if ( method_exists($actions, $act) ){
    /** @todo This dynamic method doesn't fit - dangerous  and not nice */
    return ['res' => $actions->$act($model->data)];
  }
}
return false;