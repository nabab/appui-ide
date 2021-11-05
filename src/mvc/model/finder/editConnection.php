<?php
/**
 * What is my purpose?
 *
 **/

/** @var $model \bbn\Mvc\Model*/
$res = [
  'success' => false,
];
if ($model->hasData(['id', 'text', 'type'], true)) {
  $isPassChanged = false;
  if ($model->data['type'] !== 'local') {
    if (!$model->hasData(['host', 'user', 'pass'], true)) {
      throw new Exception(_('Host, user and password are mandatory for non local connections'));
    }
    $password = new bbn\Appui\Passwords($model->db);
    $isPassChanged = $password->userStore($model->data['pass'], $model->data['id'], $model->inc->user);
    $update = [
      'path' => $model->data['path'],
      'host' => $model->data['host'],
      'user' => $model->data['user'],
      'type' => $model->data['type'],
      'text' => $model->data['text'],
    ];
  }
  else {
    $update = [
      'path' => $model->data['path'],
      'type' => $model->data['type'],
      'text' => $model->data['text'],
    ];
  }

  $res['success'] = $model->inc->pref->update($model->data['id'], $update) || $isPassChanged;
}

return $res;
