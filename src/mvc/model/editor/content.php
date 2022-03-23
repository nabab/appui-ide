<?php
/** @var $model \bbn\Mvc\Model */
if ( !empty($model->data['url']) && isset($model->inc->ide) ){
   //we convert the string into an array to check whether we need to provide permission information or not
  $stepUrl = explode("/",$model->data['url']);

  // if we are in the case of the settings tabvnav sub where the last argument is one of the tabs belonging to him
  $tabnavSettings = ($stepUrl[count($stepUrl) - 1] === 'settings') || ($stepUrl[count($stepUrl) - 2] === 'settings') && ($stepUrl[count($stepUrl) - 3] === '_end_');

  //for case settings
  if ($tabnavSettings ) {
  //for Router settings
  	if (defined('BBN_PROJECT') && ($model->inc->ide->getProject() === BBN_PROJECT)) {
      $model->data['url'] = implode("/", $stepUrl);
      $url = substr($model->data['url'], 0, Strpos($model->data['url'],'_end_/settings')).'_end_/php';
      $info = $model->inc->ide->urlToReal($url, true);
      if (!$model->inc->ide->getFilePermissions($info['file'])) {
        if ( !$model->inc->ide->createPermByReal($info['file']) ){
          return ['error' => $model->inc->ide->getLastError()];
        }
      }

      if ( ($perm = $model->inc->ide->getFilePermissions($info['file'])) &&
        !empty($perm['permissions'])
      ){
        if ( !empty($perm['permissions']['id']) ){
          $imess = new \bbn\Appui\Imessages($model->db);
          $perm['imessages'] = $imess->getByPerm($perm['permissions']['id'], false);
        }
        return $perm;
      }
    }
    else {
      return [
        'error' => _("No settings")
      ];
    }
  }
  else {
    $content = $model->inc->ide->load($model->data['url']);
    if ( !empty($content) ){
      if ( isset($content['permissions']) ){
        unset($content['permissions']);
      }
    }
    $content['project'] = false;
    if ( $model->inc->ide->isProject($model->data['url']) ){
      if ( $model->inc->ide->isMVCFromUrl($model->data['url']) ){
        $content['project'] = 'mvc';
      }
      if ( $model->inc->ide->isComponentFromUrl($model->data['url']) ){
        $content['project'] = 'components';
      }
      if ( $model->inc->ide->isLibFromUrl($model->data['url']) ){
        $content['project'] = 'lib';
      }
      if ( $model->inc->ide->isCliFromUrl($model->data['url']) ){
        $content['project'] = 'cli';
      }
    }
    return $content;
  }
}
return ['error' => $model->inc->ide->getLastError()];