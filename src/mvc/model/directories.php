<?php
/** @var $model \bbn\Mvc\Model */

$d = new \bbn\Ide\Directories($model->inc->options);

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
