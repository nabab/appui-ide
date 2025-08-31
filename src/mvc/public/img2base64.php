<?php


/** @var bbn\Mvc\Controller $ctrl */
if ( !empty($ctrl->files) ){
  $file = $ctrl->files['file'];
  $content = file_get_contents($file['tmp_name']);
  $ctrl->obj->success = true;
  $ctrl->obj->res = 'data:' . $file['type'] . ';base64,' . base64_encode($content);

}
else{
  $ctrl->combo(_("Image to base64 convertor"));
}