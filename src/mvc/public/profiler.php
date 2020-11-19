<?php
/*
 * Describe what it does!
 *
 **/

use bbn\x;

/** @var $this \bbn\mvc\controller */
if ( empty($ctrl->baseURL) ){
  $url = APPUI_IDE_ROOT.'profiler';
  $title = _("Databases");
  $ctrl->set_url(APPUI_IDE_ROOT.'profiler')
    ->set_color('#888', '#FFF')
    ->set_icon('nf nf-seti-php')
    ->combo(_('PHP Profiler'), ['root' => BBN_IDE_ROOT]);
}
elseif ($ctrl->has_arguments() && in_array($ctrl->arguments[0], ['list', 'detail'])) {
  $ctrl->add_to_obj('./profiler/'.x::join($ctrl->arguments, '/'), [], true);
}