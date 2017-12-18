<?php
/** @var $model \bbn\mvc\model */

$d = new \bbn\ide\directories($model->inc->options);

if ( empty($model->data) ){
  $r = $d->get();
}

else{
  if ( (\count($model->data) === 1) && !empty($model->data['id']) ){
    $r = $d->delete($model->data);
  }

  else{
    if ( (\count($model->data) > 1) && empty($model->data['id']) ){
      $r = $d->add($model->data);
    }

    else{
      if ( (\count($model->data) > 1) && !empty($model->data['id']) ){
        $r = $d->edit($model->data);
      }
    }
  }
}

return ['ret' => $r];