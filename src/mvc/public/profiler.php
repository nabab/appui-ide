<?php

use bbn\X;

/** @var bbn\Mvc\Controller $ctrl */
if (!$ctrl->getConstant('baseURL')){
  $url = $ctrl->pluginUrl('appui-ide').'/profiler';
  $ctrl->setUrl($url)
    ->setColor('#888', '#FFF')
    ->setIcon('nf nf-seti-php')
    ->combo(_('PHP Profiler'), ['root' => $ctrl->pluginUrl('appui-ide')]);
}
elseif ($ctrl->hasArguments() && in_array($ctrl->arguments[0], ['list', 'detail'])) {
  $ctrl->addToObj('./profiler/'.X::join($ctrl->arguments, '/'), [], true);
}