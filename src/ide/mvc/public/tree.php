<?php
// Non mandatory, thew path to explore
if ( isset($this->post['path']) ){
  $this->data['path'] = $this->post['path'];
}

if ( isset($this->post['mode']) ){
  $this->data['mode'] = $this->post['mode'];
  $_SESSION[BBN_SESS_NAME]['ide']['dir'] = $this->post['mode'];
}
$d = $this->get_model("ide/editor");
if ( isset($this->data['mode'], $d['dirs'][$this->data['mode']]) ){
  $files = $d['dirs'][$this->data['mode']]['files'];
}
else{
  $files = $d['dirs'][key($d['dirs'])]['files'];
}
if ( isset($files['Controller']) ){
  $this->data['dir'] = $files['Controller']['fpath'];
}
else {
  $this->data['dir'] = isset($files[key($files)]) ? $files[key($files)]['fpath'] : $files['fpath'];
}
$this->obj->data = $this->get_model(\bbn\tools::merge_arrays($this->data, $this->post));
