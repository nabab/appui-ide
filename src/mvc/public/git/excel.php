<?php
/* @var \bbn\mvc\controller $ctrl */
if ( !empty($ctrl->post['excel_file']) ){
  $ctrl->obj->file = $ctrl->post['excel_file'];
}
else {
  $ctrl->action();
}