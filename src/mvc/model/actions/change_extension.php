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
    !empty($model->data['path'])  &&
    !empty($model->data['tab'])
  ){
    // define the two path for change
    $old_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['tab'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['oldExt']);

    $new_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['tab'].$model->data['path'].'/'.$model->data['fileName'].'.'.$model->data['newExt']);
  } // case no mvc
  else{
    $old_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['fileName'].'.'.$model->data['oldExt']);

    $new_path = $model->inc->ide->decipher_path($model->data['repository'].$model->data['fileName'].'.'.$model->data['newExt']);
  }
//die(var_dump($old_path, $new_path));

  if ( is_file($old_path) && !is_file($new_path)  ){
    if ( \bbn\file\dir::move($old_path, $new_path) ){
      $res['success'] = true;
    }
  }

}

return $res;