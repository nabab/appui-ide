<?php
/** @var $model \bbn\mvc\model */

if ( !empty($model->data['url']) && isset($model->inc->ide) ){
  $model->data['url'] = str_replace('/_end_', '', $model->data['url']);
  //we convert the string into an array to check whether we need to provide permission information or not
  $stepUrl = explode("/",$model->data['url']);

//for tabnav settings
  if ( ($stepUrl[count($stepUrl) - 1 ] === 'settings') ||
    ($stepUrl[count($stepUrl) - 2 ] === 'settings')
  ){
    if ( $stepUrl[count($stepUrl) - 2 ] === 'settings' ){
      unset($stepUrl[count($stepUrl)-1]);
      $model->data['url'] = implode("/", $stepUrl);
    }
    $url = str_replace('/settings', '/php', $model->data['url']);

    $ris = $model->inc->ide->url_to_real($url, true);
    if ( !$model->inc->ide->get_file_permissions($ris['file']) ){
      if ( !$model->inc->ide->create_perm_by_real($ris['file']) ){
        return ['error' => $model->inc->ide->get_last_error()];
      }
    }

    if ( ($perm = $model->inc->ide->get_file_permissions($ris['file'])) &&
      !empty($perm['permissions'])
    ){
      if ( !empty($perm['permissions']['id']) ){
        $imess = new \bbn\appui\imessages($model->db);
        $perm['imessages'] = $imess->get_by_perm($perm['permissions']['id'], false);
      }
      return $perm;
    }
  }
  else {
    if ( $ret = $model->inc->ide->load($model->data['url']) ){
      if ( isset($ret['permissions']) ){
        unset($ret['permissions']);
      }
    }
    return $ret;
  }
}
return ['error' => $model->inc->ide->get_last_error()];
