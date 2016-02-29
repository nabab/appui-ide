<?php
/* @var $this \bbn\mvc */
if ( isset($this->post['log']) ){
  $this->data['log'] = $this->post['log'];
  $this->data['clear'] = !empty($this->post['clear']);
  $this->data['num_lines'] = isset($this->post['num_lines']) && \bbn\str::is_integer($this->post['num_lines']) ? $this->post['num_lines'] : 100;
  $this->obj = $this->get_object_model();
}
else{
  $this->obj->title = "Log files";
  $this->data = $this->get_model();
  echo $this->add_js(['root' => $this->say_dir().'/'])
            ->get_view();
}
?>