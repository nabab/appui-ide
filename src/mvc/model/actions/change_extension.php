<?php

$res['success'] = false;

if ( !empty($model->data) &&
  !empty($model->data['repository']) &&
  !empty($model->data['fileName']) &&
  !empty($model->data['oldExt']) &&
  !empty($model->data['newExt']) &&
  !empty($model->inc->ide)
){
  // case mvc
  if( !empty($model->data['is_mvc']) &&
    !empty($model->data['tab'])
  ){
    // define the two path for change
    $old_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['tab'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['oldExt']);

    $new_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['tab'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['newExt']);
  } // case no mvc
  else{
    $old_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['oldExt']);

    $new_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['newExt']);
  }

  if ( $model->inc->fs->is_file($old_path) && !$model->inc->fs->is_file($new_path)  ){
    if ($model->inc->fs->move($old_path, $new_path) ){
      $res['success'] = true;
    }
  }

}

return $res;
