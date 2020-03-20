<?php
/** @var $model \bbn\mvc\model */

if ( !empty($model->data['url']) && isset($model->inc->ide) ){
   //we convert the string into an array to check whether we need to provide permission information or not
  $stepUrl = explode("/",$model->data['url']);

  //for Router settings
  if ( $stepUrl[count($stepUrl) - 1 ] === 'settings' ){
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
    $content = $model->inc->ide->load($model->data['url']);
    if ( !empty($content) ){
      if ( isset($content['permissions']) ){
        unset($content['permissions']);
      }
    }
    $content['project'] = false;
    if ( $model->inc->ide->is_project($model->data['url']) ){
      if ( $model->inc->ide->is_MVC_from_url($model->data['url']) ){
        $content['project'] = 'mvc';
      }
      if ( $model->inc->ide->is_component_from_url($model->data['url']) ){
        $content['project'] = 'components';
      }
      if ( $model->inc->ide->is_lib_from_url($model->data['url']) ){
        $content['project'] = 'lib';
      }
      if ( $model->inc->ide->is_cli_from_url($model->data['url']) ){
        $content['project'] = 'cli';
      }
    }
    return $content;
  }
}
return ['error' => $model->inc->ide->get_last_error()];

