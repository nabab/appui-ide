<?php
/** @var $model \bbn\Mvc\Model */
if ( !empty($model->data['act']) ){
  $actions = new \bbn\Ide\Actions($model->db);
  $act = $model->data['act'];
  if ( method_exists($actions, $act) ){
    /** @todo This dynamic method doesn't fit - dangerous  and not nice */
    return ['res' => $actions->$act($model->data)];
  }
}
return false;