<?php
/** @var $model \bbn\mvc\model */
if ( isset($model->data['routes'], $model->inc->ide) ){

  $res = [
    'default_dir' => $model->inc->session->has('ide', 'dir') ?
      $model->inc->session->get('ide', 'dir') : 'BBN_APP_PATH/mvc/',
    'dirs' => $model->inc->ide->dirs()
  ];

  return $res;
}