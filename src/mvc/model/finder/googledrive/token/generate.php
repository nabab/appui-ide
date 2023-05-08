<?php
if ($model->hasData('credentials', true)) {
  if (\bbn\Str::isJson($model->data['credentials'])) {
    $model->data['credentials'] = json_decode($model->data['credentials'], true);
  }
  $gdCls = new \bbn\Api\GoogleDrive($model->data['credentials']);
  if ($url = $gdCls->createAuthUrl()) {
    return [
      'success' => true,
      'url' => $url
    ];
  }
}