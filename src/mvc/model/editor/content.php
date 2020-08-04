<?php
/** @var $model \bbn\mvc\model */
if ( !empty($model->data['url']) && isset($model->inc->ide) ){
   //we convert the string into an array to check whether we need to provide permission information or not
  $stepUrl = explode("/",$model->data['url']);

  // if we are in the case of the settings tabvnav sub where the last argument is one of the tabs belonging to him
  $tabnavSettings = ($stepUrl[count($stepUrl) - 1] === 'settings') || ($stepUrl[count($stepUrl) - 2] === 'settings') && ($stepUrl[count($stepUrl) - 3] === '_end_');

  //for case settings
  if ($tabnavSettings ) {
  //for Router settings
  
    $model->data['url'] = implode("/", $stepUrl);
    $url = substr($model->data['url'], 0, strpos($model->data['url'],'_end_/settings')).'_end_/php';
    $info = $model->inc->ide->url_to_real($url, true);
   
    if ( !$model->inc->ide->get_file_permissions($info['file']) ){
      if ( !$model->inc->ide->create_perm_by_real($info['file']) ){
        return ['error' => $model->inc->ide->get_last_error()];
      }
    }

    if ( ($perm = $model->inc->ide->get_file_permissions($info['file'])) &&
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