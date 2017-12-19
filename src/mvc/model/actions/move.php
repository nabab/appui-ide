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
  $exist = false;

  if ( !empty($model->data['is_mvc']) ){
    foreach($model->data['repository']['tabs'] as $i=>$v){

      $folder= $model->inc->ide->decipher_path($model->data['repository']['value']
        .($i==='php' ? 'public' : $i).'/'.$model->data['new_path']);

      if( is_dir($folder) ){
        $content= \bbn\file\dir::get_files($folder, true);
        foreach( $content as $i => $v ){
          if (  explode('.',basename($v))[0] === $model->data['name'] ){
            $exist = true;
            return [
              'success' => false,
              'exist' => true
            ];
          }
        }
        break;
      }
    }
  }
  else{
    $folder= $model->inc->ide->decipher_path($model->data['repository']['value'].$model->data['new_path']);
    $content= \bbn\file\dir::get_files($folder, true);
    foreach( $content as $i => $v ){
      if (  explode('.',basename($v))[0] === $model->data['name'] ){
        $exist = true;
        break;
      }
    }
  }
  /*if ( !empty(is_dir($folder)) || !empty($exist)){
    die(var_dump("si", $folder, $exist) );
  }*/

  if ( !empty(is_dir($folder)) && empty($exist) && !empty($model->inc->ide->move($model->data)) ){
    $res['success'] = true;
  }
}

return $res;