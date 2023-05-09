<?php
/**
   * What is my purpose?
   *
   **/

/** @var $model \bbn\Mvc\Model*/


if ($model->hasData(['text', 'type'], true)) {
  $isGoogleDrive = ($model->data['type'] === 'googledrive');
  if (($model->data['type'] !== 'local')
    && !$isGoogleDrive
    && !$model->hasData(['host', 'user', 'pass'], true)
  ) {
      return [
        'error' => _('Incorrect arguments')
      ];
  }

  $fields = ['path', 'host', 'user', 'pass', 'type', 'text'];
  $cfg = [];
  foreach ( $fields as $f ){
    if (!empty($model->data[$f])) {
      $cfg[$f] = $model->data[$f];
    }
  }

  if ($isGoogleDrive
    && !empty($model->data['user'])
    && !empty($model->data['pass'])
    && !is_array($model->data['pass'])
    && !\bbn\Str::isJson($model->data['pass'])
  ) {
    $gCls = new \bbn\Api\GoogleDrive($model->data['user']);
    $model->data['pass'] = $gCls->getAccessTokenByCode($model->data['pass']);
  }

  $fs = new \bbn\File\System($cfg['type'], $cfg);
  if ($fs->check()) {
    $ret = [
      'success' => true
    ];
    if ($isGoogleDrive) {
      $ret['pass'] = \json_encode($model->data['pass']);
    }

    return $ret;
  }
}

return ['success' => false];
