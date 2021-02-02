<?php
/* @var $ctrl \bbn\Mvc */
//get content file log
if ( isset($ctrl->post['log']) ){
  $ctrl->data['log'] = $ctrl->post['log'];
  $ctrl->data['clear'] = !empty($ctrl->post['clear']);
  $ctrl->data['num_lines'] = isset($ctrl->post['num_lines']) && \bbn\Str::isInteger($ctrl->post['num_lines']) ? $ctrl->post['num_lines'] : 100;
  $ctrl->setUrl(APPUI_IDE_ROOT.'logs');
  $ctrl->obj = $ctrl->getObjectModel();
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
  $ctrl->data['root'] = APPUI_IDE_ROOT;
  $ctrl->obj->bcolor = '#333';
  $ctrl->obj->fcolor = '#FFF';
  $ctrl->obj->icon = 'nf nf-fa-file_text';
  $ctrl->setUrl($ctrl->data['root'].'logs')->combo("Log files", $ctrl->data);
}