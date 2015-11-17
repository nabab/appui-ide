<?php
// Non mandatory, thew path to explore
if ( isset($this->post['path']) ){
  $this->data['path'] = $this->post['path'];
}

if ( isset($this->post['group'], $this->post['mode']) ){
  $this->data['mode'] = $this->post['mode'];
  $this->data['group'] = $this->post['group'];
  $_SESSION[BBN_SESS_NAME]['ide']['dir'] = [
    'dir' => $this->post['group'],
    'subdir' => $this->post['mode']
    ];

  $d = $this->get_model("./editor");

  if ( isset($d['dirs'][$this->data['group']]) ){
    $files = $d['dirs'][$this->data['group']]['files'];
  }
  else{
    $files = $d['dirs'][key($d['dirs'])]['files'];
  }

  if ( ($this->data['group'] !== $this->data['mode']) && isset($files[$this->data['mode']]) ){
    $this->data['dir'] = $files[$this->data['mode']]['fpath'];
  }
  else {
    $this->data['dir'] = isset($files[key($files)]) ? $files[key($files)]['fpath'] : $files['fpath'];
  }
}

$this->obj->data = $this->get_model(\bbn\tools::merge_arrays($this->data, $this->post));
