<?php
if ( isset($model->inc->ide) ){
  //for cancell all tabs
  if ( empty($model->data['section']) || !empty($model->data['all']) ){
    if ( !empty($model->data['src']) && !empty($model->inc->ide->delete($model->data['src'])) ){
      return ['success' => true];
    }
    else {
      return ['error' => $model->inc->ide->get_last_error()];
    }
  }
  //when we specify what we want to delete
  elseif ( empty($model->data['all']) && !empty($model->data['section']) ){
    // get correctly path if type mvc or component because in these two cases they have more tabs
    if ( !empty($model->data['src']['is_mvc']) ){
      $path = $model->inc->ide->decipher_path($model->data['src']['repository']['name'] . '/' . $model->data['src']['repository']['path']).$model->data['src']['data']['type'].'/'.$model->data['section'].$model->data['src']['data']['dir'].$model->data['src']['data']['name'];
    }
    elseif ( !empty($model->data['src']['is_component']) ){
      $path = $model->inc->ide->decipher_path($model->data['src']['repository']['name'] . '/' . $model->data['src']['repository']['path']).$model->data['src']['data']['dir'].$model->data['src']['data']['name'].'/'.$model->data['src']['data']['name'];
    }

    //case component
    if ( !empty($model->data['src']['is_component']) &&  !empty($model->data['ext']) ){
      $path .= $model->data['ext'];
      if ( $model->inc->fs->is_file($path) ){
        if ( !empty($model->inc->fs->delete($path)) ){
          return ['success' => true];
        }
      }
      return ['success' => true];
    }
    //case mvc files
    elseif ( !empty($model->data['src']['is_file']) &&  !empty($model->data['ext']) ){
      $path .= $model->data['ext'];
      if ( $model->inc->fs->is_file($path) ){
        if ( !empty($model->inc->fs->delete($path)) ){
          if ( $model->data['section'] === 'public/' ){
            if ( $model->inc->ide->delete_perm($path) ){
              //$model->inc->ide->remove_file_pref($path);
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
    elseif ( empty($model->data['src']['is_file']) ){
      if ( $model->inc->fs->is_dir($path) ){
        if ( !empty($model->inc->fs->delete($path)) ){
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
