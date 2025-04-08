<?php

use bbn\X;

/** @var $this \bbn\Mvc\Controller */
if (defined('BBN_BASEURL') && empty(BBN_BASEURL) ){
  $url = $ctrl->pluginUrl('appui-ide').'/profiler';
  $ctrl->setUrl($url)
    ->setColor('#888', '#FFF')
    ->setIcon('nf nf-seti-php')
    ->combo(_('PHP Profiler'), ['root' => $ctrl->pluginUrl('appui-ide')]);
}
elseif ($ctrl->hasArguments() && in_array($ctrl->arguments[0], ['list', 'detail'])) {
  $ctrl->addToObj('./profiler/'.X::join($ctrl->arguments, '/'), [], true);
}