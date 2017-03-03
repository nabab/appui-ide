<?php
/** @var $model \bbn\mvc\model */
if ( isset($model->data['routes'], $model->inc->ide) ){

  $res = [
    'default_repository' => $model->inc->session->has('ide', 'repository') ?
      $model->inc->session->get('ide', 'repository') : 'BBN_APP_PATH/mvc/',
    'repositories' => $model->inc->ide->repositories()
  ];

  return $res;
}