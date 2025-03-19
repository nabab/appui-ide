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
  if ( !empty($model->data['is_project']) ){
    foreach ( $model->data['repository']['tabs'] as $i => $v ){
      $folder= $model->inc->ide->decipherPath($model->data['repository']['value'].'/src/'.$model->data['type'].'/'.$v['path'].$model->data['new_path']);
      $element = $model->inc->ide->decipherPath($model->data['repository']['value'].'/src/mvc/'.$v['path'].$model->data['path'].$model->data['name']);
      //checks whether an item with the same name as the destination folder exists
      if( $model->inc->fs->isDir($folder) ){
        $content= $model->inc->fs->getFiles($folder, true);
        if ( !empty($content) ){
          foreach( $content as $i => $v ){
            //case folder
            if ( $model->inc->fs->isDir($v) && empty($model->data['is_file']) && explode('.',basename($v))[0] === $model->data['name'] ){
              return [
                'success' => false,
                'exist' => 'folder'
              ];
            }
            //case file
            if ( $model->inc->fs->isFile($v) && !empty($model->data['is_file']) && explode('.',basename($v))[0] === $model->data['name'] ){
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
    $folder= $model->inc->ide->decipherPath($model->data['repository']['value'].$model->data['new_path']);
   
    $content= $model->inc->fs->getFiles($folder, true);


    if ( !empty($content) && empty($model->data['is_project'])){
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
