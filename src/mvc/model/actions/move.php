<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */


$res['success'] = false;
if ( isset($model->inc->ide) ){
  $folder = false;
  if ( !empty($model->data['is_mvc']) ){
    foreach($model->data['repository']['tabs'] as $i=>$v){
      $folder= $model->inc->ide->decipher_path($model->data['repository']['value'].($i==='php' ? 'public' : $i).'/'.$model->data['new_path']);
      $element = $model->inc->ide->decipher_path($model->data['repository']['bbn_path'].'/'.$model->data['repository']['path'].($i==='php' ? 'public' : $i).'/'.$model->data['path'].$model->data['name']);
      if( is_dir($folder) ){
        $content= \bbn\file\dir::get_files($folder, true);
        if ( !empty($content) ){
          foreach( $content as $i => $v ){
            //case folder
            if ( is_dir($v) && empty($model->data['is_file']) && explode('.',basename($v))[0] ===
              $model->data['name'] ){
              return [
                'success' => false,
                'exist' => 'folder'
              ];
            }
            //case file
            if ( is_file($v) && !empty($model->data['is_file']) && explode('.',basename($v))[0] === $model->data['name'] ){
              return [
                'success' => false,
                'exist' => 'file'
              ];
            }
          }
        }
      }
    }
  }
  else{
    $folder= $model->inc->ide->decipher_path($model->data['repository']['value'].$model->data['new_path']);
    if ( !is_dir($folder) ){
      \bbn\file\dir::create_path($folder);
    }
    $content= \bbn\file\dir::get_files($folder, true);
    if ( !empty($content) ){
      foreach ( $content as $i => $v ){
        if ( explode('.', basename($v))[0] === $model->data['name'] ){

          return [
            'success' => false,
            'exist' => true
          ];
        }
      }
    }
  }
  /*if ( !empty(is_dir($folder)) || !empty($exist)){
    die(var_dump("si", $folder, $exist) );
  }*/

  if ( !empty($model->inc->ide->move($model->data)) ){
    $res['success'] = true;
  }
  else{

    $res = [
      'success' => false,      
    ];
  }
}

return $res;
