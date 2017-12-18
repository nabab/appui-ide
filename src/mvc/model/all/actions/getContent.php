<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 12/12/17
 * Time: 18.32
 */

if ( !empty($model->data) &&
  !empty($model->data['path']) &&
  !empty($model->data['file'])
){
  $path = explode('/', $model->data['path']);
  $const = $path[0];
  $path[0] = constant($const);
  $newPath = implode('/', $path);
  $newPath = str_replace('//','/',$newPath);
  $content = file_get_contents($newPath);
  if ( !empty($content) ){
    return [
      'success' => true,
      'content' => $content
    ];
  }
}

return [
  'success' => false
];
