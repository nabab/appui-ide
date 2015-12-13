<?php
/* @var $this \bbn\mvc */
if ( isset($this->post['theme'], $this->post['font'], $this->post['font_size']) ){
  $this->data = $this->post;
  $this->inc->user->set_cfg(["ide" => ["theme" => $this->data['theme'], "font" => $this->data['font'], "font_size" => $this->data['font_size']]]);
  $this->inc->user->save_cfg();
  $this->obj->success = 1;
  $this->obj->script = 'appui.f.closeAlert();';
}
else{
  $this->error = "One or more values are missing";
}
