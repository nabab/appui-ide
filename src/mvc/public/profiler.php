<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */
$url = '';
if ( count($ctrl->arguments) && ($ctrl->arguments[0] === 'url') ){
  array_shift($ctrl->arguments);
  $url = \bbn\x::join($ctrl->arguments, '/');
}
$ctrl
  ->set_color('#888', '#FFF')
  ->set_url(APPUI_IDE_ROOT.'profiler')
  ->set_icon('nf nf-seti-php')
  ->combo(_('PHP Profiler'), ['url' => $url]);