<?php
if ( isset($model->inc->ide) ){
  //if ( !isset($model->data['section'], $model->data['all']) || !empty($model->data['all']) ){
  if ( empty($model->data['section']) || !empty($model->data['all']) ){
    // if ( !empty($model->data['all']) ){
    //   $data = $model->data['src'];
    // }
    // else{
    //   $data = $model->data;
    // }
    if ( !empty($model->data['src']) && !empty($model->inc->ide->delete($model->data['src'])) ){      
      return ['success' => true];
    }
    else {
      return ['error' => $model->inc->ide->get_last_error()];
    }
  }

  else if( empty($model->data['all']) && !empty($model->data['section']) ){
    if ( !empty($model->data['src']['is_mvc']) ){
      $path = $model->inc->ide->decipher_path($model->data['src']['repository']['bbn_path'] . '/' . $model->data['src']['repository']['path']).$model->data['src']['data']['type'].'/'.$model->data['section'].$model->data['src']['data']['dir'].$model->data['src']['data']['name'];
    }
    else if ( !empty($model->data['src']['is_component']) ){
      $path = $model->inc->ide->decipher_path($model->data['src']['repository']['bbn_path'] . '/' . $model->data['src']['repository']['path']).$model->data['src']['data']['dir'].$model->data['src']['data']['name'].'/'.$model->data['src']['data']['name'];
    }//case component
    if ( !empty($model->data['src']['is_component']) &&  !empty($model->data['ext']) ){
      $path .= $model->data['ext'];
      if ( is_file($path) ){
        if ( !empty(\bbn\file\dir::delete($path)) ){
          return ['success' => true];
        }
      }
      return ['success' => true];
    }//case mvc files
    else if ( !empty($model->data['src']['is_file']) &&  !empty($model->data['ext']) ){
      $path .= $model->data['ext'];

      if ( is_file($path) ){
        if ( !empty(\bbn\file\dir::delete($path)) ){
          if ( $model->data['section'] === 'public/' ){
            if ( $model->inc->ide->delete_perm($path) ){
              $model->inc->ide->remove_file_pref($path);
              return ['success' => true];
            }
            else{
              return ['success' => false];
            }
          }
          return ['success' => true];
        }
      }
    }//case mvc folders
    else if ( empty($model->data['src']['is_file']) ){
      if ( is_dir($path) ){
        if ( !empty(\bbn\file\dir::delete($path)) ){
          if ( $model->data['section'] === 'public/' ){
            if ( $model->inc->ide->delete_perm($path) ){
              return ['success' => true];
            }
            else{
              return ['success' => false];
            }
          }
          return ['success' => true];
        }
      }
    }
  }
}
return ['success' => false];
