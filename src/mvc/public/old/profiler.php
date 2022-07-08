<?php

use bbn\X;

/** @var $this \bbn\Mvc\Controller */
if ( empty($ctrl->baseURL) ){
  $url = APPUI_IDE_ROOT.'profiler';
  $title = _("Databases");
  $ctrl->setUrl(APPUI_IDE_ROOT.'profiler')
    ->setColor('#888', '#FFF')
    ->setIcon('nf nf-seti-php')
    ->combo(_('PHP Profiler'), ['root' => BBN_IDE_ROOT]);
}
elseif ($ctrl->hasArguments() && in_array($ctrl->arguments[0], ['list', 'detail'])) {
  $ctrl->addToObj('./profiler/'.x::join($ctrl->arguments, '/'), [], true);
}