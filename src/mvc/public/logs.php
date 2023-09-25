<?php
/* @var $ctrl \bbn\Mvc */
//get content file log
use bbn\Str;

if (isset($ctrl->post['log'])) {
  $ctrl->addData([
    'log' => $ctrl->post['log'],
    'clear' => !empty($ctrl->post['clear']),
    'num_lines' => isset($ctrl->post['num_lines']) && Str::isInteger($ctrl->post['num_lines']) ? $ctrl->post['num_lines'] : 100
  ])->action();
}
//for delete file
elseif ( isset($ctrl->post['fileLog'], $ctrl->post['md5']) || isset($ctrl->post['delete_file']) ){
  $ctrl->action();
}
//info at first call at the file
else {
  if  ( !empty($ctrl->arguments[0]) ){
    $ctrl->data['file_url'] = $ctrl->arguments[0];
  }
  $ctrl->data['root'] = $ctrl->pluginUrl('appui-ide');
  $ctrl->obj->bcolor = '#333';
  $ctrl->obj->fcolor = '#FFF';
  $ctrl->obj->icon = 'nf nf-fa-file_text';
  $ctrl->setUrl($ctrl->pluginUrl('appui-ide').'/logs')->combo("Log files", $ctrl->data);
}