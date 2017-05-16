<?php
/** @var $ctrl \bbn\mvc\controller */
//$dir = array_shift($ctrl->arguments);
$url = implode('/', $ctrl->arguments);
$dirs = new \bbn\ide\directories($ctrl->inc->options, $ctrl->get_routes());
$dir = $dirs->dir_from_url($url);
\bbn\x::dump($dir);
\bbn\x::dump($dirs->get());



/*
// Case where it's a new file and we need to provide the tabNav info
if ( $ctrl->baseURL === $ctrl->data['root'].'editor/' ){
  $ctrl->obj->url = $ctrl->get_path().'/'.$url;
  $ctrl->combo(substr($url, strlen($dir)), [
    'root' => $ctrl->data['root'],
    'baseURL' => $ctrl->obj->url.'/',
    'file' => $url
  ]);
}
// Case where the tabnav is already loaded and we just provide the data
else{
  $dirs = new \bbn\ide\directories($ctrl->inc->options, $ctrl->get_routes());
  // Case where it's a new file and we need to provide the tabNav info
  if ( strpos($url, $ctrl->baseURL) === false ){
    if ( $dir = $dirs->dir_from_url($url) ){
      $info = $dirs->dir($dir);
      if ( empty($info['tabs']) ){

      }
      else{
        $tab = array_pop($ctrl->arguments);
        if ( isset($info['tabs'][$tab]) ){
          $ctrl->obj->data = $dirs->load($url, $info['tabs'][$tab], $tab, $ctrl->inc->pref);
        }
      }
    }
  }
  echo '<div class="bbn-editor"></div>';
}
*/