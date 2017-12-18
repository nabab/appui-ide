<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 15/12/17
 * Time: 13.02
 */
/*
$get_path = function($val){
  $path= explode('/', $val);
  $const= $path[0];
  $path[0]= constant($const);
  $newPath = implode('/', $path);
  $newPath = str_replace('//','/',$newPath);

  return $newPath;
};

$getNameFile = function() use($model){
  if ( $model->data['ext'] !== '' ){
    $file= explode('/', $model->data['pathOrig']);
    array_pop($file);
    $file[count($file)-1] = $file[count($file)-1].$model->data['ext'];
    $file = implode("/", $file);
    return $file;
  }
  else{
    return false;
  }
};

$searchFileMvc = function($ele) use($model, $get_NameFile){

  $tabs = [ 'private/','public/', 'model/', 'html/','js/', 'css/'];

  foreach($tabs as $i => $type){
    $ctrl = $ele.$type;

    $file = $get_NameFile();

    if ( $file ){
      $ctrl .= $file;
    }
    else{
      $ctrl .= $model->data['pathOrig'];
    }

    if( file_exists($ctrl) === false ){
      unset($tabs[$i]);
    }
  }
  return $tabs;
};





if ( !empty($model->data) &&
  !empty($model->data['destination']) &&
  !empty($model->data['orig']) &&
  isset($model->data['mvc'])
){
  //case mvc
  if ( !empty($model->data['mvc']) ){

    $pathOrig = get_path($model->data['orig']);
    $i = strpos($pathOrig, 'mvc')+4;
    $pathOrig = substr($pathOrig, 0, $i);


    $insertIn = $searchFileMvc($pathOrig);

    //case destination
    $destPath = get_path($model->data['destination']);
    $i = strpos($destPath, 'mvc')+4;
    $destPath = substr($destPath,0, $i);

    foreach( $insertIn as $id=>$v ){
      //case no folder
      if ( $model->data['ext'] !== '' ){
        if ( !\bbn\file\dir::move($pathOrig.$v.$getNameFile(), $destPath.$v.$getNameFile() ) ){
          $res['success'] = false;
        }
      }
      //case folder
      else{
        if ( !\bbn\file\dir::move($pathOrig.$v.$getNameFile(), $destPath.$v.$getNameFile() ) ){
          $res['success'] = false;
        }
      }
    }


  }

}
*/



if ( isset($model->inc->ide) ){
  if ( !empty($model->inc->ide->move($model->data)) ){
    return [
      'success' => true
    ];
  }
  else {
    return [
      'success' => false
    ];
  }
}